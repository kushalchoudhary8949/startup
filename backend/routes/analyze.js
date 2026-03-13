import express from 'express';
import { analyzeStartupIdea } from '../controllers/analyzeController.js';
import { chatWithAI } from '../controllers/chatController.js';
import { generateRoadmap } from '../controllers/roadmapController.js';
import { getHistory, saveIdea } from '../controllers/historyController.js';

const router = express.Router();

router.post('/analyze', analyzeStartupIdea);
router.post('/chat', chatWithAI);
router.post('/roadmap', generateRoadmap);
router.post('/save', saveIdea);
router.get('/history', getHistory);

export default router;

// import express from 'express';
// import { analyzeStartupIdea } from '../controllers/analyzeController.js';

// const router = express.Router();

// router.post('/analyze', analyzeStartupIdea);

// export default router;
