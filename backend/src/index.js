import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getBrawlerAnalysis } from './services/analyzer.js';
import { getPlayerProfile } from './services/brawlStarsApi.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/player/:tag', async (req, res) => {
  try {
    const { tag } = req.params;
    const player = await getPlayerProfile(tag);
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analysis/:tag', async (req, res) => {
  try {
    const { tag } = req.params;
    const player = await getPlayerProfile(tag);
    const analysis = getBrawlerAnalysis(player);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Make sure to set BRAWL_STARS_API_KEY in your .env file');
});
