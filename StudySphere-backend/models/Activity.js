import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  method: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    required: true,
  },
  durationMs: {
    type: Number,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  ip: {
    type: String,
    default: "",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  userLabel: {
    type: String,
    default: "anonymous",
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
