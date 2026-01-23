import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarProdutos } from "../services/produtosService";
import type { Produto } from "../types/produto";
import styles from "./ProdutosPage.module.css";

function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      try {
        setCarregando(true);
        setErro(null);
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
        <div className={styles.grid}>
          {produtos.map((produto) => (
            <div key={produto.id} className={styles.card}>
              <div className={styles.name}>{produto.nome}</div>
              <div className={styles.price}>R$ {produto.preco.toFixed(2)}</div>

              <div className={styles.actions}>
                <span className="badge">Disponível</span>
                <Link className={styles.link} to={`/produtos/${produto.id}`}>
                  Ver detalhes
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProdutosPage;
