import React, { useState, useEffect } from "react";
import { LogIn, EyeOff, Eye, Mail, Lock } from "lucide-react";
import { INPUTWRAPPER, BUTTON_CLASSES } from "../assets/dummy";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const INITIAL_FORM = { email: "", password: "" };

const Login = ({ onSubmit, onSwitchMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (token) {
      (async () => {
        try {
          const { data } = await axios.get(
            "http://localhost:5000/api/user/me",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (data.success) {
            onSubmit?.({ token, userId, ...data.user });
            toast.success("Session restored. Redirecting...");
            navigate("/");
          } else {
            localStorage.clear();
          }
        } catch (error) {
          localStorage.clear();
        }
      })();
    }
  }, [navigate, onSubmit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/user/login",
        formData
      );
      if (!data.token) throw new Error(data.message || "Login failed!");
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      setFormData(INITIAL_FORM);
      onSubmit?.({ token: data.token, userId: data.user.id, ...data.user });
      toast.success("Login successful! Redirecting...");
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchMode = () => {
    toast.dismiss();
    onSwitchMode?.();
  };

  const fields = [
    { name: "email", type: "email", placeholder: "Email", icon: Mail },
    {
      name: "password",
      type: showPassword ? "text" : "password",
      placeholder: "Password",
      icon: Lock,
      isPassword: true,
    },
  ];

  return (
    <div className="max-w-md bg-white w-full shadow-lg border border-purple-100 rounded-xl p-8">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <div className="mb-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4">
          <LogIn className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Welcome Back!</h2>
        <p className="text-gray-500 text-sm mt-1">
          Login to your account to continue
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ name, type, placeholder, icon: Icon, isPassword }) => (
          <div key={name} className={INPUTWRAPPER}>
            <Icon className="w-5 h-5 text-purple-500 mr-2" />
            <input
              type={type}
              placeholder={placeholder}
              value={formData[name]}
              onChange={(e) =>
                setFormData({ ...formData, [name]: e.target.value })
              }
              className="w-full focus:outline-none text-sm text-gray-700"
              required
            />
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="ml-2 text-gray-500 hover:text-purple-500 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        ))}
        <button type="submit" disabled={loading} className={BUTTON_CLASSES}>
          {loading ? (
            "Logging in..."
          ) : (
            <>
              <LogIn className="w-4 h-4" /> Login
            </>
          )}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-6">
        Don't have an account?{" "}
        <button
          type="button"
          className="text-purple-600 hover:text-purple-700 hover:underline font-medium transition-colors"
          onClick={handleSwitchMode}
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default Login;
