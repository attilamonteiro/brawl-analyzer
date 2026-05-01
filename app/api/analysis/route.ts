import { NextRequest, NextResponse } from 'next/server';
import { getPlayerProfile } from '@/lib/brawlStarsApi';
import { analyzeBrawlers } from '@/lib/analyzer';

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
    return NextResponse.json(analysis);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
