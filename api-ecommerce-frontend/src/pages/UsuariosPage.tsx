import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { UsuarioResponse } from "../types/usuario";
import { listarUsuarios, removerUsuario } from "../services/usuariosService";
import { useToastContext } from "../contexts/ToastContext";
import { userMessageFromError } from "../utils/userMessage";
import { toastTexts } from "../utils/toastTexts";
import styles from "./UsuariosPage.module.css";

function UsuariosPage() {
  const { toast } = useToastContext();

  const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [removendoId, setRemovendoId] = useState<number | null>(null);

  useEffect(() => {
    async function carregar() {
      try {
        setCarregando(true);
        setErro(null);
        const data = await listarUsuarios();
        setUsuarios(data);
      } catch {
        setErro("Não foi possível carregar os usuários.");
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, []);

  async function handleRemover(id: number) {
    const usuario = usuarios.find((u) => u.id === id);
    const nome = usuario?.nome;

    try {
      setRemovendoId(id);
      await removerUsuario(id);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));

      toast.success(toastTexts.usuarios.removeSuccessTitle, toastTexts.usuarios.removeSuccessMessage(nome));
    } catch (e: unknown) {
      const msg = userMessageFromError(e, toastTexts.fallback.tryAgain);
      toast.error(toastTexts.usuarios.removeErrorTitle, msg);
    } finally {
      setRemovendoId(null);
    }
  }

  if (carregando) {
    return (
      <div className="container">
        <h1>Usuários</h1>
        <p>Carregando...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="container">
        <h1>Usuários</h1>
        <p>{erro}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>Usuários</h1>
          <div className={styles.subtitle}>gerencie usuários do e-commerce</div>
        </div>

        <Link className={styles.linkCard} to="/usuarios/novo">
          Novo usuário →
        </Link>
      </div>

      {usuarios.length === 0 ? (
        <div className={styles.empty}>
          <p>Nenhum usuário cadastrado.</p>
          <p>
            <Link to="/usuarios/novo" className={styles.linkCard}>
              Criar primeiro usuário →
            </Link>
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {usuarios.map((u) => {
            const desabilitado = removendoId === u.id;

            return (
              <div key={u.id} className={styles.card}>
                <div className={styles.name}>{u.nome}</div>

                <div className={styles.meta}>
                  <span className="badge">id #{u.id}</span>
                  <span className="badge">{u.email}</span>
                </div>

                <div className={styles.metaRow}>
                  <span>
                    cpf: <strong>{u.cpf}</strong>
                  </span>
                  <span>
                    whatsapp: <strong>{u.whatsapp}</strong>
                  </span>
                </div>

                <div className={styles.actions}>
                  <Link className={styles.link} to={`/usuarios/${u.id}/editar`}>
                    Editar
                  </Link>

                  <button className="btnDanger" onClick={() => handleRemover(u.id)} disabled={desabilitado}>
                    {desabilitado ? "Removendo..." : "Remover"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default UsuariosPage;