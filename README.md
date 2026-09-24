<div align="center">

# HF ERP

### Sistema Full Stack de gestão para papelaria, informática e serviços

Projeto em desenvolvimento para centralizar operações de **vendas, estoque, clientes, ordens de serviço, fornecedores e financeiro** em uma única aplicação.

<br>

<img src="https://img.shields.io/badge/STATUS-EM%20DESENVOLVIMENTO-0EA5E9?style=for-the-badge" alt="Em desenvolvimento" />

<br><br>

<img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,python,fastapi,postgres" alt="Next.js, React, TypeScript, Tailwind CSS, Python, FastAPI e PostgreSQL" />

</div>

---

## Sobre o projeto

O **HF ERP** nasceu da ideia de desenvolver um sistema próprio para uma futura papelaria e loja de serviços.

A proposta é reunir, em uma única plataforma, recursos de atendimento, vendas, estoque, serviços de informática e controle financeiro, permitindo que o sistema evolua conforme as necessidades reais do negócio.

Além de atender a uma necessidade prática, o projeto também funciona como aplicação de estudos em desenvolvimento **Full Stack**, integração entre frontend e backend, APIs, banco de dados e regras de negócio.

---

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

---

## Telas do sistema

### Dashboard

Visão geral do negócio com indicadores e atalhos para os principais módulos.

![Dashboard do HF ERP](docs/screenshots/dashboard.png)

### Caixa / PDV

Tela de vendas com busca de produtos, carrinho e fluxo de finalização.

![Caixa e PDV do HF ERP](docs/screenshots/caixa-pdv.png)

### Ordens de Serviço

Gerenciamento de ordens de serviço, acompanhamento de status e informações do atendimento.

![Ordens de Serviço do HF ERP](docs/screenshots/ordens-servico.png)

### Produtos

Cadastro e gerenciamento de produtos, preços e informações de estoque.

![Produtos do HF ERP](docs/screenshots/produtos.png)

### Estoque

Controle de movimentações e acompanhamento do estoque.

![Estoque do HF ERP](docs/screenshots/estoque.png)

### Financeiro

Visão financeira do sistema com informações de vendas e movimentações.

![Financeiro do HF ERP](docs/screenshots/financeiro.png)

---

## Tecnologias

### Frontend

<p>
  <img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind" alt="Next.js, React, TypeScript e Tailwind CSS" />
</p>

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Lucide React

### Backend

<p>
  <img src="https://skillicons.dev/icons?i=python,fastapi" alt="Python e FastAPI" />
</p>

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn
- python-dotenv

### Banco de dados

<p>
  <img src="https://skillicons.dev/icons?i=postgres" alt="PostgreSQL" />
</p>

- PostgreSQL
- psycopg2

---

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

---

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

---

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

---

## Autor

<div align="center">

**Heliwelton Fernandes**

<br>

<a href="https://www.linkedin.com/in/heliweltondev/">
  <img src="https://img.shields.io/badge/LINKEDIN-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
</a>
&nbsp;
<a href="https://github.com/heliwelton12">
  <img src="https://img.shields.io/badge/GITHUB-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
</a>

</div>
