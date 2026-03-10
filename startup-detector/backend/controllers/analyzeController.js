import { getStartupAnalysis } from '../services/openaiService.js';

export const analyzeStartupIdea = async (req, res) => {
  const { idea } = req.body;

  if (!idea || idea.trim().length < 10) {
    return res.status(400).json({ error: 'Please provide a valid startup idea (at least 10 characters).' });
  }

  try {
    const result = await getStartupAnalysis(idea.trim());
    return res.json(result);
  } catch (err) {
    console.error('Analysis error:', err.message);
    return res.status(500).json({ error: 'Failed to analyze startup idea. Please try again.' });
  }
};
