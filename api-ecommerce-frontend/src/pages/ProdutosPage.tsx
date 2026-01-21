import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarProdutos } from "../services/produtosService";
import type { Produto } from "../types/produto";

function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      try {
        const data = await listarProdutos();
        setProdutos(data);
      } catch {
        setErro("Não foi possível carregar os produtos.");
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, []);

  if (carregando) {
    return (
      <div className="container">
        <h1>Produtos</h1>
        <p>Carregando...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="container">
        <h1>Produtos</h1>
        <p>{erro}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Produtos</h1>

      {produtos.length === 0 ? (
        <p>Nenhum produto encontrado.</p>
      ) : (
        <ul>
          {produtos.map((p) => (
            <li key={p.id}>
              <Link to={`/produtos/${p.id}`}>
                {p.nome} — R$ {p.preco}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProdutosPage;
