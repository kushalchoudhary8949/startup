import { getChatResponse } from '../services/chatService.js';

export const chatWithAI = async (req, res) => {
  const { messages, ideaContext } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required.' });
  }

  try {
    const reply = await getChatResponse(messages, ideaContext);
    return res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err.message);
    return res.status(500).json({ error: err.message || 'Chat failed. Please try again.' });
  }
};