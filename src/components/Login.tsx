import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Check if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_PROD}/admin/checkAuth`, {
          method: "GET",
          credentials: "include", // sends cookie
        });
        const data = await res.json();
        console.log(data,"::::::::::::::::::::::::::::::");
        
        if (data.success) {
          navigate("/"); // redirect to home if already logged in
        }
      } catch (err) {
        // do nothing, user is not logged in
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${import.meta.env.VITE_PROD}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // store cookie
        body: JSON.stringify({ email, pwd: password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Login failed.");
        return;
      }

      toast.success("Login successful!");
      navigate("/"); // ✅ redirect to home page after login
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <Toaster />
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-6">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-600 text-white text-xl font-bold shadow-md">
            L
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="mt-1 text-gray-500 text-sm">Please login to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white font-semibold py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
