import { useEffect, useState } from "react";
import type { Carrinho } from "../types/carrinho";
import { obterOuCriarCarrinho, removerItemDoCarrinho } from "../services/carrinhoService";

function CarrinhoPage() {
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

    try {
      setRemovendoProdutoId(produtoId);
      const atualizado = await removerItemDoCarrinho(carrinho.id, produtoId);
      setCarrinho(atualizado);
    } catch {
      alert("Erro ao remover item do carrinho");
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

  return (
    <div className="container">
      <h1>Carrinho</h1>

      {carrinho.itens.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <>
          <ul style={{ display: "grid", gap: 12, padding: 0, listStyle: "none" }}>
            {carrinho.itens.map((item) => {
              const subtotal = item.produto.preco * item.quantidade;
              const desabilitado = removendoProdutoId === item.produto.id;

              return (
                <li
                  key={item.produto.id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    padding: 12,
                    display: "grid",
                    gap: 6,
                  }}
                >
                  <strong>{item.produto.nome}</strong>

                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <span>quantidade: {item.quantidade}</span>
                    <span>preço: r$ {item.produto.preco.toFixed(2)}</span>
                    <span>subtotal: r$ {subtotal.toFixed(2)}</span>
                  </div>

                  <button onClick={() => handleRemover(item.produto.id)} disabled={desabilitado}>
                    {desabilitado ? "Removendo..." : "Remover"}
                  </button>
                </li>
              );
            })}
          </ul>

          <hr style={{ margin: "16px 0" }} />
          <h2>Total: r$ {carrinho.total.toFixed(2)}</h2>
        </>
      )}
    </div>
  );
}

export default CarrinhoPage;
