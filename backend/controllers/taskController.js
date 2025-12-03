import Task from "../models/taskModel.js";

//Create a new task for logged in user logic
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, completed } = req.body;
    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      completed: completed === "Yes" || completed === true,
      owner: req.user.id,
    });
    const savedTask = await task.save();
    res.status(201).json({ success: true, task: savedTask });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: "Server error" });
  }
};

//Get all tasks for logged in user logic
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user.id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//Get a single task by id logic
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user.id });
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
    res.json({ success: true, task });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: "Server error" });
  }
};

//Update a task by id logic
export const updateTask = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.completed !== undefined) {
      data.completed = data.completed === "Yes" || data.completed === true;
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      data,
      { new: true, runValidators: true }
    );
    if (!updatedTask) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found or not yours" });
    }
    res.json({ success: true, task: updatedTask });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: "Server error" });
  }
};

//Delete a task logic
export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });
    if (!deletedTask) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found or not yours" });
    }
    res.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: "Server error" });
  }
};

