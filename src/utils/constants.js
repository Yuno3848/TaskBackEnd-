export const UserRoleEnum = {
  ADMIN: "admin",
  PROJECT_ADMIN: "project_admin",
  MEMBER: "member",
};
export const AvailableUserRoles = Object.values(UserRoleEnum);

export const TaskStatusEnums = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  DONE: "done",
};
export const AvailableTaskStatus = Object.values(TaskStatusEnums);
