import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { buscarProdutoPorId } from "../services/produtosService";
import type { Produto } from "../types/produto";

function ProdutoDetalhePage() {
  const { id } = useParams();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

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

  return (
    <div className="container">
      <h1>Detalhe do Produto</h1>

      <p>
        <strong>ID:</strong> {produto.id}
      </p>
      <p>
        <strong>Nome:</strong> {produto.nome}
      </p>
      <p>
        <strong>Preço:</strong> R$ {produto.preco}
      </p>

      {"ativo" in produto && (
        <p>
          <strong>Ativo:</strong> {produto.ativo ? "Sim" : "Não"}
        </p>
      )}

      {"criadoEm" in produto && (
        <p>
          <strong>Criado em:</strong> {produto.criadoEm}
        </p>
      )}

      {"atualizadoEm" in produto && (
        <p>
          <strong>Atualizado em:</strong> {produto.atualizadoEm ?? "-"}
        </p>
      )}

      <p>
        <Link to="/produtos">← Voltar para Produtos</Link>
      </p>
    </div>
  );
}

export default ProdutoDetalhePage;
