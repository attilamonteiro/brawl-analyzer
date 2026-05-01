import { PlayerProfile, BrawlerData } from './brawlStarsApi';

export interface AnalyzedBrawler {
  id: number;
  name: string;
  trophies: number;
  maxTrophies: number;
  power: number;
  bracket: number;
  progress: number;
  efficiency: number;
  potentialGain: number;
  recommendation: string;
}

export interface Analysis {
  player: {
    name: string;
    tag: string;
    trophies: number;
    totalBrawlers: number;
  };
  allBrawlers: AnalyzedBrawler[];
  recommendations: {
    byPotentialGain: AnalyzedBrawler[];
    byEfficiency: AnalyzedBrawler[];
    needsAttention: AnalyzedBrawler[];
  };
}

const TROPHY_BRACKETS = {
  0: { min: 0, max: 250, avgPerLevel: 12 },
  250: { min: 250, max: 500, avgPerLevel: 15 },
  500: { min: 500, max: 750, avgPerLevel: 18 },
  750: { min: 750, max: 1000, avgPerLevel: 20 },
  1000: { min: 1000, max: 1500, avgPerLevel: 25 },
  1500: { min: 1500, max: 2000, avgPerLevel: 30 },
  2000: { min: 2000, max: 3000, avgPerLevel: 40 },
};

function findBracket(
  trophies: number
): {
  min: number;
  max: number;
  avgPerLevel: number;
} {
  const keys = Object.keys(TROPHY_BRACKETS)
    .map(Number)
    .sort((a, b) => a - b);

  for (let i = keys.length - 1; i >= 0; i--) {
    if (trophies >= keys[i]) {
      return TROPHY_BRACKETS[keys[i] as keyof typeof TROPHY_BRACKETS];
    }
  }

  return TROPHY_BRACKETS[0];
}

function getRecommendation(
  brawler: BrawlerData,
  bracket: { min: number; max: number; avgPerLevel: number },
  efficiency: number
): string {
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

export function analyzeBrawlers(playerData: PlayerProfile): Analysis {
  const brawlers = playerData.brawlers || [];

  const analyzed: AnalyzedBrawler[] = brawlers.map((brawler) => {
    const bracket = findBracket(brawler.trophies);
    const progress =
      ((brawler.trophies - bracket.min) / (bracket.max - bracket.min)) * 100;
    const efficiency =
      ((brawler.trophies - bracket.min) / (brawler.power - 1)) /
      bracket.avgPerLevel;

    return {
      id: brawler.id,
      name: brawler.name,
      trophies: brawler.trophies,
      power: brawler.power,
      maxTrophies: brawler.maxTrophies,
      bracket: bracket.min,
      progress: Math.min(progress, 100),
      efficiency,
      potentialGain: Math.max(0, bracket.max - brawler.trophies),
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
