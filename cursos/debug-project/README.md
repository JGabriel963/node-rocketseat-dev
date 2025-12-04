# Debug Project

Projeto fullstack desenvolvido com Node.js, utilizando uma arquitetura monorepo com API REST e interface web.

## 🚀 Tecnologias

### Backend (API)

- **[Fastify](https://fastify.dev/)** - Framework web rápido e eficiente
- **[Drizzle ORM](https://orm.drizzle.team/)** - ORM TypeScript-first
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Zod](https://zod.dev/)** - Validação de schemas
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript com tipagem estática
- **[Docker](https://www.docker.com/)** - Containerização do banco de dados

### Frontend (Web)

- **[React](https://react.dev/)** - Biblioteca para construção de interfaces
- **[Vite](https://vitejs.dev/)** - Build tool e dev server
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática

### Ferramentas de Desenvolvimento

- **[pnpm](https://pnpm.io/)** - Gerenciador de pacotes eficiente
- **[Biome](https://biomejs.dev/)** - Linter e formatador de código
- **[tsx](https://github.com/privatenumber/tsx)** - Executor TypeScript com hot reload

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [pnpm](https://pnpm.io/) (versão 10.24.0)
- [Docker](https://www.docker.com/) (para o banco de dados)

## 🔧 Instalação

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
cd debug-project
```

2. Instale as dependências:

```bash
pnpm install
```

3. Configure as variáveis de ambiente:

```bash
cd api
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações.

4. Inicie o banco de dados PostgreSQL:

```bash
cd api
docker-compose up -d
```

5. Execute as migrações do banco de dados:

```bash
pnpm db:migrate
```

## 🎯 Uso

### Desenvolvimento

Para iniciar o projeto em modo de desenvolvimento:

**API (Backend):**

```bash
cd api
pnpm dev
```

A API estará disponível em `http://localhost:3333` (ou a porta configurada).

**Web (Frontend):**

```bash
cd web
pnpm dev
```

A aplicação web estará disponível em `http://localhost:5173`.

### Comandos Úteis

**API:**

- `pnpm dev` - Inicia o servidor em modo de desenvolvimento
- `pnpm db:generate` - Gera migrações do banco de dados
- `pnpm db:migrate` - Executa migrações pendentes
- `pnpm db:studio` - Abre interface visual do Drizzle Studio
- `pnpm format` - Formata o código com Biome

**Web:**

- `pnpm dev` - Inicia o servidor de desenvolvimento
- `pnpm build` - Cria build de produção
- `pnpm preview` - Visualiza o build de produção

## 📁 Estrutura do Projeto

```
debug-project/
├── api/                    # Backend (API REST)
│   ├── src/
│   │   ├── db/            # Configuração e schemas do banco
│   │   ├── routes/        # Rotas da API
│   │   └── server.ts      # Arquivo principal do servidor
│   ├── docker-compose.yml # Configuração do PostgreSQL
│   └── package.json
├── web/                    # Frontend (React)
│   ├── src/
│   └── package.json
└── package.json           # Configuração do workspace
```

## 📝 Licença

ISC
