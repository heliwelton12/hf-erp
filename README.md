# HF ERP

Sistema de gestão em desenvolvimento para uma futura papelaria e loja de serviços, com foco em centralizar operações de **papelaria, informática, impressão, acessórios e serviços** em uma única aplicação.

O projeto foi criado como uma solução própria de gestão e também como projeto prático de desenvolvimento full stack.

## Status

🚧 **Em desenvolvimento**

## Principais módulos

- Dashboard com visão geral do negócio
- Caixa / PDV
- Clientes
- Ordens de Serviço
- Produtos e categorias
- Controle e movimentação de estoque
- Serviços
- Financeiro
- Contas a pagar
- Contas a receber
- Fornecedores
- Inventários
- Orçamentos
- Comprovantes de venda
- Fechamento de caixa
- Configurações e backup
- Consulta de Ordem de Serviço

## Tecnologias

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Lucide React

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn
- python-dotenv

### Banco de dados
- PostgreSQL
- psycopg2

## Estrutura do projeto

```text
hf-erp/
├── backend/
│   ├── app/
│   │   ├── database/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   └── services/
│   ├── main.py
│   ├── create_tables.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   └── components/
│   ├── package.json
│   └── next.config.ts
├── docs/
└── README.md
```

## Como executar localmente

### 1. Backend

Entre na pasta do backend:

```bash
cd backend
```

Crie e ative um ambiente virtual, se necessário, e instale as dependências:

```bash
pip install -r requirements.txt
```

Crie um arquivo `.env` dentro de `backend/` com base em `.env.example`:

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/hf_erp
DB_PASSWORD=sua_senha_do_postgresql
```

Inicie a API:

```bash
uvicorn main:app --reload
```

A API ficará disponível, por padrão, em:

```text
http://127.0.0.1:8000
```

Documentação interativa da API:

```text
http://127.0.0.1:8000/docs
```

### 2. Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

A aplicação ficará disponível em:

```text
http://localhost:3000
```

## Segurança

Arquivos locais e sensíveis não devem ser versionados, incluindo:

- `.env`
- `.venv/`
- `node_modules/`
- `.next/`
- backups SQL
- bancos de dados locais
- logs

Use o arquivo `backend/.env.example` apenas como modelo de configuração.

## Objetivo do projeto

O HF ERP nasceu da ideia de desenvolver um sistema próprio para uma futura papelaria e loja de serviços. O objetivo é reunir, em uma única plataforma, recursos de atendimento, vendas, estoque, serviços de informática e controle financeiro, permitindo evoluir o sistema conforme as necessidades reais do negócio.

## Autor

**Heliwelton Fernandes**

- LinkedIn: https://www.linkedin.com/in/heliweltondev
- GitHub: https://github.com/heliwelton12
