<template>
  <div class="app">
    <header class="header">
      <div class="container">
        <h1>⚡ Brawl Stars Analyzer</h1>
        <p>Analise seu perfil e descubra quem upuar</p>
      </div>
    </header>

    <main class="container">
      <div class="search-section">
        <div class="search-box">
          <input
            v-model="playerTag"
            type="text"
            placeholder="Cole sua tag (#ABC123) ou ID"
            @keyup.enter="searchPlayer"
            class="input"
          />
          <button @click="searchPlayer" :disabled="loading" class="btn btn-primary">
            {{ loading ? 'Buscando...' : 'Buscar' }}
          </button>
        </div>
        <p v-if="error" class="error">{{ error }}</p>
      </div>

      <div v-if="analysis" class="analysis-section">
        <div class="player-header">
          <div>
            <h2>{{ analysis.player.name }}</h2>
            <p class="tag">{{ analysis.player.tag }}</p>
          </div>
          <div class="stats">
            <div class="stat">
              <span class="label">Troféus Totais</span>
              <span class="value">{{ analysis.player.trophies }}</span>
            </div>
            <div class="stat">
              <span class="label">Brawlers</span>
              <span class="value">{{ analysis.player.totalBrawlers }}</span>
            </div>
          </div>
        </div>

        <div class="tabs">
          <button
            @click="activeTab = 'recommendations'"
            :class="{ active: activeTab === 'recommendations' }"
            class="tab"
          >
            🎯 Recomendações
          </button>
          <button
            @click="activeTab = 'efficiency'"
            :class="{ active: activeTab === 'efficiency' }"
            class="tab"
          >
            ⚙️ Por Eficiência
          </button>
          <button
            @click="activeTab = 'needsAttention'"
            :class="{ active: activeTab === 'needsAttention' }"
            class="tab"
          >
            ⚠️ Precisa Atenção
          </button>
          <button
            @click="activeTab = 'all'"
            :class="{ active: activeTab === 'all' }"
            class="tab"
          >
            📊 Todos
          </button>
        </div>

        <div v-if="activeTab === 'recommendations'" class="brawlers-grid">
          <div
            v-for="brawler in analysis.recommendations.byPotentialGain"
            :key="brawler.id"
            class="brawler-card"
          >
            <div class="brawler-header">
              <h3>{{ brawler.name }}</h3>
              <span class="level">⭐ {{ brawler.power }}</span>
            </div>
            <div class="brawler-stats">
              <p><strong>Troféus:</strong> {{ brawler.trophies }} / {{ brawler.maxTrophies }}</p>
              <p><strong>Ganho Potencial:</strong> {{ brawler.potentialGain }} 🏆</p>
              <p><strong>Progresso da Faixa:</strong> {{ brawler.progress.toFixed(1) }}%</p>
            </div>
            <div class="progress-bar">
              <div class="progress" :style="{ width: brawler.progress + '%' }"></div>
            </div>
            <p class="recommendation">{{ brawler.recommendation }}</p>
          </div>
        </div>

        <div v-if="activeTab === 'efficiency'" class="brawlers-grid">
          <div
            v-for="brawler in analysis.recommendations.byEfficiency"
            :key="brawler.id"
            class="brawler-card"
          >
            <div class="brawler-header">
              <h3>{{ brawler.name }}</h3>
              <span class="level">⭐ {{ brawler.power }}</span>
            </div>
            <div class="brawler-stats">
              <p><strong>Troféus:</strong> {{ brawler.trophies }}</p>
              <p><strong>Eficiência:</strong> {{ brawler.efficiency.toFixed(2) }}x</p>
              <p><strong>Progresso:</strong> {{ brawler.progress.toFixed(1) }}%</p>
            </div>
            <div class="progress-bar">
              <div class="progress" :style="{ width: brawler.progress + '%' }"></div>
            </div>
            <p class="recommendation">{{ brawler.recommendation }}</p>
          </div>
        </div>

        <div v-if="activeTab === 'needsAttention'" class="brawlers-grid">
          <div
            v-for="brawler in analysis.recommendations.needsAttention"
            :key="brawler.id"
            class="brawler-card warning"
          >
            <div class="brawler-header">
              <h3>{{ brawler.name }}</h3>
              <span class="level">⭐ {{ brawler.power }}</span>
            </div>
            <div class="brawler-stats">
              <p><strong>Troféus:</strong> {{ brawler.trophies }} / {{ brawler.maxTrophies }}</p>
              <p><strong>Progresso:</strong> {{ brawler.progress.toFixed(1) }}% ⚠️</p>
              <p><strong>Power Level:</strong> {{ brawler.power }}</p>
            </div>
            <div class="progress-bar">
              <div class="progress warning" :style="{ width: brawler.progress + '%' }"></div>
            </div>
            <p class="recommendation">{{ brawler.recommendation }}</p>
          </div>
        </div>

        <div v-if="activeTab === 'all'" class="brawlers-table">
          <table>
            <thead>
              <tr>
                <th>Brawler</th>
                <th>Troféus</th>
                <th>Power</th>
                <th>Progresso</th>
                <th>Eficiência</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="brawler in analysis.allBrawlers" :key="brawler.id">
                <td><strong>{{ brawler.name }}</strong></td>
                <td>{{ brawler.trophies }} / {{ brawler.maxTrophies }}</td>
                <td>⭐ {{ brawler.power }}</td>
                <td>
                  <div class="progress-inline">
                    <div class="progress" :style="{ width: brawler.progress + '%' }"></div>
                  </div>
                  {{ brawler.progress.toFixed(1) }}%
                </td>
                <td>{{ brawler.efficiency.toFixed(2) }}x</td>
                <td>{{ brawler.recommendation }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <style scoped>
      .app {
        min-height: 100vh;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        color: #e0e0e0;
      }

      .header {
        background: linear-gradient(135deg, #0f3460 0%, #533483 100%);
        padding: 3rem 0;
        text-align: center;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      }

      .header h1 {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
      }

      .header p {
        font-size: 1rem;
        opacity: 0.9;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
      }

      .search-section {
        margin: 3rem 0;
      }

      .search-box {
        display: flex;
        gap: 1rem;
      }

      .input {
        flex: 1;
        padding: 1rem;
        border: 2px solid #0f3460;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.1);
        color: #e0e0e0;
        font-size: 1rem;
      }

      .input:focus {
        outline: none;
        border-color: #e94560;
        box-shadow: 0 0 10px rgba(233, 69, 96, 0.3);
      }

      .btn {
        padding: 1rem 2rem;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .btn-primary {
        background: linear-gradient(135deg, #e94560 0%, #ff6b6b 100%);
        color: white;
      }

      .btn-primary:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(233, 69, 96, 0.4);
      }

      .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .error {
        color: #ff6b6b;
        margin-top: 1rem;
      }

      .analysis-section {
        margin: 3rem 0;
      }

      .player-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(255, 255, 255, 0.05);
        padding: 2rem;
        border-radius: 12px;
        margin-bottom: 2rem;
        border: 1px solid rgba(233, 69, 96, 0.3);
      }

      .player-header h2 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
      }

      .tag {
        color: #999;
        font-size: 0.9rem;
      }

      .stats {
        display: flex;
        gap: 2rem;
      }

      .stat {
        text-align: right;
      }

      .stat .label {
        display: block;
        font-size: 0.9rem;
        color: #999;
        margin-bottom: 0.5rem;
      }

      .stat .value {
        display: block;
        font-size: 1.8rem;
        font-weight: bold;
        color: #e94560;
      }

      .tabs {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        border-bottom: 2px solid rgba(255, 255, 255, 0.1);
      }

      .tab {
        padding: 1rem 1.5rem;
        background: none;
        border: none;
        color: #999;
        cursor: pointer;
        font-size: 1rem;
        border-bottom: 3px solid transparent;
        transition: all 0.3s ease;
      }

      .tab.active {
        color: #e94560;
        border-bottom-color: #e94560;
      }

      .tab:hover {
        color: #e0e0e0;
      }

      .brawlers-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .brawler-card {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(233, 69, 96, 0.3);
        border-radius: 12px;
        padding: 1.5rem;
        transition: all 0.3s ease;
      }

      .brawler-card:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: #e94560;
        transform: translateY(-4px);
      }

      .brawler-card.warning {
        border-color: rgba(255, 193, 7, 0.5);
      }

      .brawler-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }

      .brawler-header h3 {
        font-size: 1.5rem;
        margin: 0;
      }

      .level {
        background: rgba(233, 69, 96, 0.3);
        padding: 0.3rem 0.8rem;
        border-radius: 20px;
        font-size: 0.9rem;
      }

      .brawler-stats {
        margin-bottom: 1rem;
      }

      .brawler-stats p {
        margin: 0.5rem 0;
        font-size: 0.95rem;
      }

      .progress-bar {
        height: 8px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        overflow: hidden;
        margin: 1rem 0;
      }

      .progress {
        height: 100%;
        background: linear-gradient(90deg, #e94560 0%, #ff6b6b 100%);
        transition: width 0.3s ease;
      }

      .progress.warning {
        background: linear-gradient(90deg, #ffc107 0%, #ff9800 100%);
      }

      .recommendation {
        font-size: 0.85rem;
        color: #b0b0b0;
        font-style: italic;
        margin: 1rem 0 0 0;
      }

      .brawlers-table {
        overflow-x: auto;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        overflow: hidden;
      }

      th {
        background: rgba(233, 69, 96, 0.2);
        padding: 1rem;
        text-align: left;
        font-weight: 600;
        border-bottom: 2px solid rgba(233, 69, 96, 0.3);
      }

      td {
        padding: 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      tr:last-child td {
        border-bottom: none;
      }

      tr:hover {
        background: rgba(255, 255, 255, 0.02);
      }

      .progress-inline {
        display: inline-block;
        width: 100px;
        height: 6px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
        overflow: hidden;
        margin-right: 0.5rem;
      }

      .progress-inline .progress {
        height: 100%;
      }
    </style>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      playerTag: '',
      analysis: null,
      loading: false,
      error: null,
      activeTab: 'recommendations',
    };
  },
  methods: {
    async searchPlayer() {
      if (!this.playerTag.trim()) {
        this.error = 'Por favor, insira uma tag de jogador';
        return;
      }

      this.loading = true;
      this.error = null;
      this.analysis = null;

      try {
        const response = await axios.get(`/api/analysis/${this.playerTag}`);
        this.analysis = response.data;
      } catch (err) {
        this.error =
          err.response?.data?.error ||
          'Erro ao buscar dados. Verifique a tag e se o servidor está rodando.';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
