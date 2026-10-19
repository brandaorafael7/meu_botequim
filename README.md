# 🍻 MeuBotequim

Sistema de Gestão de Estoque, Reposição de Balcão e Indicadores em Tempo Real para Bares e Restaurantes.

---

## 📁 Estrutura do Projeto

O repositório está organizado como um monorepo com separação clara entre **Frontend** e **Backend**:

```text
meubotequim/
├── frontend/             # Aplicação Web (React 19 + TypeScript + Vite + Tailwind CSS)
│   ├── src/              # Componentes, Páginas, Serviços de API e Tipagens
│   ├── public/           # Logos e assets estáticos
│   ├── package.json
│   ├── vite.config.ts
│   └── .env
│
├── backend/              # API REST (NestJS 11 + Mongoose + MongoDB + Swagger)
│   ├── src/              # Módulos: Products, StockMovements, Categories, Dashboard, Users
│   ├── package.json
│   ├── nest-cli.json
│   └── .env
│
├── package.json          # Scripts utilitários da raiz
├── .gitignore            # Regras de ignore consolidadas
└── README.md
```

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
* **Node.js**: v18+ (recomendado v20 ou v24)
* **MongoDB**: Instância local rodando em `mongodb://127.0.0.1:27017` (ou cluster MongoDB Atlas)

---

### Opção 1: Rodando a partir da Raiz (`meubotequim`)

Abra dois terminais na pasta raiz `meubotequim`:

* **Terminal 1 — Backend:**
  ```powershell
  npm run dev:backend
  ```
  > API disponível em: `http://localhost:3000`  
  > Documentação Swagger em: `http://localhost:3000/docs`

* **Terminal 2 — Frontend:**
  ```powershell
  npm run dev:frontend
  ```
  > Frontend Web disponível em: `http://localhost:5173`

---

### Opção 2: Entrando em cada pasta individualmente

* **Backend:**
  ```powershell
  cd backend
  npm run start:dev
  ```

* **Frontend:**
  ```powershell
  cd frontend
  npm run dev
  ```

---

## 💾 Banco de Dados & Scripts

No backend (`backend/`):
* **`npm run seed`**: Popula o banco com itens padrão de botequim, categorias e usuário admin inicial (`admin@meubotequim.com.br` / `admin123`).
* **`npm run migrate`**: Sincroniza e migra produtos, histórico e movimentações a partir do Bar Inventory.

---

## 🌐 Deploy na Vercel (Frontend)

Ao conectar este repositório na **Vercel**:
1. No campo **Root Directory**, selecione: `frontend`
2. Framework Preset: **Vite**
3. Em **Environment Variables**, adicione `VITE_API_URL` com a URL do seu backend em produção.
4. Conecte seu domínio do Registro.br em **Settings ➜ Domains**.
