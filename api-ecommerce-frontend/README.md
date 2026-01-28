# api-ecommerce-frontend

Front-end do projeto **api-ecommerce**, construído em **React + TypeScript + Vite**, integrado com o backend em **Spring Boot**.

## Visão geral

Este front consome a API do e-commerce e entrega os fluxos principais:

- Listagem de produtos  
- Detalhe do produto com quantidade e subtotal em tempo real  
- Carrinho (criação automática, adicionar e remover itens)  
- Checkout (finalizar pedido)  
- Feedback de UI padronizado com **toast** (sucesso/erro)  
- Mensagens de erro humanizadas quando o backend está offline  

## Stack

- React 19  
- TypeScript  
- Vite  
- React Router  
- Vitest (testes)  
- CSS Modules + estilos globais  

## Pré-requisitos

- Node.js (recomendado: versão LTS)  
- Backend do projeto rodando em `http://localhost:8080`  

## Como rodar

### 1) Subir o backend (Spring Boot)

Confirme que o backend está rodando na porta **8080**.

Ambiente de desenvolvimento do backend:

- Porta: `8080`  
- Banco: `H2 em memória`  
- Migrations: `Flyway`  
- Console H2: `/h2-console`  
- Swagger/OpenAPI: habilitado via `springdoc`  

> **Observação**  
> O backend pode ser executado localmente ou via Docker.  
> Para o front-end, não há diferença, desde que a API esteja acessível em `http://localhost:8080`.

### 2) Rodar o front-end

Na raiz do projeto:

```bash
npm i
npm run dev
```
## A aplicação

A aplicação front-end sobe em:

- `http://localhost:5173`

## Scripts disponíveis

- `npm run dev` — modo desenvolvimento  
- `npm run build` — build de produção (TypeScript + Vite)  
- `npm run preview` — prévia do build  
- `npm run lint` — ESLint  
- `npm run test` — Vitest  
- `npm run test:watch` — Vitest em modo watch  

## Estrutura do projeto

```text
api-ecommerce-frontend/
├─ public/                # Arquivos públicos
├─ src/
│  ├─ assets/             # Assets estáticos (imagens, ícones, etc.)
│  ├─ components/         # Componentes reutilizáveis (Header, Toast, etc.)
│  ├─ contexts/           # Contextos globais (ToastContext)
│  ├─ hooks/              # Hooks customizados (useToast)
│  ├─ pages/              # Páginas/rotas (Produtos, Detalhe, Carrinho, Checkout)
│  ├─ services/           # Integração HTTP com a API (request centralizado)
│  ├─ styles/             # Estilos globais e base visual
│  ├─ test/               # Configuração e setup de testes
│  ├─ types/              # Tipagens e contratos do backend
│  ├─ utils/              # Funções utilitárias (ex.: userMessage)
│  ├─ App.tsx             # Componente raiz da aplicação
│  ├─ main.tsx            # Bootstrap do React
│  ├─ index.css           # Estilos globais
│  └─ vite-env.d.ts       # Tipagens do Vite
├─ .gitignore
├─ eslint.config.js
├─ index.html
├─ package.json
├─ package-lock.json
├─ README.md
├─ tsconfig.json
├─ tsconfig.app.json
├─ tsconfig.node.json
└─ vite.config.ts
```
## Integração com backend

As requisições HTTP são centralizadas em:

- `src/services/api.ts`

### Comportamentos implementados

- Tratamento de erros padronizado via `ApiError` (`status`, `message` e `errors?`)  
- Respostas `204 No Content` retornam `undefined`  
- Parse seguro do body de erro, quando existir  

## UX e feedback

O projeto utiliza **toast global** para mensagens de sucesso e erro, evitando o uso de `alert()`:

- **Sucesso**: ações concluídas com êxito (ex.: item adicionado ao carrinho, pedido finalizado)  
- **Erro**: falhas de rede ou API com mensagens humanizadas (ex.: backend offline)  

## Testes

Testes implementados com **Vitest**:

- `src/utils/userMessage.test.ts` — valida conversão de erros técnicos em mensagens humanas  
- `src/services/api.test.ts` — valida o comportamento da função `request` (sucesso, `204` e erros)  

Rodar os testes:

```bash
npm run test
```
## Notas

- O `BASE_URL` do backend está configurado para `http://localhost:8080` em `src/services/api.ts`.
- Para produção, recomenda-se mover essa URL para variável de ambiente, por exemplo:

```env
VITE_API_URL=http://localhost:8080
```