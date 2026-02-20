import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { ApiError } from "../types/apiError";
import type { UsuarioRequest } from "../types/usuario";
import { atualizarUsuario, buscarUsuarioPorId, criarUsuario } from "../services/usuariosService";
import { useToastContext } from "../contexts/ToastContext";
import { userMessageFromError } from "../utils/userMessage";
import { toastTexts } from "../utils/toastTexts";
import styles from "./UsuarioFormPage.module.css";
import { maskWhatsapp } from "../utils/masks";

function UsuarioFormPage() {
  const { toast } = useToastContext();
  const navigate = useNavigate();
  const params = useParams();

  const whatsappRef = useRef<HTMLInputElement>(null);

  const usuarioId = useMemo(() => {
    const raw = params.id;
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }, [params.id]);

  const editando = usuarioId !== null;

  const [carregando, setCarregando] = useState(editando);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | undefined>(undefined);

  const [form, setForm] = useState<UsuarioRequest>({
    nome: "",
    email: "",
    whatsapp: "",
    cpf: "",
    senha: "",
  });

  useEffect(() => {
    async function carregar() {
      if (!editando || usuarioId === null) return;

      try {
        setCarregando(true);
        setErro(null);
        setFieldErrors(undefined);

        const u = await buscarUsuarioPorId(usuarioId);

        setForm({
          nome: u.nome ?? "",
          email: u.email ?? "",
          whatsapp: u.whatsapp ?? "",
          cpf: u.cpf ?? "",
          senha: "",
        });
      } catch {
        setErro("Não foi possível carregar o usuário.");
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [editando, usuarioId]);

  function setValue<K extends keyof UsuarioRequest>(key: K, value: UsuarioRequest[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function aplicarApiError(err: unknown) {
    const e = err as ApiError;
    if (e && typeof e === "object") {
      if (typeof e.message === "string" && e.message.trim()) setErro(e.message);
      if (e.errors) setFieldErrors(e.errors);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSalvando(true);
      setErro(null);
      setFieldErrors(undefined);

      const rawWhatsapp = whatsappRef.current?.value ?? form.whatsapp;

      const payload: UsuarioRequest = {
        ...form,
        whatsapp: maskWhatsapp(rawWhatsapp),
      };

      if (editando && usuarioId !== null) {
        await atualizarUsuario(usuarioId, payload);
        toast.success(
          toastTexts.usuarios.updateSuccessTitle,
          toastTexts.usuarios.updateSuccessMessage
        );
      } else {
        await criarUsuario(payload);
        toast.success(
          toastTexts.usuarios.createSuccessTitle,
          toastTexts.usuarios.createSuccessMessage
        );
      }

      navigate("/usuarios");
    } catch (err: unknown) {
      aplicarApiError(err);
      const msg = userMessageFromError(err, toastTexts.fallback.tryAgain);
      toast.error(toastTexts.usuarios.saveErrorTitle, msg);
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <div className="container">
        <h1>{editando ? "Editar usuário" : "Novo usuário"}</h1>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>{editando ? "Editar usuário" : "Novo usuário"}</h1>
          <div className={styles.subtitle}>preencha os dados e salve</div>
        </div>

        <Link className={styles.linkCard} to="/usuarios">
          Voltar →
        </Link>
      </div>

      {erro ? <div className={styles.alert}>{erro}</div> : null}

      {fieldErrors ? (
        <div className={styles.fieldErrors}>
          <div className={styles.fieldErrorsTitle}>corrija os campos abaixo:</div>
          <ul>
            {Object.entries(fieldErrors).map(([k, v]) => (
              <li key={k}>
                <strong>{k}</strong>: {v}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <label className={styles.label}>
            nome
            <input
              className={styles.input}
              value={form.nome}
              onChange={(e) => setValue("nome", e.target.value)}
            />
          </label>

          <label className={styles.label}>
            email
            <input
              className={styles.input}
              value={form.email}
              onChange={(e) => setValue("email", e.target.value)}
              type="email"
              inputMode="email"
            />
          </label>
        </div>

        <div className={styles.row}>
          <label className={styles.label}>
            whatsapp
            <input
              ref={whatsappRef}
              className={styles.input}
              value={form.whatsapp}
              onChange={(e) => setValue("whatsapp", maskWhatsapp(e.target.value))}
              inputMode="tel"
              placeholder="99 99999-9999"
            />
          </label>

          <label className={styles.label}>
            cpf
            <input
              className={styles.input}
              value={form.cpf}
              onChange={(e) => setValue("cpf", e.target.value)}
              inputMode="numeric"
            />
          </label>
        </div>

        <div className={styles.row}>
          <label className={styles.label}>
            senha (obrigatória)
            <input
              className={styles.input}
              value={form.senha}
              onChange={(e) => setValue("senha", e.target.value)}
              type="password"
            />
          </label>

          <div className={styles.hint}>
            <span className="badge">regra</span>
            <div className={styles.hintText}>
              mín. 8 caracteres + 1 maiúscula + 1 especial
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className="btnPrimary" type="submit" disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar"}
          </button>

          <Link className={styles.link} to="/usuarios">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}

export default UsuarioFormPage;