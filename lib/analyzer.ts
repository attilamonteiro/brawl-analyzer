import { PlayerProfile, BrawlerData, BattleLog } from './brawlStarsApi';

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
  winRate?: number;
  probabilityTo4k?: number;
  estimatedDaysTo4k?: number;
}

export interface BrawlerProbability {
  name: string;
  winRate: number;
  matchesPlayed: number;
  successProbability: number;
  estimatedDaysTo3000: number;
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
  probabilityAnalysis?: {
    bestBrawlers: BrawlerProbability[];
    overallSuccessProbability: number;
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
      recommendation: getRecommendation(brawler, efficiency),
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

export function calculateSuccessProbability(
  winRate: number,
  currentTrophies: number,
  targetTrophies: number,
  avgTrophiesPerWin: number = 8
): {
  probability: number;
  estimatedMatches: number;
  estimatedDays: number;
} {
  if (currentTrophies >= targetTrophies) {
    return { probability: 100, estimatedMatches: 0, estimatedDays: 0 };
  }

  const trophiesNeeded = targetTrophies - currentTrophies;
  const estimatedMatches = Math.ceil(trophiesNeeded / avgTrophiesPerWin);

  // Fórmula binomial simplificada para probabilidade
  // P(sucesso) = winRate^n onde n é proporcional ao progresso
  const probability = Math.pow(winRate / 100, Math.min(estimatedMatches / 50, 1)) * 100;

  // Estimativa: 20 matches por dia em média
  const estimatedDays = estimatedMatches / 20;

  return {
    probability: Math.max(0, Math.min(100, probability)),
    estimatedMatches,
    estimatedDays,
  };
}

export interface WinRateByBrawler {
  brawlerId: number;
  brawlerName: string;
  winRate: number;
  matchesPlayed: number;
  probabilityTo4k: number;
  estimatedDaysTo4k: number;
}

export function calculateWinRateByBrawler(
  battleLog: BattleLog,
  brawlers: BrawlerData[]
): WinRateByBrawler[] {
  // Contar vitórias por brawler
  const brawlerStats = new Map<number, { wins: number; losses: number }>();

  battleLog.items?.forEach((battle) => {
    // Aqui seria necessário ter informações do brawler usado em cada battle
    // Como a API pode não retornar isso claramente, usaremos uma estimativa
    const result = battle.battle?.result || 'draw';
    // Nota: sem ID do brawler no battlelog, fazemos uma estimativa geral
  });

  // Calcular win rate geral como fallback
  const totalMatches = battleLog.items?.length || 0;
  const totalWins = battleLog.items?.filter(
    (b) => b.battle?.result === 'victory'
  ).length || 0;
  const overallWinRate = totalMatches > 0 ? (totalWins / totalMatches) * 100 : 50;

  // Mapear para cada brawler
  return brawlers.map((brawler) => {
    const targetTrophies = 4000; // Prestigio 3
    const currentTrophies = brawler.trophies;
    const { probability, estimatedDays } = calculateSuccessProbability(
      overallWinRate,
      currentTrophies,
      targetTrophies,
      8
    );

    return {
      brawlerId: brawler.id,
      brawlerName: brawler.name,
      winRate: overallWinRate,
      matchesPlayed: totalMatches,
      probabilityTo4k: probability,
      estimatedDaysTo4k: estimatedDays,
    };
  });
}
