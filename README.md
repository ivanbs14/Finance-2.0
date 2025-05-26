# my-v0-project

Versão: 0.1.0

> Projeto privado usando Next.js com diversas bibliotecas para UI, estado, validação, temas, e mais.

---

## Scripts disponíveis

- `dev` — Inicia o servidor de desenvolvimento Next.js.
- `build` — Gera a versão otimizada para produção.
- `start` — Inicia a aplicação em modo produção.
- `lint` — Executa o linter do Next.js para análise de código.

---

## Dependências principais

Este projeto utiliza as seguintes bibliotecas e frameworks principais:

- **Next.js** (v15.2.4) — Framework React para SSR e geração de sites estáticos.
- **React** (v18.2.0) — Biblioteca UI declarativa.
- **Zustand** — Gerenciamento simples de estado.
- **React Hook Form** — Manipulação de formulários e validação.
- **Radix UI** — Conjunto de componentes acessíveis e estilizados (accordion, dialog, popover, etc).
- **Tailwind CSS** — Framework utilitário CSS para estilos.
- **date-fns** — Manipulação de datas.
- **Recharts** — Biblioteca para gráficos em React.
- **Immer** — Imutabilidade imersiva para estados.
- **Lucide React** — Ícones SVG.

E outras bibliotecas para animações, notificações (Sonner), máscaras, carrossel, validação (Zod), entre outras.

---

## Ferramentas de desenvolvimento

- **TypeScript** (v5) — Tipagem estática para JavaScript.
- **PostCSS** — Processamento CSS.
- **TailwindCSS** — Framework de utilitários CSS.
- Tipos para Node.js, React e ReactDOM.

---

## Como rodar localmente

1. Clone o repositório:

   ```bash
   git clone <url-do-repositorio>
   cd my-v0-project
Instale as dependências:

bash
Copiar
Editar
npm install
# ou
yarn
# ou
pnpm install
Rode a aplicação em modo desenvolvimento:

bash
Copiar
Editar
npm run dev
# ou
yarn dev
# ou
pnpm dev
Abra http://localhost:3000 no navegador.

Build para produção
bash
Copiar
Editar
npm run build
npm start
Estrutura básica do projeto
/app — Diretório principal do Next.js (rotas e componentes principais)

/components — Componentes reutilizáveis

/hooks — Hooks customizados

/lib — Funções auxiliares e bibliotecas internas

/styles — Estilos globais e configurações TailwindCSS

/public — Arquivos públicos estáticos

Contato
Para dúvidas, sugestões ou contribuições, abra uma issue ou envie um pull request.