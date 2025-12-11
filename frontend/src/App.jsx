import React from "react";
import { Routes, Route, useNavigate, Outlet, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Signup from "./components/Signup";
import Dashboard from "./pages/Dashboard";
import PendingPage from "./pages/PendingPage";
import CompletePage from "./pages/CompletePage";
import Profile from "./components/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminTasks from "./pages/AdminTasks";

const App = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  const handleAuthSubmit = async (data) => {
    // Luôn tạo avatar từ ui-avatars, không dùng avatar từ Google hoặc database
    // Fetch user role from API
    let role = "user";
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await fetch("http://localhost:5000/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const userData = await response.json();
          if (userData.success) {
            role = userData.user.role || "user";
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch user role:", error);
    }

    const user = {
      email: data.email,
      name: data.name || "User",
      role: role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        data.name || "User"
      )}&background=random`,
    };
    setCurrentUser(user);
    // Admin redirect to /admin, user redirect to /
    navigate(role === "admin" ? "/admin" : "/", { replace: true });
  };

  // Handle Google OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const userId = urlParams.get("userId");
    const name = urlParams.get("name");
    const email = urlParams.get("email");
    const error = urlParams.get("error");

    if (error) {
      console.error("Google OAuth error:", error);
      navigate("/login?error=" + error);
      return;
    }

    if (token && userId && name && email) {
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      // Không dùng avatar từ Google, để tự động tạo từ ui-avatars
      handleAuthSubmit({ token, userId, name, email });
      // Clean URL
      window.history.replaceState({}, document.title, "/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate("/login", { replace: true });
  };

  const ProtectedLayout = () => (
    <Layout user={currentUser} onLogout={handleLogout}>
      <Outlet />
    </Layout>
  );

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Login
              onSubmit={handleAuthSubmit}
              onSwitchMode={() => navigate("/signup")}
            />
          </div>
        }
      />
      <Route
        path="/signup"
        element={
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Signup
              onSubmit={handleAuthSubmit}
              onSwitchMode={() => navigate("/login")}
            />
          </div>
        }
      />
      <Route
        path="/auth/callback"
        element={
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-700">Completing authentication...</p>
            </div>
          </div>
        }
      />
      <Route
        element={
          currentUser ? <ProtectedLayout /> : <Navigate to="/login" replace />
        }
      >
        {/* User Routes - chỉ hiển thị cho non-admin users */}
        {currentUser?.role !== "admin" && (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pending" element={<PendingPage />} />
            <Route path="/complete" element={<CompletePage />} />
          </>
        )}
        {/* Profile - chỉ cho user thường */}
        {currentUser?.role !== "admin" && (
          <Route
            path="/profile"
            element={
              <Profile
                user={currentUser}
                setCurrentUser={setCurrentUser}
                onLogout={handleLogout}
              />
            }
          />
        )}
        {/* Admin Routes - chỉ hiển thị cho admin */}
        {currentUser?.role === "admin" && (
          <>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/tasks" element={<AdminTasks />} />
            <Route
              path="/admin/profile"
              element={
                <Profile
                  user={currentUser}
                  setCurrentUser={setCurrentUser}
                  onLogout={handleLogout}
                />
              }
            />
            {/* Redirect admin từ các route user sang /admin */}
            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route path="/pending" element={<Navigate to="/admin" replace />} />
            <Route
              path="/complete"
              element={<Navigate to="/admin" replace />}
            />
            <Route
              path="/profile"
              element={<Navigate to="/admin/profile" replace />}
            />
          </>
        )}
      </Route>
      <Route
        path="*"
        element={<Navigate to={currentUser ? "/" : "/login"} replace />}
      />
    </Routes>
  );
};

export default App;
