import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    organization: "",
  });
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success("Welcome back!");
      } else {
        await register(formData);
        toast.success("Account created successfully!");
      }
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] sm:min-h-[80vh] px-3 sm:px-4 py-6 sm:py-8">
      <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-800 mb-2">
          {isLogin ? "Organizer Login" : "Create Account"}
        </h2>
        <p className="text-slate-500 text-center mb-6 sm:mb-8 text-sm sm:text-base">
          {isLogin
            ? "Manage your event participants"
            : "Start managing your events with QR codes"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  className="input-field text-sm h-10 sm:h-auto"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                  Organization
                </label>
                <input
                  type="text"
                  className="input-field text-sm h-10 sm:h-auto"
                  placeholder="Tech Events Inc."
                  value={formData.organization}
                  onChange={(e) =>
                    setFormData({ ...formData, organization: e.target.value })
                  }
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              className="input-field text-sm h-10 sm:h-auto"
              placeholder="organizer@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className="input-field text-sm h-10 sm:h-auto"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary mt-6 sm:mt-8 flex items-center justify-center h-11 sm:h-auto sm:py-2.5 text-sm sm:text-base"
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 sm:mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 hover:text-indigo-800 text-xs sm:text-sm font-medium"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
