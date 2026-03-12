import mongoose from "mongoose";

const ideaSchema = new mongoose.Schema({
  ideaText: {
    type: String,
    required: true,
  },
  analysis: {
    type: Object, // We store the whole analysis JSON
    required: true,
  },
  competitors: {
    type: Array, // We store the whole competitors Array
    required: true,
  },
  mvp_plan: {
    type: Object, // Store MVP Plan
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Idea = mongoose.model("Idea", ideaSchema);

export default Idea;
