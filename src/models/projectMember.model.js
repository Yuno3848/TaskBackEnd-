import mongoose from "mongoose";
import { AvailableUserRoles } from "../utils/constants.js";
const projectMemberSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: true,
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
});
export const projectMembers = mongoose.Model(
  "projectMember",
  projectMemberSchema,
);
