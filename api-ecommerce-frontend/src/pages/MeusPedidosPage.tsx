import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarMeusPedidos } from "../services/pedidoService";
import type { Pedido } from "../types/pedido";
import { userMessageFromError } from "../utils/userMessage";
import styles from "./MeusPedidosPage.module.css";

function getStatusClass(status: string, base: string, criado: string, finalizado: string, cancelado: string) {
  if (status === "CRIADO") return `${base} ${criado}`;
  if (status === "FINALIZADO") return `${base} ${finalizado}`;
  if (status === "CANCELADO") return `${base} ${cancelado}`;
  return base;
}

function formatStatus(status: string) {
  if (status === "CRIADO") return "Criado";
  if (status === "FINALIZADO") return "Finalizado";
  if (status === "CANCELADO") return "Cancelado";
  return status;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function MeusPedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      try {
        setCarregando(true);
        setErro(null);
        const data = await listarMeusPedidos();
        setPedidos(data);
      } catch (e: unknown) {
        setErro(userMessageFromError(e, "Não foi possível carregar seus pedidos."));
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, []);

  if (carregando) {
    return (
      <div className="container">
        <h1>Meus Pedidos</h1>
        <p>Carregando...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="container">
        <h1>Meus Pedidos</h1>
        <p>{erro}</p>
        <p>
          <Link to="/produtos">Voltar para produtos</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>Meus Pedidos</h1>
          <div className={styles.subtitle}>acompanhe o histórico das suas compras</div>
        </div>

        <span className="badge">{pedidos.length} pedido(s)</span>
      </div>

      {pedidos.length === 0 ? (
        <div className={styles.empty}>
          <p>Você ainda não fez nenhum pedido.</p>
          <p>
            <Link to="/produtos" className={styles.linkCard}>
              Ver produtos →
            </Link>
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {pedidos.map((pedido) => (
            <div key={pedido.id} className={styles.card}>
              <div className={styles.top}>
                <div className={styles.topLeft}>
                  <div className={styles.orderId}>Pedido #{pedido.id}</div>

                  <div className={styles.meta}>
                    <span
                      className={getStatusClass(
                        pedido.status,
                        styles.status,
                        styles.statusCriado,
                        styles.statusFinalizado,
                        styles.statusCancelado
                      )}
                    >
                      {formatStatus(pedido.status)}
                    </span>

                    <span className="badge">{pedido.itens.length} item(ns)</span>
                  </div>

                  <div className={styles.metaText}>criado em {formatDate(pedido.criadoEm)}</div>
                </div>

                <div className={styles.totalBox}>
                  <div className={styles.totalLabel}>total</div>
                  <div className={styles.totalValue}>R$ {pedido.total.toFixed(2)}</div>
                </div>
              </div>

              <div className={styles.items}>
                {pedido.itens.map((item) => (
                  <div key={item.id} className={styles.item}>
                    <div className={styles.itemLeft}>
                      <div className={styles.itemName}>{item.nomeProduto}</div>
                      <div className={styles.itemMeta}>
                        id #{item.produtoId} • qtd {item.quantidade} • unitário R$ {item.precoUnitario.toFixed(2)}
                      </div>
                    </div>

                    <div className={styles.itemRight}>R$ {item.subtotal.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MeusPedidosPage;