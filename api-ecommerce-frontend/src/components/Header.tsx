import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="app-header">
      <div className="container app-header-content">
        <h2 className="app-title">
          <Link to="/" className="app-brand">
            Meu E-commerce
          </Link>
        </h2>

        <nav className="app-nav">
          <Link to="/produtos" className="app-nav-link">
            Produtos
          </Link>
          <Link to="/carrinho" className="app-nav-link">
            Carrinho
          </Link>
          <Link to="/checkout" className="app-nav-link">
            Checkout
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
