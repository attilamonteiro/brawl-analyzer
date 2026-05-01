export function getBrawlerAnalysis(playerData) {
  const brawlers = playerData.brawlers || [];

  const trophyBrackets = {
    0: { min: 0, max: 250, avgPerLevel: 12 },
    250: { min: 250, max: 500, avgPerLevel: 15 },
    500: { min: 500, max: 750, avgPerLevel: 18 },
    750: { min: 750, max: 1000, avgPerLevel: 20 },
    1000: { min: 1000, max: 1500, avgPerLevel: 25 },
    1500: { min: 1500, max: 2000, avgPerLevel: 30 },
  };

  const analyzed = brawlers.map((brawler) => {
    const bracket = findBracket(brawler.trophies, trophyBrackets);
    const maxTrophies = bracket.max;
    const progress = ((brawler.trophies - bracket.min) / (bracket.max - bracket.min)) * 100;
    const efficiency =
      ((brawler.trophies - bracket.min) / (brawler.power - 1)) / bracket.avgPerLevel;

    return {
      id: brawler.id,
      name: brawler.name,
      trophies: brawler.trophies,
      power: brawler.power,
      maxTrophies: brawler.maxTrophies,
      bracket: bracket.min,
      progress: Math.min(progress, 100),
      efficiency,
      potentialGain: Math.max(0, maxTrophies - brawler.trophies),
      recommendation: getRecommendation(brawler, bracket, efficiency),
    };
  });

  const recommendations = analyzed
    .sort((a, b) => b.potentialGain - a.potentialGain)
    .slice(0, 5);

  const topEfficient = analyzed
    .sort((a, b) => b.efficiency - a.efficiency)
    .slice(0, 5);

  const needsAttention = analyzed
    .filter((b) => b.progress < 30)
    .sort((a, b) => a.progress - b.progress)
    .slice(0, 5);

  return {
    player: {
      name: playerData.name,
      tag: playerData.tag,
      trophies: playerData.trophies,
      totalBrawlers: brawlers.length,
    },
    allBrawlers: analyzed,
    recommendations: {
      byPotentialGain: recommendations,
      byEfficiency: topEfficient,
      needsAttention,
    },
  };
}

function findBracket(trophies, brackets) {
  const keys = Object.keys(brackets)
    .map(Number)
    .sort((a, b) => a - b);

  for (let i = keys.length - 1; i >= 0; i--) {
    if (trophies >= keys[i]) {
      return brackets[keys[i]];
    }
  }

  return brackets[0];
}

function getRecommendation(brawler, bracket, efficiency) {
  if (brawler.power < 9) {
    return 'Power level muito baixo - Priorize upgrades';
  }

  if (efficiency > 1.2) {
    return 'Excelente progresso - Continuar upando';
  }

  if (efficiency > 0.8) {
    return 'Bom progresso - Considere upador';
  }

  if (efficiency < 0.4) {
    return 'Progresso lento - Considere pausar';
  }

  return 'Progresso normal - Pode continuar';
}
