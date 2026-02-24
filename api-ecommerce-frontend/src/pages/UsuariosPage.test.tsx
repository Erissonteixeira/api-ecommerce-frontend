import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import UsuariosPage from "./UsuariosPage";

const toastSuccess = vi.fn();
const toastError = vi.fn();

vi.mock("../services/usuariosService", () => ({
  listarUsuarios: vi.fn(),
  removerUsuario: vi.fn(),
}));

vi.mock("../contexts/ToastContext", () => ({
  useToastContext: () => ({
    toast: {
      success: toastSuccess,
      error: toastError,
    },
  }),
}));

import { listarUsuarios, removerUsuario } from "../services/usuariosService";
import { toastTexts } from "../utils/toastTexts";

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/usuarios"]}>
      <UsuariosPage />
    </MemoryRouter>
  );
}

const usuariosMock = [
  {
    id: 2,
    nome: "Erisson Teixeira",
    email: "erisson.teste@gmail.com",
    cpf: "85683477860",
    whatsapp: "51 99235-7588",
  },
  {
    id: 3,
    nome: "Fernando luis",
    email: "fernando.teste@gmail.com",
    cpf: "89076549908",
    whatsapp: "51 3443-0620",
  },
];

describe("UsuariosPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("mostra carregando e depois lista usuários", async () => {
    (listarUsuarios as any).mockResolvedValueOnce(usuariosMock);

    renderPage();

    expect(screen.getByText(/carregando/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Erisson Teixeira")).toBeInTheDocument();
      expect(screen.getByText("Fernando luis")).toBeInTheDocument();
    });

    expect(screen.getByText("85683477860")).toBeInTheDocument();
    expect(screen.getByText("51 99235-7588")).toBeInTheDocument();
    expect(screen.getByText("89076549908")).toBeInTheDocument();
    expect(screen.getByText("51 3443-0620")).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /novo usuário/i })).toBeInTheDocument();
  });

  it("mostra estado vazio quando não há usuários", async () => {
    (listarUsuarios as any).mockResolvedValueOnce([]);

    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/nenhum usuário cadastrado/i)).toBeInTheDocument();
    });

    expect(screen.getByRole("link", { name: /criar primeiro usuário/i })).toBeInTheDocument();
  });

  it("mostra erro quando falha ao carregar", async () => {
    (listarUsuarios as any).mockRejectedValueOnce(new Error("falha"));

    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/não foi possível carregar os usuários/i)).toBeInTheDocument();
    });
  });

  it("remove usuário com sucesso, tira da tela e mostra toast", async () => {
    (listarUsuarios as any).mockResolvedValueOnce(usuariosMock);
    (removerUsuario as any).mockResolvedValueOnce(undefined);

    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Erisson Teixeira")).toBeInTheDocument();
    });

    const botoesRemover = screen.getAllByRole("button", { name: /remover/i });
    await userEvent.click(botoesRemover[0]);

    await waitFor(() => {
      expect(removerUsuario).toHaveBeenCalledWith(2);
    });

    await waitFor(() => {
      expect(screen.queryByText("Erisson Teixeira")).not.toBeInTheDocument();
      expect(screen.getByText("Fernando luis")).toBeInTheDocument();
    });

    expect(toastSuccess).toHaveBeenCalledWith(
      toastTexts.usuarios.removeSuccessTitle,
      toastTexts.usuarios.removeSuccessMessage("Erisson Teixeira")
    );
  });

  it("mostra toast de erro quando remover falha", async () => {
    (listarUsuarios as any).mockResolvedValueOnce(usuariosMock);
    (removerUsuario as any).mockRejectedValueOnce({ message: "Erro ao remover" });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Erisson Teixeira")).toBeInTheDocument();
    });

    const botoesRemover = screen.getAllByRole("button", { name: /remover/i });
    await userEvent.click(botoesRemover[0]);

    await waitFor(() => {
      expect(removerUsuario).toHaveBeenCalledWith(2);
    });

    expect(toastError).toHaveBeenCalled();
    expect(toastError.mock.calls[0][0]).toBe(toastTexts.usuarios.removeErrorTitle);
  });
});