import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import ProdutosPage from "./pages/ProdutosPage";
import ProdutoDetalhePage from "./pages/ProdutoDetalhePage";
import CarrinhoPage from "./pages/CarrinhoPage";
import CheckoutPage from "./pages/CheckoutPage";
import { ToastProvider } from "./contexts/ToastContext";

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
      </Routes>
    </ToastProvider>
  );
}

export default App;
