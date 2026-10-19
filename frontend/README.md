# 🍻 MeuBotequim — Bar & Botequim Inventory Suite

Sistema web moderno e especializado para controle de estoque, alertas de reposição, auditoria e lista de compras para bares, botecos e restaurantes.

---

## 🚀 Como Rodar Localmente

### 1. Pré-requisitos
- **Node.js** (v18 ou superior recomendado, testado com v24+)
- **npm** (v9 ou superior)

### 2. Iniciar o Servidor de Desenvolvimento
No terminal, na pasta do projeto:

```bash
npm run dev
```

O Vite iniciará o servidor local. Basta abrir o link indicado no navegador (geralmente [http://localhost:5173](http://localhost:5173)).

---

## 🛠️ Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor local de desenvolvimento (Hot Reload) |
| `npm run build` | Compila o TypeScript e gera o bundle de produção na pasta `dist/` |
| `npm run preview` | Executa o build de produção localmente para pré-visualização |
| `npm run lint` | Executa a verificação estática de código com o ESLint |

---

## 📂 Estrutura do Projeto

```text
meubotequim/
├── public/                 # Arquivos estáticos
├── src/
│   ├── components/         # Componentes modulares
│   │   └── meubotequim/    # Componentes principais da interface:
│   │       ├── ActionButtons.tsx       # Ações rápidas (Entrada, Perda, Auditoria)
│   │       ├── AlertTable.tsx          # Tabela de alertas críticos e filtro de reposição
│   │       ├── Header.tsx              # Cabeçalho com perfil, alertas e seleção de filial
│   │       ├── KpiCard.tsx             # Cards de indicadores de estoque e custo
│   │       ├── QuickActionModals.tsx   # Modais interativos de cadastro e auditoria
│   │       ├── ShoppingListDrawer.tsx  # Gaveta lateral com carrinho/lista de compras
│   │       └── StatusBadge.tsx         # Badges visuais de status (Crítico, Alerta, Normal)
│   ├── pages/
│   │   └── Dashboard.tsx   # Painel principal integrado MeuBotequim
│   ├── types/              # Definições TypeScript
│   ├── App.tsx             # Componente raiz da aplicação
│   ├── main.tsx            # Ponto de entrada React 19
│   └── index.css           # Estilos globais e Tailwind CSS
├── index.html              # HTML base
├── tailwind.config.js      # Configuração de temas e paleta de tons terrosos pastel
├── tsconfig.json           # Configurações TypeScript
└── vite.config.ts          # Configuração do Vite e empacotamento
```

---

## 🎨 Design System
O projeto utiliza uma paleta com **tons terrosos pastel** inspirada na atmosfera de bares tradicionais:
- **Terracota Pastel (`#C87A5B`)**: Cor primária para ações e botões em destaque
- **Areia / Off-white (`#FAF6F0`)**: Fundo quente e confortável para os olhos
- **Café Espresso (`#2C221E`)**: Tipografia principal de alta legibilidade
- **Verde Sálvia (`#5B8A62`)**: Estoque regular e confirmações
- **Mostarda Pastel (`#DF9B42`)**: Alertas e atenção
- **Tijolo Queimado (`#C24E48`)**: Níveis críticos e risco de ruptura

