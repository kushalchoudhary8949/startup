import { getExecutionRoadmap } from '../services/roadmapService.js';

export const generateRoadmap = async (req, res) => {
  const { idea, analysis } = req.body;

  if (!idea) {
    return res.status(400).json({ error: 'Idea is required.' });
  }

  try {
    const roadmap = await getExecutionRoadmap(idea, analysis);
    return res.json({ roadmap });
  } catch (err) {
    console.error('Roadmap error:', err.message);
    return res.status(500).json({ error: err.message || 'Roadmap generation failed.' });
  }
};