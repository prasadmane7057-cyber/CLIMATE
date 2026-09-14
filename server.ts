import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return genAIClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', engine: 'ClimaForge Tactical Command Engine v4.2' });
});

// Gemini-powered tactical advisory endpoint
app.post('/api/ai/generate-plan', async (req, res) => {
  try {
    const { zoneId, zoneName, pumps, barricades, rainfall, simulated } = req.body;
    const ai = getGenAI();

    if (!ai) {
      // Deterministic fallback if API key is not configured
      return res.json({
        source: 'deterministic',
        directive: pumps >= 2 
          ? `Deploy ${Math.min(2, pumps)} high-capacity mobile pump units to Culvert C-4 inlet at Main Junction A while maintaining ${barricades} barrier units along 4th Ave.`
          : 'CRITICAL WARNING: 1 Pump is insufficient to relieve Culvert C-4 backflow. Reallocate auxiliary units immediately.',
        rationale: 'Main Junction A represents the apex leverage point (9.4/10). Stabilizing this node preserves the St. Jude hospital trauma corridor.',
        confidence: 94.2,
        priority: 'P0 (IMMEDIATE)',
        executionWindow: '< 14 MIN',
        targetCascade: 'Road closure → Traffic Disruption → Emergency Delay',
        projectedPayoff: 'Averts 78% downstream congestion; trauma transit maintained within 4 min'
      });
    }

    const prompt = `You are ClimaForge's Tactical Hydrological Intervention AI in an Emergency Operations Center (EOC).
Current Incident Telemetry:
- Zone: ${zoneName || 'Zone A Metro Riverside'} (${zoneId || 'A'})
- Rain Intensity: ${rainfall || '52 mm/hr'}
- Deployed Mobile Pumps: ${pumps || 2} units (40 m3/s per unit)
- Deployed Flood Barricades: ${barricades || 3} sets (100m ea)
- Inviolable Operational Constraint: "EMERGENCY CORRIDOR MUST REMAIN ACCESSIBLE (AMBULANCE ACCESS < 5 MIN)"
- Apex Leverage Point: Main Junction A & Culvert C-4

Provide an authoritative, concise military/civil-defense style tactical directive in JSON with these exact fields:
{
  "directive": "Exact action command (under 30 words)",
  "rationale": "Deterministic hydrological rationale (under 40 words)",
  "targetCascade": "Domino progression to sever (e.g. Inundation -> Gridlock -> Hospital cutoff)",
  "projectedPayoff": "Quantified result including ambulance transit time",
  "confidence": 94.5,
  "priority": "P0 (IMMEDIATE)",
  "executionWindow": "< 14 MIN"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ source: 'gemini-3.8-flash', ...parsed });
  } catch (error) {
    console.error('Gemini plan error:', error);
    res.json({
      source: 'deterministic-fallback',
      directive: 'Deploy 1 high-capacity mobile pump directly to Culvert C-4 inlet at Main Junction A while staging 2 barrier units on 4th Ave.',
      rationale: 'Main Junction A represents the apex leverage point (9.4 score). Protecting this conduit averts gridlock on the designated hospital trauma corridor.',
      targetCascade: 'Road closure → Traffic Disruption → Emergency Delay',
      projectedPayoff: 'Averts 78% downstream congestion; trauma transit maintained within 4 min',
      confidence: 94.2,
      priority: 'P0 (IMMEDIATE)',
      executionWindow: '< 14 MIN'
    });
  }
});

// Vite Middleware for development / Static files for production
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ClimaForge Command Server running on http://0.0.0.0:${PORT}`);
  });
}

setupVite();
