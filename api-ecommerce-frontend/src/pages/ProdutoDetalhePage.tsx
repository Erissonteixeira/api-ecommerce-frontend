import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { buscarProdutoPorId } from "../services/produtosService";
import { obterOuCriarCarrinho, adicionarItemAoCarrinho } from "../services/carrinhoService";
import type { Produto } from "../types/produto";
import { useToastContext } from "../contexts/ToastContext";
import { userMessageFromError } from "../utils/userMessage";
import { toastTexts } from "../utils/toastTexts";
import styles from "./ProdutoDetalhePage.module.css";

function ProdutoDetalhePage() {
  const { id } = useParams();
  const { toast } = useToastContext();

  const [produto, setProduto] = useState<Produto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [adicionando, setAdicionando] = useState(false);
  const [quantidade, setQuantidade] = useState<number>(1);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro(null);

      const idNumber = Number(id);
      if (!id || Number.isNaN(idNumber)) {
        setErro("ID do produto inválido.");
        setCarregando(false);
        return;
      }

      try {
        const data = await buscarProdutoPorId(idNumber);
        setProduto(data);
      } catch {
        setErro("Não foi possível carregar o produto.");
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [id]);

  async function handleAdicionarAoCarrinho() {
    if (!produto) return;

    const qtd = Number(quantidade);
    if (!Number.isFinite(qtd) || qtd < 1) {
      toast.error("Quantidade inválida", "Informe um número maior ou igual a 1.");
      return;
    }

    try {
      setAdicionando(true);
      const carrinho = await obterOuCriarCarrinho();

      await adicionarItemAoCarrinho(carrinho.id, {
        produtoId: produto.id,
        nomeProduto: produto.nome,
        preco: produto.preco,
        quantidade: qtd,
      });

      toast.success(toastTexts.carrinho.addSuccessTitle, toastTexts.carrinho.addSuccessMessage(produto.nome, qtd));
    } catch (e: unknown) {
      const msg = userMessageFromError(e, toastTexts.fallback.tryAgain);
      toast.error(toastTexts.carrinho.addErrorTitle, msg);
    } finally {
      setAdicionando(false);
    }
  }

  function diminuirQuantidade() {
    setQuantidade((q) => Math.max(1, q - 1));
  }

  function aumentarQuantidade() {
    setQuantidade((q) => q + 1);
  }

  if (carregando) {
    return (
      <div className="container">
        <h1>Detalhe do Produto</h1>
        <p>Carregando...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="container">
        <h1>Detalhe do Produto</h1>
        <p>{erro}</p>
        <p>
          <Link to="/produtos">Voltar para Produtos</Link>
        </p>
      </div>
    );
  }

  if (!produto) {
    return (
      <div className="container">
        <h1>Detalhe do Produto</h1>
        <p>Produto não encontrado.</p>
        <p>
          <Link to="/produtos">Voltar para Produtos</Link>
        </p>
      </div>
    );
  }

  const subtotal = produto.preco * quantidade;

  return (
    <div className="container">
      <div className={styles.wrap}>
        <div className={styles.left}>
          <div className={styles.title}>
            <div className={styles.name}>{produto.nome}</div>
            <div className={styles.idTag}>ID #{produto.id}</div>
          </div>

          <div className={styles.price}>R$ {produto.preco.toFixed(2)}</div>

          <div className={styles.meta}>
            <span className="badge">disponível</span>
          </div>

          <div className={styles.row}>
            <span className={styles.qtyLabel}>quantidade</span>
            <div className={styles.qtyBox}>
              <button type="button" className={styles.qtyBtn} onClick={diminuirQuantidade} disabled={adicionando}>
                -
              </button>

              <input
                className={styles.qtyInput}
                type="number"
                min={1}
                value={quantidade}
                onChange={(e) => setQuantidade(Math.max(1, Number(e.target.value)))}
                disabled={adicionando}
              />

              <button type="button" className={styles.qtyBtn} onClick={aumentarQuantidade} disabled={adicionando}>
                +
              </button>
            </div>
          </div>

          <p className={styles.small}>
            subtotal estimado: <strong>r$ {subtotal.toFixed(2)}</strong>
          </p>
        </div>

        <div className={styles.right}>
          <h2>Finalizar</h2>

          <div className={styles.cta}>
            <button className={`btnPrimary ${styles.primary}`} onClick={handleAdicionarAoCarrinho} disabled={adicionando}>
              {adicionando ? "Adicionando..." : "Adicionar ao Carrinho"}
            </button>

            <Link className={`card ${styles.secondary}`} to="/carrinho">
              Ir para o carrinho →
            </Link>

            <Link className={`card ${styles.secondary}`} to="/produtos">
              ← Voltar para produtos
            </Link>
          </div>

          <p className={styles.small}>dica: você pode adicionar mais itens e finalizar no checkout quando quiser.</p>
        </div>
      </div>
    </div>
  );
}

export default ProdutoDetalhePage;
