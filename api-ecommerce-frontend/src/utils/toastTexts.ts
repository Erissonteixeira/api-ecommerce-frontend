export const toastTexts = {
  carrinho: {
    addSuccessTitle: "Adicionado ao carrinho",
    addSuccessMessage: (nome: string, qtd: number) => `${nome} (${qtd}x) foi adicionado.`,
    addErrorTitle: "Não foi possível adicionar",

    removeSuccessTitle: "Item removido",
    removeSuccessMessage: (nome?: string) => (nome ? `${nome} foi removido.` : "O item foi removido."),
    removeErrorTitle: "Não foi possível remover",
  },

  pedido: {
    checkoutSuccessTitle: "Pedido finalizado",
    checkoutSuccessMessage: "Seu pedido foi criado e já está em processamento.",
    checkoutErrorTitle: "Não foi possível finalizar",
  },

  fallback: {
    tryAgain: "Tente novamente em alguns segundos.",
  },
} as const;
