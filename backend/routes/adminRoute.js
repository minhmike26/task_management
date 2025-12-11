import express from "express";
import authMiddleware from "../middleware/auth.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {
  getAllUsers,
  getAllTasks,
  updateUserRole,
  deleteUser,
  getStatistics,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByUserId,
  searchUsers,
  filterTasks,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

// All admin routes require both authentication and admin role
adminRouter.use(authMiddleware);
adminRouter.use(adminMiddleware);

// Admin routes - User Management
adminRouter.get("/users", getAllUsers);
adminRouter.get("/users/search", searchUsers);
adminRouter.put("/users/:userId/role", updateUserRole);
adminRouter.delete("/users/:userId", deleteUser);
adminRouter.get("/users/:userId/tasks", getTasksByUserId);

// Admin routes - Task Management
adminRouter.get("/tasks", getAllTasks);
adminRouter.get("/tasks/filter", filterTasks);
adminRouter.get("/tasks/:id", getTaskById);
adminRouter.put("/tasks/:id", updateTask);
adminRouter.delete("/tasks/:id", deleteTask);

// Admin routes - Statistics
adminRouter.get("/statistics", getStatistics);

export default adminRouter;

