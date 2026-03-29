import mongoose from "mongoose";

const aiRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    prompt: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const AIRequest = mongoose.model("AIRequest", aiRequestSchema);

export default AIRequest;
