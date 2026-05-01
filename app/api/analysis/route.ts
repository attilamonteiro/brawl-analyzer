import { NextRequest, NextResponse } from 'next/server';
import { getPlayerProfile, getBattleLog } from '@/lib/brawlStarsApi';
import { analyzeBrawlers, calculateWinRateByBrawler } from '@/lib/analyzer';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tag = searchParams.get('tag');

  if (!tag) {
    return NextResponse.json(
      { error: 'Tag é obrigatória' },
      { status: 400 }
    );
  }

  try {
    const playerProfile = await getPlayerProfile(tag);
    const analysis = analyzeBrawlers(playerProfile);

    // Tentar buscar histórico de batalhas para análise de probabilidade
    try {
      const battleLog = await getBattleLog(tag);
      const winRates = calculateWinRateByBrawler(battleLog, playerProfile.brawlers);

      if (analysis.allBrawlers && winRates.length > 0) {
        // Adicionar win rate aos brawlers
        analysis.allBrawlers = analysis.allBrawlers.map((b) => {
          const wr = winRates.find(w => w.brawlerId === b.id);
          return {
            ...b,
            winRate: wr?.winRate || 50,
            probabilityTo4k: wr?.probabilityTo4k || 0,
            estimatedDaysTo4k: wr?.estimatedDaysTo4k || 0,
          };
        });
      }
    } catch (error) {
      // Se falhar ao buscar battlelog, continua sem probabilidade
      console.log('Aviso: não foi possível buscar histórico de batalhas');
    }

    return NextResponse.json(analysis);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
