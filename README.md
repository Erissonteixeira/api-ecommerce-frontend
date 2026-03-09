# API E-commerce Frontend

Front-end do projeto **api-ecommerce**, desenvolvido com **React + TypeScript + Vite**, integrado ao backend em **Spring Boot**.

A aplicação fornece a interface de usuário para o sistema de e-commerce, permitindo cadastro, login, navegação de produtos, gerenciamento de carrinho e criação de pedidos.

---

# Visão geral

Este front-end consome a API do e-commerce e implementa os principais fluxos da aplicação.

Funcionalidades disponíveis:

- Cadastro de usuário
- Login com autenticação JWT
- Rotas protegidas para usuários autenticados
- Listagem de produtos
- Detalhe de produto com cálculo de subtotal em tempo real
- Carrinho de compras (criação automática, adicionar e remover itens)
- Checkout para finalização de pedido
- Histórico de pedidos do usuário
- Feedback visual padronizado com **toast**
- Mensagens de erro humanizadas quando o backend está offline

A aplicação roda por padrão em:

http://localhost:5173

---

# Stack

- React 19
- TypeScript
- Vite
- React Router
- Context API
- Vitest (testes)
- CSS Modules
- Estilos globais

---

# Pré-requisitos

- Node.js (recomendado versão LTS)
- Backend do projeto rodando em:

http://localhost:8080

O backend pode ser executado:

- localmente
- via Docker

Para o front-end não há diferença, desde que a API esteja acessível.

---

# Como rodar

## 1) Subir o backend

Confirme que o backend está rodando na porta **8080**.

Ambiente de desenvolvimento do backend:

- Porta: `8080`
- Banco: **H2 em memória**
- Migrations: **Flyway**
- Console H2: `/h2-console`
- Swagger/OpenAPI: habilitado via **springdoc-openapi**

---

## 2) Rodar o front-end

Na raiz do projeto execute:

npm install

npm run dev

A aplicação será iniciada em:

http://localhost:5173

---

# Scripts disponíveis

npm run dev  
Executa o projeto em modo desenvolvimento.

npm run build  
Build de produção utilizando **TypeScript + Vite**.

npm run preview  
Executa uma prévia do build gerado.

npm run lint  
Executa o ESLint.

npm run test  
Executa os testes com **Vitest**.

npm run test:watch  
Executa os testes em modo watch.

---

# Estrutura do projeto

api-ecommerce-frontend/

public/ → arquivos públicos  

src/

assets/ → imagens e assets estáticos  

components/ → componentes reutilizáveis

- Header
- Toast
- ProtectedRoute
- PublicOnlyRoute

contexts/ → contextos globais

- AuthContext
- ToastContext

hooks/ → hooks customizados

- useToast

pages/ → páginas da aplicação

- ProdutosPage
- ProdutoDetalhePage
- CarrinhoPage
- CheckoutPage
- LoginPage
- RegisterPage
- MeusPedidosPage

services/ → integração com API

- api.ts
- authService.ts
- carrinhoService.ts
- pedidoService.ts

styles/ → estilos globais  

types/ → tipagens do backend  

utils/ → utilitários

- userMessage.ts

App.tsx → componente raiz  
main.tsx → bootstrap da aplicação  

---

# Autenticação

O front-end utiliza **JWT** para autenticação.

Fluxo de autenticação:

1. Usuário se registra
2. Usuário faz login
3. O backend retorna um **token JWT**
4. O token é armazenado no **localStorage**
5. O token é enviado automaticamente no header das requisições

Exemplo de header:

Authorization: Bearer <token>

Rotas protegidas utilizam o componente:

ProtectedRoute

Rotas públicas utilizam:

PublicOnlyRoute

---

# Integração com backend

Todas as requisições HTTP são centralizadas em:

src/services/api.ts

Funcionalidades implementadas:

- tratamento padronizado de erros via `ApiError`
- suporte a respostas `204 No Content`
- parse seguro de mensagens retornadas pela API
- mensagens amigáveis quando o backend está offline

---

# UX e feedback

O projeto utiliza **toast global** para feedback visual.

Tipos de toast utilizados:

success → ação concluída com sucesso  
error → erro de API ou rede  
info → mensagens informativas  

Isso evita o uso de `alert()` e melhora a experiência do usuário.

---

# Testes

Testes implementados com **Vitest**.

Arquivos principais:

src/utils/userMessage.test.ts  
Valida conversão de erros técnicos em mensagens humanas.

src/services/api.test.ts  
Valida comportamento da função `request`.

Executar testes:

npm run test

---

# Configuração da API

A URL do backend está configurada em:

src/services/api.ts

Valor padrão:

http://localhost:8080

Para ambientes de produção recomenda-se usar variável de ambiente:

VITE_API_URL=http://localhost:8080

E acessar via:

import.meta.env.VITE_API_URL

---

# Fluxo do sistema

O fluxo completo da aplicação funciona da seguinte forma:

Cadastro  
↓  
Login  
↓  
Listagem de produtos  
↓  
Carrinho  
↓  
Checkout  
↓  
Criação de pedido  
↓  
Histórico de pedidos

---

# Observações

Este projeto faz parte de um **sistema full stack de e-commerce**, composto por:

Backend → Spring Boot + JWT + Flyway + JPA  
Frontend → React + TypeScript + Vite

O objetivo do projeto é demonstrar a implementação de um fluxo completo de e-commerce com autenticação e integração entre front-end e back-end.
