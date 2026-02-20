import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import ProdutosPage from "./pages/ProdutosPage";
import ProdutoDetalhePage from "./pages/ProdutoDetalhePage";
import CarrinhoPage from "./pages/CarrinhoPage";
import CheckoutPage from "./pages/CheckoutPage";
import { ToastProvider } from "./contexts/ToastContext";
import UsuariosPage from "./pages/UsuariosPage";
import UsuarioFormPage from "./pages/UsuarioFormPage";

function App() {
  return (
    <ToastProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/produtos" replace />} />
        <Route path="/produtos" element={<ProdutosPage />} />
        <Route path="/produtos/:id" element={<ProdutoDetalhePage />} />
        <Route path="/carrinho" element={<CarrinhoPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/usuarios" element={<UsuariosPage />} />
        <Route path="/usuarios/novo" element={<UsuarioFormPage />} />
        <Route path="/usuarios/:id/editar" element={<UsuarioFormPage />} />
        </Routes>
    </ToastProvider>
  );
}

export default App;
