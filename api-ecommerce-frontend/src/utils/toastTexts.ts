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
  usuarios: {
  createSuccessTitle: "Usuário criado",
  createSuccessMessage: "Usuário cadastrado com sucesso.",

  updateSuccessTitle: "Usuário atualizado",
  updateSuccessMessage: "Alterações salvas com sucesso.",

  saveErrorTitle: "Não foi possível salvar",

  removeSuccessTitle: "Usuário removido",
  removeSuccessMessage: (nome?: string) => (nome ? `${nome} foi removido.` : "O usuário foi removido."),
  removeErrorTitle: "Não foi possível remover",
},

  fallback: {
    tryAgain: "Tente novamente em alguns segundos.",
  },
} as const;
