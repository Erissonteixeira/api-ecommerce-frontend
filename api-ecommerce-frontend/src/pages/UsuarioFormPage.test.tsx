import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import UsuarioFormPage from "./UsuarioFormPage";
import { maskWhatsapp } from "../utils/masks";
import { toastTexts } from "../utils/toastTexts";

const toastSpy = {
  success: vi.fn(),
  error: vi.fn(),
};

vi.mock("../contexts/ToastContext", () => ({
  useToastContext: () => ({ toast: toastSpy }),
}));

const buscarUsuarioPorIdMock = vi.fn();
const criarUsuarioMock = vi.fn();
const atualizarUsuarioMock = vi.fn();

vi.mock("../services/usuariosService", () => ({
  buscarUsuarioPorId: (...args: any[]) => buscarUsuarioPorIdMock(...args),
  criarUsuario: (...args: any[]) => criarUsuarioMock(...args),
  atualizarUsuario: (...args: any[]) => atualizarUsuarioMock(...args),
}));

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual: any = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

function renderNovo() {
  return render(
    <MemoryRouter initialEntries={["/usuarios/novo"]}>
      <Routes>
        <Route path="/usuarios/novo" element={<UsuarioFormPage />} />
      </Routes>
    </MemoryRouter>
  );
}

function renderEditar(id = 2) {
  return render(
    <MemoryRouter initialEntries={[`/usuarios/${id}/editar`]}>
      <Routes>
        <Route path="/usuarios/:id/editar" element={<UsuarioFormPage />} />
      </Routes>
    </MemoryRouter>
  );
}

function getInputByLabelText(label: RegExp) {
  return screen.getByLabelText(label) as HTMLInputElement;
}

describe("UsuarioFormPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("modo NOVO: renderiza e cria usuário (aplica máscara no whatsapp), mostra toast e navega", async () => {
    criarUsuarioMock.mockResolvedValueOnce({
      id: 10,
      nome: "Fulano",
      email: "fulano@teste.com",
      whatsapp: "51 99999-9999",
      cpf: "12345678901",
    });

    renderNovo();

    expect(screen.getByRole("heading", { name: /novo usuário/i })).toBeInTheDocument();

    const nome = getInputByLabelText(/^nome$/i);
    const email = getInputByLabelText(/^email$/i);
    const whatsapp = getInputByLabelText(/^whatsapp$/i);
    const cpf = getInputByLabelText(/^cpf$/i);
    const senha = getInputByLabelText(/^senha/i);

    await userEvent.type(nome, "Erisson Teixeira");
    await userEvent.type(email, "erisson.teste@gmail.com");
    await userEvent.type(whatsapp, "51992357588");
    await userEvent.type(cpf, "85683477860");
    await userEvent.type(senha, "Senha@123");

    await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

    await waitFor(() => {
      expect(criarUsuarioMock).toHaveBeenCalledTimes(1);
    });

    const payload = criarUsuarioMock.mock.calls[0][0];
    expect(payload).toMatchObject({
      nome: "Erisson Teixeira",
      email: "erisson.teste@gmail.com",
      cpf: "85683477860",
      senha: "Senha@123",
      whatsapp: maskWhatsapp("51992357588"),
    });

    expect(toastSpy.success).toHaveBeenCalledWith(
      toastTexts.usuarios.createSuccessTitle,
      toastTexts.usuarios.createSuccessMessage
    );

    expect(navigateMock).toHaveBeenCalledWith("/usuarios");
  });

  it("modo EDITAR: mostra loading, carrega usuário por id, preenche campos (senha vazia) e atualiza com máscara", async () => {
    buscarUsuarioPorIdMock.mockResolvedValueOnce({
      id: 2,
      nome: "Erisson Teixeira",
      email: "erisson.teste@gmail.com",
      whatsapp: "51 99235-7588",
      cpf: "85683477860",
    });

    atualizarUsuarioMock.mockResolvedValueOnce({
      id: 2,
      nome: "Erisson Teixeira",
      email: "erisson.teste@gmail.com",
      whatsapp: "51 99235-7588",
      cpf: "85683477860",
    });

    renderEditar(2);

    expect(screen.getByText(/carregando/i)).toBeInTheDocument();

    const nome = await screen.findByDisplayValue("Erisson Teixeira");
    expect(nome).toBeInTheDocument();

    const senha = getInputByLabelText(/^senha/i);
    expect(senha.value).toBe("");

    const whatsapp = getInputByLabelText(/^whatsapp$/i);
    expect(whatsapp.value).toBe("51 99235-7588");

    await userEvent.clear(whatsapp);
    await userEvent.type(whatsapp, "5134430620");
    await userEvent.type(senha, "Senha@123");

    await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

    await waitFor(() => {
      expect(atualizarUsuarioMock).toHaveBeenCalledTimes(1);
    });

    const [idArg, payload] = atualizarUsuarioMock.mock.calls[0];
    expect(idArg).toBe(2);
    expect(payload.whatsapp).toBe(maskWhatsapp("5134430620"));

    expect(toastSpy.success).toHaveBeenCalledWith(
      toastTexts.usuarios.updateSuccessTitle,
      toastTexts.usuarios.updateSuccessMessage
    );

    expect(navigateMock).toHaveBeenCalledWith("/usuarios");
  });

  it("quando falha ao carregar no modo editar: mostra mensagem de erro", async () => {
    buscarUsuarioPorIdMock.mockRejectedValueOnce(new Error("boom"));

    renderEditar(99);

    await waitFor(() => {
      expect(screen.getByText(/não foi possível carregar o usuário/i)).toBeInTheDocument();
    });
  });

  it("quando salvar falha com ApiError + fieldErrors: mostra alert + lista de erros e toast de erro", async () => {
    criarUsuarioMock.mockRejectedValueOnce({
      status: 400,
      message: "Dados inválidos",
      errors: {
        email: "E-mail inválido",
        whatsapp: "Whatsapp inválido",
      },
    });

    renderNovo();

    await userEvent.type(getInputByLabelText(/^nome$/i), "A");
    await userEvent.type(getInputByLabelText(/^email$/i), "x");
    await userEvent.type(getInputByLabelText(/^whatsapp$/i), "51");
    await userEvent.type(getInputByLabelText(/^cpf$/i), "1");
    await userEvent.type(getInputByLabelText(/^senha/i), "Senha@123");

    const form = document.querySelector("form");
    if (!form) throw new Error("Form não encontrado no teste");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(criarUsuarioMock).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(toastSpy.error).toHaveBeenCalled();
    });

  const fieldErrors = screen.getByText(/corrija os campos abaixo/i).parentElement!;
expect(fieldErrors).toHaveTextContent(/email\s*:\s*e-mail inválido/i);
expect(fieldErrors).toHaveTextContent(/whatsapp\s*:\s*whatsapp inválido/i);

    expect(toastSpy.error.mock.calls[0][0]).toBe(toastTexts.usuarios.saveErrorTitle);
  });
});