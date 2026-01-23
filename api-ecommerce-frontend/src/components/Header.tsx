import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";

function Header() {
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
        </nav>
      </div>
    </header>
  );
}

export default Header;
