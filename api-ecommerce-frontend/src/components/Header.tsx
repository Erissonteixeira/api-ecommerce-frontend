import { NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import styles from "./Header.module.css";

function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthContext();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo} />
          <span>Meu E-commerce</span>
        </div>

        <nav className={styles.nav}>
          <NavLink
            to="/produtos"
            className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
          >
            Produtos
          </NavLink>

          <NavLink
            to="/usuarios"
            className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
          >
            Usuários
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink
                to="/carrinho"
                className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
              >
                Carrinho
              </NavLink>

              <NavLink
                to="/checkout"
                className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
              >
                Checkout
              </NavLink>

              <span className="badge">{user?.nome ?? "Usuário"}</span>
              <button onClick={handleLogout}>Sair</button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
              >
                Entrar
              </NavLink>

              <NavLink
                to="/cadastro"
                className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
              >
                Criar conta
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;