import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FileText,
  Filter,
  Trash2,
  Edit2,
  User,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";

const AdminTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    priority: "",
    completed: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deletedTaskTitle, setDeletedTaskTitle] = useState("");

  useEffect(() => {
    // Fetch tasks on mount
    fetchAllTasks();
  }, []);

  useEffect(() => {
    // Filter when filters change
    if (filters.priority || filters.completed !== "") {
      filterTasks();
    } else {
      fetchAllTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchAllTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found");
        setLoading(false);
        return;
      }
      const { data } = await axios.get(
        "http://localhost:5000/api/admin/tasks",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        setTasks(data.tasks || []);
      } else {
        toast.error(data.message || "Failed to load tasks");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load tasks";
      toast.error(errorMessage);
      // Log chi tiết để debug
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found");
        setLoading(false);
        return;
      }
      const params = new URLSearchParams();
      if (filters.priority) params.append("priority", filters.priority);
      if (filters.completed !== "")
        params.append("completed", filters.completed);

      const { data } = await axios.get(
        `http://localhost:5000/api/admin/tasks/filter?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        setTasks(data.tasks || []);
      } else {
        toast.error(data.message || "Filter failed");
      }
    } catch (error) {
      console.error("Error filtering tasks:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Filter failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (taskId) => {
    const task = tasks.find((t) => t._id === taskId);
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const deleteTask = async () => {
    if (!taskToDelete) return;

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.delete(
        `http://localhost:5000/api/admin/tasks/${taskToDelete._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        setDeletedTaskTitle(taskToDelete.title);
        setShowDeleteModal(false);
        setShowSuccessModal(true);
        fetchAllTasks();
        // Auto close success modal after 3 seconds
        setTimeout(() => {
          setShowSuccessModal(false);
          setTaskToDelete(null);
        }, 3000);
      }
    } catch (error) {
      setShowDeleteModal(false);
      toast.error(
        error.response?.data?.message ||
          "Failed to delete task. Please try again.",
        {
          position: "top-center",
          autoClose: 4000,
        }
      );
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-orange-100 text-orange-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && taskToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">
                Delete Task?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-800">
                  "{taskToDelete.title}"
                </span>
                ?
                <br />
                <span className="text-sm text-red-600 mt-2 block">
                  This action cannot be undone.
                </span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setTaskToDelete(null);
                  }}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteTask}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all animate-fadeIn">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full animate-bounce">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">
                Success!
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Task{" "}
                <span className="font-semibold text-gray-800">
                  "{deletedTaskTitle}"
                </span>{" "}
                has been deleted successfully.
              </p>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setDeletedTaskTitle("");
                }}
                className="w-full px-4 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FileText className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />
          Task Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          View and manage all tasks from all users
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-purple-100">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-purple-500" />
          <h3 className="font-semibold text-gray-800">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={filters.priority}
              onChange={(e) =>
                setFilters({ ...filters, priority: e.target.value })
              }
              className="w-full px-3 py-2 border border-purple-100 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.completed}
              onChange={(e) =>
                setFilters({ ...filters, completed: e.target.value })
              }
              className="w-full px-3 py-2 border border-purple-100 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Status</option>
              <option value="true">Completed</option>
              <option value="false">Pending</option>
            </select>
          </div>
        </div>
        <button
          onClick={() => {
            setFilters({ priority: "", completed: "" });
            fetchAllTasks();
          }}
          className="mt-4 px-4 py-2 text-sm text-gray-600 hover:text-purple-600"
        >
          Clear Filters
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-purple-100">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No tasks found</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white rounded-xl p-4 shadow-sm border border-purple-100 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {task.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                    {task.completed ? (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        Completed
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                        Pending
                      </span>
                    )}
                  </div>
                  {task.description && (
                    <p className="text-sm text-gray-600 mb-2">
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {task.owner && (
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{task.owner.name || task.owner.email}</span>
                      </div>
                    )}
                    {task.dueDate && (
                      <span>
                        Due: {format(new Date(task.dueDate), "MMM dd, yyyy")}
                      </span>
                    )}
                    {task.createdAt && (
                      <span>
                        Created:{" "}
                        {format(new Date(task.createdAt), "MMM dd, yyyy")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleDeleteClick(task._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminTasks;
