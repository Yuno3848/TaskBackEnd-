import mongoose, { Schema } from "mongoose";

const projectNoteSchema = new Schema(
  {
    project: {
      type: Schema.Types.ObjectId,
      refer: "Project",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      refer: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const User = mongoose.model();
