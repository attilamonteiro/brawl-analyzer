# ⚡ Brawl Stars Profile Analyzer

Uma aplicação Next.js fullstack para analisar seu perfil do Brawl Stars e obter recomendações sobre quais personagens upuar.

## 🚀 Funcionalidades

- **Busca de Perfil**: Insira sua tag para carregar os dados em tempo real
- **Análise de Personagens**: Veja dados detalhados de cada brawler
- **Recomendações Inteligentes**: Descubra quem upuar baseado em:
  - Ganho potencial de troféus
  - Eficiência de progresso
  - Personagens que precisam de atenção
- **Dashboard Interativo**: Interface moderna com abas e filtros
- **Progressão Visual**: Barras de progresso e métricas para cada personagem

## 📋 Pré-requisitos

- Node.js 18+
- API Key do Brawl Stars (obtenha em https://developer.brawlstars.com/)

## 🔧 Setup Rápido

### 1. Clone/Prepare o Projeto

```bash
cd C:\Users\atmal\repository
npm install
```

### 2. Configure a API Key

Edite o arquivo `.env.local` na raiz do projeto:

```
BRAWL_STARS_API_KEY=sua_api_key_aqui
```

Para obter sua API Key:
1. Acesse https://developer.brawlstars.com/
2. Crie uma conta
3. Crie uma aplicação
4. Copie a API Key

### 3. Pronto para Rodar!

```bash
npm run dev
```

Acesse: **http://localhost:3000**

## 🎮 Como Usar

1. Abra http://localhost:3000
2. Cole sua tag do Brawl Stars (ex: #ABC123)
3. Clique em "Buscar"
4. Navegue pelas abas para ver diferentes análises:

### 🎯 Recomendações
Personagens com maior ganho potencial de troféus. Ideal para decidir quem upuar primeiro.

### ⚙️ Por Eficiência
Brawlers que estão progredindo acima da média. Maior eficiência = melhor ritmo de progresso.

### ⚠️ Precisa Atenção
Personagens com progresso baixo na faixa de trofeu atual. Pode indicar que está muito difícil subir ou que precisa de upgrades.

### 📊 Todos
Tabela completa com todos os seus brawlers e métricas.

## 📈 Métricas Explicadas

| Métrica | O que significa |
|---------|-----------------|
| **Troféus** | Número atual e máximo atingido do brawler |
| **Power Level** | Nível de poder (1-11) |
| **Progresso** | Percentual do progresso na faixa de trofeu atual |
| **Eficiência** | Taxa de progresso comparada ao esperado |
| **Ganho Potencial** | Quantos troféus você pode ainda ganhar na faixa |

**Eficiência (escala de referência):**
- ✅ **> 1.0** = Acima da média (excelente progresso)
- ✅ **0.8 - 1.0** = Na média (bom progresso)
- ⚠️ **0.4 - 0.8** = Abaixo da média
- ❌ **< 0.4** = Muito abaixo (progresso lento)

## 🏗️ Estrutura do Projeto

```
├── app/
│   ├── api/
│   │   └── analysis/
│   │       └── route.ts         # API endpoint
│   ├── globals.css              # Estilos globais
│   ├── layout.tsx               # Layout raiz
│   └── page.tsx                 # Página principal
│
├── lib/
│   ├── analyzer.ts              # Lógica de análise
│   └── brawlStarsApi.ts         # Integração com API
│
├── .env.local                   # Configuração local
├── next.config.js               # Config Next.js
└── tsconfig.json                # Config TypeScript
```

## 🔌 API Endpoint

### `GET /api/analysis?tag=<PLAYER_TAG>`

Retorna análise completa do jogador.

**Exemplo:**
```bash
curl "http://localhost:3000/api/analysis?tag=%232P0LCC0YU"
```

**Response:**
```json
{
  "player": {
    "name": "PlayerName",
    "tag": "#2P0LCC0YU",
    "trophies": 25000,
    "totalBrawlers": 55
  },
  "allBrawlers": [...],
  "recommendations": {
    "byPotentialGain": [...],
    "byEfficiency": [...],
    "needsAttention": [...]
  }
}
```

## 🛠️ Tecnologias

- **Framework**: Next.js 14
- **Linguagem**: TypeScript
- **Estilo**: CSS puro
- **API**: Brawl Stars Public API
- **Runtime**: Node.js

## 📝 Variáveis de Ambiente

```env
# Obrigatório
BRAWL_STARS_API_KEY=sua_chave_aqui

# Opcional
NEXT_PUBLIC_API_URL=http://localhost:3000
BRAWL_STARS_API_URL=https://api.brawlstars.com/v1
```

## 🚀 Build para Produção

```bash
npm run build
npm run start
```

## ⚠️ Notas Importantes

- A API do Brawl Stars tem rate limiting. Para chaves de desenvolvimento é limitado a um certo número de requisições.
- Os dados são em tempo real da API oficial do Brawl Stars.
- A análise é baseada em fórmulas de eficiência de progresso por faixa de trofeu.
- Personagens com power level baixo (< 9) geralmente têm progresso reduzido.

## 🐛 Troubleshooting

### "Jogador não encontrado"
- Verifique se a tag está correta
- A tag deve estar no formato: `#ABC123`

### "Erro ao conectar com o servidor"
- Certifique-se de que o servidor está rodando (`npm run dev`)
- Verifique a API Key no `.env.local`
- Verifique se há internet para chamar a API do Brawl Stars

### Taxa de requisições esgotada
- Aguarde alguns minutos
- Se estiver em desenvolvimento, tente criar uma nova API Key com permissões ampliadas

## 📄 Licença

MIT

## 💡 Tips

- Adicione sua tag aos favoritos do navegador para acesso rápido
- A análise leva em conta a faixa de trofeu, então personagens em faixas diferentes podem ter eficiências comparáveis
- Foque em personagens com alta eficiência e ganho potencial para um progresso mais rápido
