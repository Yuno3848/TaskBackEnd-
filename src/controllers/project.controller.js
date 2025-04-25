import { Member } from "../models/projectMember.model.js";
import { Users } from "../models/user.models.js";
import { Project } from "../models/project.model.js";
export const addProject = async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user?._id;

  try {
    const existingProject = await Project.findOne({ name });
    if (existingProject) {
      return res.status(409).json({
        status: "failed",
        message: "Project already exists with this name",
      });
    }

    const project = await Project.create({
      name,
      description,
      createdBy: userId,
    });

    if (!project) {
      throw new Error("Project creation failed");
    }

    return res.status(201).json({
      status: "success",
      message: "Project created successfully",
      data: {
        id: project._id,
        name: project.name,
        description: project.description,
        createdAt: project.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal Server Problem",
      error: error.message,
    });
  }
};
export const getProjects = async (req, res) => {
    
};
export const getProjectById = async (req, res) => {};
export const createProject = async (req, res) => {};
export const updateProject = async (req, res) => {};
export const deleteProject = async (req, res) => {};
export const addProjectMembers = async (req, res) => {};
export const getProjectMembers = async (req, res) => {};
export const updateProjectMembers = async (req, res) => {};
export const updateMemberRole = async (req, res) => {};
export const deleteMember = async (req, res) => {};
//findOneandDelete
