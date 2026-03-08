import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { useToastContext } from "../contexts/ToastContext";
import type { ApiError } from "../types/apiError";
import { maskWhatsapp } from "../utils/masks";
import { userMessageFromError } from "../utils/userMessage";
import styles from "./RegisterPage.module.css";

function RegisterPage() {
  const navigate = useNavigate();
  const { toast } = useToastContext();
  const { register, isAuthenticated, loading } = useAuthContext();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    whatsapp: "",
    cpf: "",
    senha: "",
  });

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | undefined>(undefined);

  if (!loading && isAuthenticated) {
    return <Navigate to="/produtos" replace />;
  }

  function setValue<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSalvando(true);
      setErro(null);
      setFieldErrors(undefined);

      await register({
        ...form,
        whatsapp: maskWhatsapp(form.whatsapp),
      });

      toast.success("Conta criada", "Cadastro realizado com sucesso.");
      navigate("/produtos");
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.message) setErro(apiError.message);
      if (apiError.fieldErrors) setFieldErrors(apiError.fieldErrors);

      toast.error("Não foi possível cadastrar", userMessageFromError(error, "Tente novamente."));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Criar conta</h1>
          <div className={styles.subtitle}>cadastre-se para usar carrinho e fechar pedidos</div>
        </div>

        {erro ? <div className={styles.alert}>{erro}</div> : null}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <label className={styles.label}>
              nome
              <input
                className={`${styles.input} ${fieldErrors?.nome ? styles.inputError : ""}`}
                value={form.nome}
                onChange={(e) => setValue("nome", e.target.value)}
              />
              {fieldErrors?.nome ? <span className={styles.fieldError}>{fieldErrors.nome}</span> : null}
            </label>

            <label className={styles.label}>
              e-mail
              <input
                className={`${styles.input} ${fieldErrors?.email ? styles.inputError : ""}`}
                type="email"
                value={form.email}
                onChange={(e) => setValue("email", e.target.value)}
              />
              {fieldErrors?.email ? <span className={styles.fieldError}>{fieldErrors.email}</span> : null}
            </label>
          </div>

          <div className={styles.row}>
            <label className={styles.label}>
              whatsapp
              <input
                className={`${styles.input} ${fieldErrors?.whatsapp ? styles.inputError : ""}`}
                value={form.whatsapp}
                onChange={(e) => setValue("whatsapp", maskWhatsapp(e.target.value))}
                placeholder="99 99999-9999"
              />
              {fieldErrors?.whatsapp ? <span className={styles.fieldError}>{fieldErrors.whatsapp}</span> : null}
            </label>

            <label className={styles.label}>
              cpf
              <input
                className={`${styles.input} ${fieldErrors?.cpf ? styles.inputError : ""}`}
                value={form.cpf}
                onChange={(e) => setValue("cpf", e.target.value)}
              />
              {fieldErrors?.cpf ? <span className={styles.fieldError}>{fieldErrors.cpf}</span> : null}
            </label>
          </div>

          <label className={styles.label}>
            senha
            <input
              className={`${styles.input} ${fieldErrors?.senha ? styles.inputError : ""}`}
              type="password"
              value={form.senha}
              onChange={(e) => setValue("senha", e.target.value)}
            />
            {fieldErrors?.senha ? <span className={styles.fieldError}>{fieldErrors.senha}</span> : null}
          </label>

          <div className={styles.actions}>
            <button className="btnPrimary" type="submit" disabled={salvando}>
              {salvando ? "Cadastrando..." : "Criar conta"}
            </button>
          </div>
        </form>

        <div className={styles.footer}>
          Já tem conta? <Link to="/login">Entrar</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;