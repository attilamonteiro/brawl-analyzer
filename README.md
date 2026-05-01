# ⚡ Brawl Stars Profile Analyzer

Uma aplicação fullstack para analisar seu perfil do Brawl Stars e obter recomendações sobre quais personagens upuar.

## 🚀 Funcionalidades

- **Busca de Perfil**: Insira sua tag para carregar os dados
- **Análise de Personagens**: Veja dados detalhados de cada brawler
- **Recomendações**: Descubra quem upuar baseado em:
  - Ganho potencial de troféus
  - Eficiência de progresso
  - Personagens que precisam de atenção
- **Dashboard Interativo**: Interface moderna com abas e filtros
- **Progressão Visual**: Barras de progresso para cada personagem

## 📋 Pré-requisitos

- Node.js 16+
- API Key do Brawl Stars (obtenha em https://developer.brawlstars.com/)

## 🔧 Setup

### 1. Clone/Prepare o Projeto

```bash
cd C:\Users\atmal\repository
npm install
```

### 2. Configure a API Key

No backend, crie um arquivo `.env`:

```bash
cd backend
cp .env.example .env
```

Edite `backend/.env` e adicione sua API Key:

```
BRAWL_STARS_API_KEY=seu_api_key_aqui
PORT=3000
```

### 3. Instale as dependências

```bash
# Backend
cd backend
npm install

# Frontend (em outro terminal)
cd frontend
npm install
```

## 🎮 Executar

### Modo Desenvolvimento (ambos os servidores)

```bash
npm run dev
```

Isso vai iniciar:
- Backend: http://localhost:3000
- Frontend: http://localhost:5173

### Ou individualmente:

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

## 📊 Como Usar

1. Acesse http://localhost:5173
2. Cole sua tag do Brawl Stars (ex: #ABC123) ou seu ID
3. Clique em "Buscar"
4. Navegue pelas abas:
   - **🎯 Recomendações**: Personagens com maior ganho potencial
   - **⚙️ Por Eficiência**: Mais bem ranqueados em termos de progresso
   - **⚠️ Precisa Atenção**: Quem está atrasado
   - **📊 Todos**: Tabela completa com todos os brawlers

## 📈 Métricas Explicadas

- **Troféus**: Número atual e máximo atingido
- **Power Level**: Nível de poder (1-11)
- **Progresso**: Percentual do progresso na faixa de trofeu atual
- **Eficiência**: Taxa de progresso comparada ao esperado
  - \> 1.0 = Acima da média
  - < 0.5 = Abaixo da média
- **Ganho Potencial**: Quantos troféus você pode ainda ganhar

## 🏗️ Estrutura do Projeto

```
├── backend/
│   ├── src/
│   │   ├── index.js           # Servidor Express
│   │   └── services/
│   │       ├── brawlStarsApi.js  # Integração com API
│   │       └── analyzer.js        # Lógica de análise
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── main.js            # Entry point Vue
│   │   └── App.vue            # Componente principal
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── package.json              # Root package
```

## 🔌 API Endpoints

- `GET /api/player/:tag` - Dados brutos do jogador
- `GET /api/analysis/:tag` - Análise completa com recomendações

## 🛠️ Tecnologias

- **Backend**: Node.js, Express
- **Frontend**: Vue 3, Vite
- **API**: Brawl Stars Public API
- **HTTP**: Axios

## ⚠️ Notas

- A API do Brawl Stars tem rate limit. Para chaves de desenvolvimento é limitado.
- Os dados são em tempo real da API oficial
- A análise é baseada em fórmulas de eficiência de progresso

## 📝 Licença

MIT
