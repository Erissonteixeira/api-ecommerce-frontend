import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { useToastContext } from "../contexts/ToastContext";
import type { ApiError } from "../types/apiError";
import { userMessageFromError } from "../utils/userMessage";
import styles from "./LoginPage.module.css";

function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToastContext();
  const { login, isAuthenticated, loading } = useAuthContext();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | undefined>(undefined);

  if (!loading && isAuthenticated) {
    return <Navigate to="/produtos" replace />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSalvando(true);
      setErro(null);
      setFieldErrors(undefined);

      await login({
        email,
        senha,
      });

      toast.success("Login realizado", "Sessão iniciada com sucesso.");
      navigate("/produtos");
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.message) setErro(apiError.message);
      if (apiError.fieldErrors) setFieldErrors(apiError.fieldErrors);

      toast.error("Não foi possível entrar", userMessageFromError(error, "Tente novamente."));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Entrar</h1>
          <div className={styles.subtitle}>acesse sua conta para usar carrinho e pedidos</div>
        </div>

        {erro ? <div className={styles.alert}>{erro}</div> : null}

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            e-mail
            <input
              className={`${styles.input} ${fieldErrors?.email ? styles.inputError : ""}`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {fieldErrors?.email ? <span className={styles.fieldError}>{fieldErrors.email}</span> : null}
          </label>

          <label className={styles.label}>
            senha
            <input
              className={`${styles.input} ${fieldErrors?.senha ? styles.inputError : ""}`}
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            {fieldErrors?.senha ? <span className={styles.fieldError}>{fieldErrors.senha}</span> : null}
          </label>

          <div className={styles.actions}>
            <button className="btnPrimary" type="submit" disabled={salvando}>
              {salvando ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </form>

        <div className={styles.footer}>
          Não tem conta? <Link to="/cadastro">Criar conta</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;