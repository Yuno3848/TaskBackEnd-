import mongoose, { Schema } from "mongoose";

const project = new Schema(
  {
    name: {
      type: String,
      unique: true,
      require: true,
    },

    description: {
      type: String,
      require: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      refer: "User",
    },
  },
  { timestamps: true },
);
export const Project = mongoose.Model("Project", project);
