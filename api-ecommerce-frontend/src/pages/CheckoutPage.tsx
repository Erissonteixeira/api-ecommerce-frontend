import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Carrinho } from "../types/carrinho";
import { obterOuCriarCarrinho, limparCarrinhoLocal } from "../services/carrinhoService";
import { finalizarPedido } from "../services/pedidoService";
import type { Pedido } from "../types/pedido";

function CheckoutPage() {
  const [carrinho, setCarrinho] = useState<Carrinho | null>(null);
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [finalizando, setFinalizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      try {
        setCarregando(true);
        setErro(null);
        const c = await obterOuCriarCarrinho();
        setCarrinho(c);
      } catch {
        setErro("Não foi possível carregar o carrinho para checkout.");
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, []);

  async function handleFinalizar() {
    if (!carrinho) return;
    if (carrinho.itens.length === 0) {
      alert("Seu carrinho está vazio.");
      return;
    }

    try {
      setFinalizando(true);
      setErro(null);

      const p = await finalizarPedido(carrinho.id);
      setPedido(p);

      limparCarrinhoLocal();
      setCarrinho(null);
    } catch (e: any) {
      setErro(e?.message ?? "Não foi possível finalizar o pedido.");
    } finally {
      setFinalizando(false);
    }
  }

  if (carregando) {
    return (
      <div className="container">
        <h1>Checkout</h1>
        <p>Carregando...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="container">
        <h1>Checkout</h1>
        <p>{erro}</p>
        <p>
          <Link to="/carrinho">Voltar para o carrinho</Link>
        </p>
      </div>
    );
  }

  if (pedido) {
    return (
      <div className="container">
        <h1>Pedido finalizado com sucesso</h1>
        <p>Seu pedido foi criado.</p>

        <pre style={{ overflow: "auto", padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
          {JSON.stringify(pedido, null, 2)}
        </pre>

        <p>
          <Link to="/produtos">Ir para Produtos</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Checkout</h1>

      {!carrinho || carrinho.itens.length === 0 ? (
        <>
          <p>Seu carrinho está vazio.</p>
          <p>
            <Link to="/produtos">Ver produtos</Link>
          </p>
        </>
      ) : (
        <>
          <h2>Resumo</h2>

          <ul style={{ display: "grid", gap: 10, padding: 0, listStyle: "none" }}>
            {carrinho.itens.map((item) => (
              <li
                key={item.produto.id}
                style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}
              >
                <strong>{item.produto.nome}</strong>
                <div>quantidade: {item.quantidade}</div>
                <div>preço: r$ {item.produto.preco.toFixed(2)}</div>
                <div>subtotal: r$ {(item.produto.preco * item.quantidade).toFixed(2)}</div>
              </li>
            ))}
          </ul>

          <h2>Total: r$ {carrinho.total.toFixed(2)}</h2>

          <button onClick={handleFinalizar} disabled={finalizando}>
            {finalizando ? "Finalizando..." : "Finalizar pedido"}
          </button>

          <p>
            <Link to="/carrinho">Voltar para o carrinho</Link>
          </p>
        </>
      )}
    </div>
  );
}

export default CheckoutPage;
