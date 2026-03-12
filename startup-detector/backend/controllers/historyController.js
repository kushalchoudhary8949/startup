import Idea from "../models/Idea.js";

// @desc    Save analyzed startup idea
// @route   POST /api/analyze/save
export const saveIdea = async (req, res) => {
  try {
    const { ideaText, analysis, competitors, mvp_plan } = req.body;

    if (!ideaText || !analysis) {
      return res.status(400).json({ error: "Idea text and analysis are required" });
    }

    const newIdea = new Idea({
      ideaText,
      analysis,
      competitors: competitors || [],
      mvp_plan: mvp_plan || {},
    });

    const savedIdea = await newIdea.save();
    res.status(201).json(savedIdea);
  } catch (error) {
    console.error("Error saving idea:", error.message);
    res.status(500).json({ error: "Server error while saving idea" });
  }
};

// @desc    Get user's saved startup ideas history
// @route   GET /api/analyze/history
export const getHistory = async (req, res) => {
  try {
    const ideas = await Idea.find().sort({ createdAt: -1 });
    res.status(200).json(ideas);
  } catch (error) {
    console.error("Error fetching history:", error.message);
    res.status(500).json({ error: "Server error while fetching history" });
  }
};
