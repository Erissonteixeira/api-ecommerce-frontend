import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Carrinho } from "../types/carrinho";
import { obterOuCriarCarrinho, removerItemDoCarrinho } from "../services/carrinhoService";
import { useToastContext } from "../contexts/ToastContext";
import { userMessageFromError } from "../utils/userMessage";
import styles from "./CarrinhoPage.module.css";

function CarrinhoPage() {
  const { toast } = useToastContext();

  const [carrinho, setCarrinho] = useState<Carrinho | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [removendoProdutoId, setRemovendoProdutoId] = useState<number | null>(null);

  useEffect(() => {
    async function carregar() {
      try {
        setCarregando(true);
        setErro(null);
        const c = await obterOuCriarCarrinho();
        setCarrinho(c);
      } catch {
        setErro("Não foi possível carregar o carrinho.");
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, []);

  async function handleRemover(produtoId: number) {
    if (!carrinho) return;

    const item = carrinho.itens.find((i) => i.produto.id === produtoId);
    const nome = item?.produto.nome;

    try {
      setRemovendoProdutoId(produtoId);
      const atualizado = await removerItemDoCarrinho(carrinho.id, produtoId);
      setCarrinho(atualizado);

      toast.success("Item removido", nome ? `${nome} foi removido do carrinho.` : "Item removido do carrinho.");
    } catch (e: unknown) {
      const msg = userMessageFromError(e, "Tente novamente em alguns segundos.");
      toast.error("Não foi possível remover", msg);
    } finally {
      setRemovendoProdutoId(null);
    }
  }

  if (carregando) {
    return (
      <div className="container">
        <h1>Carrinho</h1>
        <p>Carregando...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="container">
        <h1>Carrinho</h1>
        <p>{erro}</p>
        <p>
          <Link to="/produtos">Voltar para Produtos</Link>
        </p>
      </div>
    );
  }

  if (!carrinho) {
    return (
      <div className="container">
        <h1>Carrinho</h1>
        <p>Carrinho sem dados.</p>
      </div>
    );
  }

  const total = carrinho.total;

  return (
    <div className="container">
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>Carrinho</h1>
          <div className={styles.subtitle}>revise seus itens antes de finalizar o pedido</div>
        </div>

        <span className="badge">{carrinho.itens.length} item(ns)</span>
      </div>

      {carrinho.itens.length === 0 ? (
        <div className={styles.empty}>
          <p>Seu carrinho está vazio.</p>
          <p>
            <Link to="/produtos" className={styles.linkCard}>
              Ver produtos →
            </Link>
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          <div className={styles.list}>
            {carrinho.itens.map((item) => {
              const subtotal = item.produto.preco * item.quantidade;
              const desabilitado = removendoProdutoId === item.produto.id;

              return (
                <div key={item.produto.id} className={styles.item}>
                  <div className={styles.itemTop}>
                    <div>
                      <div className={styles.name}>{item.produto.nome}</div>
                      <div className={styles.badges}>
                        <span className="badge">id #{item.produto.id}</span>
                        <span className="badge">quantidade {item.quantidade}</span>
                      </div>
                    </div>

                    <button className="btnDanger" onClick={() => handleRemover(item.produto.id)} disabled={desabilitado}>
                      {desabilitado ? "Removendo..." : "Remover"}
                    </button>
                  </div>

                  <div className={styles.metaRow}>
                    <span>
                      preço: <strong>r$ {item.produto.preco.toFixed(2)}</strong>
                    </span>
                    <span>
                      subtotal: <strong>r$ {subtotal.toFixed(2)}</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <aside className={styles.side}>
            <span className="badge">resumo</span>
            <div className={styles.total}>R$ {total.toFixed(2)}</div>
            <div className={styles.subtitle}>total do carrinho</div>

            <div className={styles.sideActions}>
              <Link className={styles.linkCard} to="/checkout">
                Ir para o checkout →
              </Link>

              <Link className={styles.linkCard} to="/produtos">
                Continuar comprando →
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default CarrinhoPage;
