import axios from 'axios';

const API_BASE_URL = 'https://api.brawlstars.com/v1';
const API_KEY = process.env.BRAWL_STARS_API_KEY;

if (!API_KEY) {
  console.warn('⚠️  BRAWL_STARS_API_KEY not set in .env file');
}

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
  },
});

export async function getPlayerProfile(tag) {
  const cleanTag = tag.startsWith('#') ? tag : `#${tag}`;
  const encodedTag = encodeURIComponent(cleanTag);

  const response = await client.get(`/players/${encodedTag}`);
  return response.data;
}

export async function getBrawler(playerTag, brawlerId) {
  const cleanTag = playerTag.startsWith('#') ? playerTag : `#${playerTag}`;
  const encodedTag = encodeURIComponent(cleanTag);

  const response = await client.get(`/players/${encodedTag}/battlelog`);
  return response.data;
}
