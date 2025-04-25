import mongoose, { Schema } from "mongoose";

const SubtaskSchema = new Schema(
  {
    title: {
      trype: String,
      required: true,
      trim: true,
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);
export const SubTask = mongoose.model("SubTask", SubtaskSchema);
