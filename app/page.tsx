'use client';

import { useState } from 'react';
import { Analysis, AnalyzedBrawler } from '@/lib/analyzer';

export default function Home() {
  const [playerTag, setPlayerTag] = useState('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('recommendations');

  const searchPlayer = async () => {
    if (!playerTag.trim()) {
      setError('Por favor, insira uma tag de jogador');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const response = await fetch(
        `/api/analysis?tag=${encodeURIComponent(playerTag)}`
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao buscar dados');
        return;
      }

      setAnalysis(data);
      setActiveTab('recommendations');
    } catch (err) {
      setError(
        'Erro ao conectar com o servidor. Verifique a tag e tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchPlayer();
    }
  };

  const renderBrawlerCard = (brawler: AnalyzedBrawler, isWarning = false) => (
    <div
      key={brawler.id}
      className={`brawler-card ${isWarning ? 'warning' : ''}`}
    >
      <div className="brawler-header">
        <h3>{brawler.name}</h3>
        <span className="level">⭐ {brawler.power}</span>
      </div>
      <div className="brawler-stats">
        <p>
          <strong>Troféus:</strong> {brawler.trophies} / {brawler.maxTrophies}
        </p>
        {!isWarning && (
          <p>
            <strong>Ganho Potencial:</strong> {brawler.potentialGain} 🏆
          </p>
        )}
        <p>
          <strong>Progresso da Faixa:</strong> {brawler.progress.toFixed(1)}%
        </p>
      </div>
      <div className="progress-bar">
        <div
          className={`progress ${isWarning ? 'warning' : ''}`}
          style={{ width: `${brawler.progress}%` }}
        ></div>
      </div>
      <p className="recommendation">{brawler.recommendation}</p>
    </div>
  );

  return (
    <>
      <header className="header">
        <div className="container">
          <h1>⚡ Brawl Stars Analyzer</h1>
          <p>Analise seu perfil e descubra quem upuar</p>
        </div>
      </header>

      <main className="container">
        <div className="search-section">
          <div className="search-box">
            <input
              value={playerTag}
              onChange={(e) => setPlayerTag(e.target.value)}
              onKeyPress={handleKeyPress}
              type="text"
              placeholder="Cole sua tag (#ABC123) ou ID"
              className="input"
            />
            <button
              onClick={searchPlayer}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
          {error && <p className="error">{error}</p>}
        </div>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Carregando dados do jogador...</p>
          </div>
        )}

        {analysis && (
          <div className="analysis-section">
            <div className="player-header">
              <div>
                <h2>{analysis.player.name}</h2>
                <p className="tag">{analysis.player.tag}</p>
              </div>
              <div className="stats">
                <div className="stat">
                  <span className="label">Troféus Totais</span>
                  <span className="value">{analysis.player.trophies}</span>
                </div>
                <div className="stat">
                  <span className="label">Brawlers</span>
                  <span className="value">{analysis.player.totalBrawlers}</span>
                </div>
              </div>
            </div>

            <div className="tabs">
              <button
                onClick={() => setActiveTab('recommendations')}
                className={`tab ${activeTab === 'recommendations' ? 'active' : ''}`}
              >
                🎯 Recomendações
              </button>
              <button
                onClick={() => setActiveTab('efficiency')}
                className={`tab ${activeTab === 'efficiency' ? 'active' : ''}`}
              >
                ⚙️ Por Eficiência
              </button>
              <button
                onClick={() => setActiveTab('needsAttention')}
                className={`tab ${activeTab === 'needsAttention' ? 'active' : ''}`}
              >
                ⚠️ Precisa Atenção
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`tab ${activeTab === 'all' ? 'active' : ''}`}
              >
                📊 Todos
              </button>
            </div>

            {activeTab === 'recommendations' && (
              <div className="brawlers-grid">
                {analysis.recommendations.byPotentialGain.map((b) =>
                  renderBrawlerCard(b)
                )}
              </div>
            )}

            {activeTab === 'efficiency' && (
              <div className="brawlers-grid">
                {analysis.recommendations.byEfficiency.map((b) => (
                  <div key={b.id} className="brawler-card">
                    <div className="brawler-header">
                      <h3>{b.name}</h3>
                      <span className="level">⭐ {b.power}</span>
                    </div>
                    <div className="brawler-stats">
                      <p>
                        <strong>Troféus:</strong> {b.trophies}
                      </p>
                      <p>
                        <strong>Eficiência:</strong> {b.efficiency.toFixed(2)}x
                      </p>
                      <p>
                        <strong>Progresso:</strong> {b.progress.toFixed(1)}%
                      </p>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress"
                        style={{ width: `${b.progress}%` }}
                      ></div>
                    </div>
                    <p className="recommendation">{b.recommendation}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'needsAttention' && (
              <div className="brawlers-grid">
                {analysis.recommendations.needsAttention.map((b) =>
                  renderBrawlerCard(b, true)
                )}
              </div>
            )}

            {activeTab === 'all' && (
              <div className="brawlers-table">
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
                    {analysis.allBrawlers.map((b) => (
                      <tr key={b.id}>
                        <td>
                          <strong>{b.name}</strong>
                        </td>
                        <td>
                          {b.trophies} / {b.maxTrophies}
                        </td>
                        <td>⭐ {b.power}</td>
                        <td>
                          <div className="progress-inline">
                            <div
                              className="progress"
                              style={{ width: `${b.progress}%` }}
                            ></div>
                          </div>
                          {b.progress.toFixed(1)}%
                        </td>
                        <td>{b.efficiency.toFixed(2)}x</td>
                        <td>{b.recommendation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
