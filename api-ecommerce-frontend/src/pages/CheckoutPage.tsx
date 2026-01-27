import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Carrinho } from "../types/carrinho";
import { obterOuCriarCarrinho, limparCarrinhoLocal } from "../services/carrinhoService";
import { finalizarPedido } from "../services/pedidoService";
import { useToastContext } from "../contexts/ToastContext";
import styles from "./CheckoutPage.module.css";

function CheckoutPage() {
  const { toast } = useToastContext();

  const [carrinho, setCarrinho] = useState<Carrinho | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [finalizando, setFinalizando] = useState(false);
  const [finalizado, setFinalizado] = useState(false);

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

    try {
      setFinalizando(true);
      await finalizarPedido(carrinho.id);
      limparCarrinhoLocal();
      setFinalizado(true);
      setCarrinho(null);

      toast.success("Pedido finalizado", "Seu pedido foi criado com sucesso.");
    } catch (e: unknown) {
      const maybeMessage =
        typeof e === "object" && e !== null && "message" in e ? String((e as any).message) : undefined;

      toast.error("Erro ao finalizar", maybeMessage || "Tente novamente em alguns segundos.");
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

  if (finalizado) {
    return (
      <div className="container">
        <div className={styles.success}>
          <div className={styles.successTitle}>Pedido finalizado com sucesso 🎉</div>
          <div className={styles.successSub}>Seu pedido foi criado e já está em processamento.</div>

          <div style={{ display: "grid", gap: 10, justifyItems: "center" }}>
            <Link to="/produtos">
              <button className="btnPrimary">Voltar para produtos</button>
            </Link>

            <Link to="/carrinho" style={{ color: "var(--muted)", fontWeight: 700 }}>
              Ver carrinho
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!carrinho || carrinho.itens.length === 0) {
    return (
      <div className="container">
        <h1>Checkout</h1>
        <p>Seu carrinho está vazio.</p>
        <p>
          <Link to="/produtos">Ver produtos</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.header}>
        <h1>Checkout</h1>
        <div className={styles.subtitle}>confira os itens antes de finalizar</div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          {carrinho.itens.map((item) => (
            <div key={item.produto.id} className={styles.item}>
              <div>
                {item.produto.nome} <span>x{item.quantidade}</span>
              </div>
              <div>R$ {(item.produto.preco * item.quantidade).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className={styles.card}>
          <span className="badge">total</span>
          <div className={styles.total}>R$ {carrinho.total.toFixed(2)}</div>

          <button className={`btnPrimary ${styles.cta}`} onClick={handleFinalizar} disabled={finalizando}>
            {finalizando ? "Finalizando..." : "Finalizar pedido"}
          </button>

          <Link to="/carrinho" style={{ color: "var(--muted)", fontWeight: 800 }}>
            Voltar para o carrinho
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
