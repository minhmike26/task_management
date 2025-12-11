import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  Shield,
  FileText,
  Calendar,
  Target,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        "http://localhost:5000/api/admin/statistics",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        setStatistics(data.statistics);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
          <p className="font-medium">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!statistics) return null;

  const statCards = [
    {
      title: "Total Users",
      value: statistics.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Admins",
      value: statistics.totalAdmins,
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Tasks",
      value: statistics.totalTasks,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Completed",
      value: statistics.completedTasks,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Pending",
      value: statistics.pendingTasks,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Completion Rate",
      value: `${statistics.completionRate}%`,
      icon: TrendingUp,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
  ];

  const priorityStats = [
    { label: "High Priority", value: statistics.highPriorityTasks, color: "text-red-600" },
    { label: "Medium Priority", value: statistics.mediumPriorityTasks, color: "text-orange-600" },
    { label: "Low Priority", value: statistics.lowPriorityTasks, color: "text-green-600" },
  ];

  // Data cho Bar Chart - Tasks by Priority
  const priorityChartData = [
    { name: "High", value: statistics.highPriorityTasks, color: "#ef4444" },
    { name: "Medium", value: statistics.mediumPriorityTasks, color: "#f97316" },
    { name: "Low", value: statistics.lowPriorityTasks, color: "#22c55e" },
  ];

  // Data cho Pie Chart - Task Completion Status
  const completionChartData = [
    { name: "Completed", value: statistics.completedTasks, color: "#10b981" },
    { name: "Pending", value: statistics.pendingTasks, color: "#f59e0b" },
  ];

  // Data cho Pie Chart - User Types
  const userTypeChartData = [
    { name: "Google Users", value: statistics.googleUsers, color: "#3b82f6" },
    { name: "Regular Users", value: statistics.regularUsers, color: "#10b981" },
  ];

  // Custom label cho Pie Chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={14}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Shield className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />
          Admin Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Overview of system statistics and activities
        </p>
      </div>

      {/* Main Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-4 shadow-sm border border-purple-100 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Bar Chart - Tasks by Priority */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-purple-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" />
            Tasks by Priority
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={priorityChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {priorityChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Task Completion Status */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-purple-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-purple-500" />
            Task Completion Status
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={completionChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {completionChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span style={{ color: "#374151" }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - User Types */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-purple-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-500" />
            User Types Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={userTypeChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {userTypeChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span style={{ color: "#374151" }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Additional Stats Card */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-purple-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            Quick Stats
          </h3>
          <div className="space-y-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
              <p className="text-2xl font-bold text-purple-600">
                {statistics.completionRate}%
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Tasks Today</p>
                <p className="text-xl font-bold text-blue-600">
                  {statistics.tasksToday}
                </p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Tasks This Week</p>
                <p className="text-xl font-bold text-indigo-600">
                  {statistics.tasksThisWeek}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-purple-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-500" />
          Recent Activity
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">Tasks Created Today</p>
            <p className="text-2xl font-bold text-purple-600">{statistics.tasksToday}</p>
          </div>
          <div className="p-3 bg-indigo-50 rounded-lg">
            <p className="text-sm text-gray-600">Tasks Created This Week</p>
            <p className="text-2xl font-bold text-indigo-600">{statistics.tasksThisWeek}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

