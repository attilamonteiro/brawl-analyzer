const API_BASE_URL = 'https://api.brawlstars.com/v1';
const API_KEY = process.env.BRAWL_STARS_API_KEY;

export interface BrawlerData {
  id: number;
  name: string;
  power: number;
  rank: number;
  trophies: number;
  maxTrophies: number;
}

export interface PlayerProfile {
  tag: string;
  name: string;
  trophies: number;
  highestTrophies: number;
  brawlers: BrawlerData[];
}

export async function getPlayerProfile(tag: string): Promise<PlayerProfile> {
  if (!API_KEY) {
    throw new Error('BRAWL_STARS_API_KEY not configured');
  }

  const cleanTag = tag.startsWith('#') ? tag : `#${tag}`;
  const encodedTag = encodeURIComponent(cleanTag);

  const response = await fetch(
    `${API_BASE_URL}/players/${encodedTag}`,
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Jogador não encontrado. Verifique a tag.');
    }
    throw new Error(`Erro ao buscar dados: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export interface Battle {
  battleTime: string;
  event: {
    id: number;
    mode: string;
    map: string;
  };
  battle: {
    mode: string;
    result: 'victory' | 'defeat' | 'draw';
    duration: number;
    trophyChange: number;
  };
}

export interface BattleLog {
  items: Battle[];
}

export async function getBattleLog(tag: string): Promise<BattleLog> {
  if (!API_KEY) {
    throw new Error('BRAWL_STARS_API_KEY not configured');
  }

  const cleanTag = tag.startsWith('#') ? tag : `#${tag}`;
  const encodedTag = encodeURIComponent(cleanTag);

  const response = await fetch(
    `${API_BASE_URL}/players/${encodedTag}/battlelog`,
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Erro ao buscar battlelog: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
