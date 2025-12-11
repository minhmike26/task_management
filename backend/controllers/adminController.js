import User from "../models/userModel.js";
import Task from "../models/taskModel.js";

// Get all users (Admin only)
export async function getAllUsers(req, res) {
  try {
    const users = await User.find()
      .select("name email role createdAt googleId")
      .sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// Get all tasks from all users (Admin only)
export async function getAllTasks(req, res) {
  try {
    console.log("📋 Admin getAllTasks called by user:", req.user._id || req.user.id);
    const tasks = await Task.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });
    console.log(`✅ Found ${tasks.length} tasks`);
    res.json({ success: true, tasks });
  } catch (error) {
    console.error("❌ Error in getAllTasks:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// Update user role (Admin only)
export async function updateUserRole(req, res) {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role || !["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be 'user' or 'admin'",
      });
    }

    // Prevent admin from removing their own admin role
    if (userId === req.user.id && role === "user") {
      return res.status(400).json({
        success: false,
        message: "You cannot remove your own admin role",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select("name email role");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// Delete user (Admin only)
export async function deleteUser(req, res) {
  try {
    const { userId } = req.params;

    // Prevent admin from deleting themselves
    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Also delete all tasks owned by this user
    await Task.deleteMany({ owner: userId });

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// Get statistics (Admin only)
export async function getStatistics(req, res) {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ completed: true });
    const googleUsers = await User.countDocuments({
      googleId: { $exists: true, $ne: null },
    });

    // Priority statistics
    const highPriorityTasks = await Task.countDocuments({ priority: "High" });
    const mediumPriorityTasks = await Task.countDocuments({
      priority: "Medium",
    });
    const lowPriorityTasks = await Task.countDocuments({ priority: "Low" });

    // Tasks by date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tasksToday = await Task.countDocuments({
      createdAt: { $gte: today },
    });

    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    const tasksThisWeek = await Task.countDocuments({
      createdAt: { $gte: thisWeek },
    });

    res.json({
      success: true,
      statistics: {
        totalUsers,
        totalAdmins,
        totalTasks,
        completedTasks,
        pendingTasks: totalTasks - completedTasks,
        googleUsers,
        regularUsers: totalUsers - googleUsers,
        highPriorityTasks,
        mediumPriorityTasks,
        lowPriorityTasks,
        tasksToday,
        tasksThisWeek,
        completionRate:
          totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// Admin can view any task by ID
export async function getTaskById(req, res) {
  try {
    const task = await Task.findById(req.params.id).populate(
      "owner",
      "name email"
    );
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }
    res.json({ success: true, task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// Admin can update any task
export async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    if (data.completed !== undefined) {
      data.completed = data.completed === "Yes" || data.completed === true;
    }

    const updatedTask = await Task.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate("owner", "name email");

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({ success: true, task: updatedTask });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: "Server error" });
  }
}

// Admin can delete any task
export async function deleteTask(req, res) {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }
    res.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: "Server error" });
  }
}

// Get tasks by user ID (Admin can see any user's tasks)
export async function getTasksByUserId(req, res) {
  try {
    const { userId } = req.params;
    const tasks = await Task.find({ owner: userId })
      .populate("owner", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// Search users (Admin only)
export async function searchUsers(req, res) {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    })
      .select("name email role createdAt googleId")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// Filter tasks (Admin only) - by priority, status, user, date
export async function filterTasks(req, res) {
  try {
    const { priority, completed, userId, startDate, endDate } = req.query;
    const filter = {};

    if (priority) filter.priority = priority;
    if (completed !== undefined) filter.completed = completed === "true";
    if (userId) filter.owner = userId;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const tasks = await Task.find(filter)
      .populate("owner", "name email")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ success: true, tasks, count: tasks.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
