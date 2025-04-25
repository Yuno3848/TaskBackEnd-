import mongoose, { Schema } from "mongoose";

import { AvailableUserRoles } from "../utils/constants.js";
const projectMemberSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      require: true,
    },
    role: {
      type: String,
      enum: AvailableUserRoles,
    },
  },
  { timestamps: true },
);
export const projectMembers = mongoose.Model(
  "projectMember",
  projectMemberSchema,
);
