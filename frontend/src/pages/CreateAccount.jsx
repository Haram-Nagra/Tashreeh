import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineLockClosed,
  HiOutlineMail,
} from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API_ENDPOINTS from "../config/api";
import useAuthStore from "../store/authStore";

function CreateAccount() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const register = useAuthStore((state) => state.register); // Access register function from Zustand store
  //const setUser = useAuthStore((state) => state.setUser); // Access setUser function
  const navigate = useNavigate();

  const validateEmail = (email) => {
    if (!email) return "Email is required";

    // RFC 5322 compliant regex
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!emailRegex.test(email.trim())) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";

    // Length check (8-128 characters)
    if (password.length < 8 || password.length > 128) {
      return "Password must be between 8 and 128 characters";
    }

    // Uppercase check
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }

    // Lowercase check
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }

    // Number check
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }

    // Special character check
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return "Password must contain at least one special character (!@#$%^&* etc.)";
    }

    // Check for common passwords
    const commonPasswords = [
      "password123",
      "12345678",
      "qwerty123",
      "admin123",
      "welcome1",
    ];

    if (commonPasswords.includes(password.toLowerCase())) {
      return "This password is too common. Please choose a stronger password";
    }

    // Check for repeating characters
    if (/(.)\1{2,}/.test(password)) {
      return "Password cannot contain repeating characters";
    }

    return "";
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validate inputs
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
      });
      setLoading(false);
      return;
    }

    try {
      const userData = await register(email.trim().toLowerCase(), password);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      if (error.message.includes("already exists")) {
        setErrors({ email: "An account with this email already exists" });
      } else {
        toast.error(error.message || "Registration failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  // Google signup handler
  const handleGoogleSignup = () => {
    window.location.href = API_ENDPOINTS.AUTH.GOOGLE;
  };

  // On mount, check for token in URL (after Google OAuth)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      // Fetch full user profile from backend
      fetch(API_ENDPOINTS.AUTH.ME, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch user profile");
          return res.json();
        })
        .then((user) => {
          useAuthStore.getState().setUser({
            ...user,
            id: user._id, // for compatibility
          });
          navigate("/dashboard");
        })
        .catch((err) => {
          // fallback: decode token minimally
          const decoded = jwtDecode(token);
          useAuthStore.getState().setUser({
            id: decoded.id,
            _id: decoded.id,
            email: decoded.email,
          });
          navigate("/dashboard");
        });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-1/2 flex items-center justify-center"
      >
        <div className="max-w-md w-full space-y-8 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-center bg-black bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-center text-gray-600 mt-2">
              to continue to your journey
            </p>
          </motion.div>

          <div className="mt-8 space-y-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 \
                rounded-xl shadow-sm bg-white hover:bg-gray-50 transition-all duration-300"
            >
              <FcGoogle size={24} />
              <span className="text-gray-700 font-medium">
                Continue with Google
              </span>
            </motion.button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  or continue with email
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors((prev) => ({ ...prev, email: "" }));
                      }
                    }}
                    placeholder="name@gmail.com"
                    className={`pl-10 w-full px-4 py-3 border ${
                      errors.email ? "border-red-500" : "border-gray-200"
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 
                      transition-all duration-300 placeholder-gray-400 hover:border-blue-300`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) {
                        setErrors((prev) => ({ ...prev, password: "" }));
                      }
                    }}
                    placeholder="********"
                    className={`pl-10 pr-10 w-full px-4 py-3 border ${
                      errors.password ? "border-red-500" : "border-gray-200"
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 
                      transition-all duration-300 placeholder-gray-400 hover:border-blue-300`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <HiOutlineEyeOff className="h-5 w-5" />
                    ) : (
                      <HiOutlineEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </motion.div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRegister}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-white bg-blue-600 hover:bg-blue-700 
                transition-all duration-300 shadow-md hover:shadow-lg font-medium"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center space-y-4"
            >
              <p className="text-gray-600">
                Already have a Tashreeh Account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign In
                </Link>
              </p>

              <p className="text-xs text-gray-500">
                By using Tashreeh you agree to the{" "}
                <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-blue-600 hover:text-blue-500"
                >
                  Privacy Policy
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Right Panel - Animated Decorative Elements */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-1/2 relative overflow-hidden"
      >
        {/* Floating Elements */}
        {[
          {
            color: "bg-blue-500/40",
            size: "w-32 h-32",
            initial: { x: -200, y: 0 },
            animate: {
              x: [200, -200, 200],
              y: [-200, 200, -200],
              rotate: [0, 180, 360],
            },
            duration: 20,
            delay: 0,
          },
          {
            color: "bg-purple-500/40",
            size: "w-24 h-24",
            initial: { x: 200, y: 200 },
            animate: {
              x: [-200, 200, -200],
              y: [200, -200, 200],
              rotate: [360, 180, 0],
            },
            duration: 25,
            delay: 2,
          },
          {
            color: "bg-cyan-500/40",
            size: "w-40 h-40",
            initial: { x: 0, y: -200 },
            animate: {
              x: [200, -200, 200],
              y: [200, -200, 200],
              rotate: [0, 360, 0],
            },
            duration: 30,
            delay: 1,
          },
          {
            color: "bg-rose-500/40",
            size: "w-28 h-28",
            initial: { x: -150, y: 150 },
            animate: {
              x: [150, -150, 150],
              y: [-150, 150, -150],
              rotate: [180, 360, 180],
            },
            duration: 22,
            delay: 3,
          },
          {
            color: "bg-emerald-500/40",
            size: "w-36 h-36",
            initial: { x: 150, y: -150 },
            animate: {
              x: [-250, 250, -250],
              y: [250, -250, 250],
              rotate: [0, -360, 0],
            },
            duration: 28,
            delay: 1.5,
          },
          {
            color: "bg-yellow-500/40",
            size: "w-20 h-20",
            initial: { x: -175, y: 175 },
            animate: {
              x: [175, -175, 175],
              y: [-175, 175, -175],
              rotate: [-180, -360, -180],
            },
            duration: 18,
            delay: 2.5,
          },
          {
            color: "bg-indigo-500/40",
            size: "w-44 h-44",
            initial: { x: 125, y: -125 },
            animate: {
              x: [-300, 300, -300],
              y: [-300, 300, -300],
              rotate: [90, 450, 90],
            },
            duration: 35,
            delay: 0.5,
          },
          {
            color: "bg-pink-500/40",
            size: "w-16 h-16",
            initial: { x: -125, y: 125 },
            animate: {
              x: [225, -225, 225],
              y: [-225, 225, -225],
              rotate: [270, -90, 270],
            },
            duration: 23,
            delay: 3.5,
          },
          {
            color: "bg-orange-500/40",
            size: "w-28 h-28",
            initial: { x: 0, y: 0 },
            animate: {
              x: [-175, 175, -175],
              y: [175, -175, 175],
              rotate: [45, 405, 45],
            },
            duration: 26,
            delay: 1.8,
          },
          {
            color: "bg-teal-500/40",
            size: "w-32 h-32",
            initial: { x: 200, y: 200 },
            animate: {
              x: [-200, 200, -200],
              y: [-200, 200, -200],
              rotate: [120, 480, 120],
            },
            duration: 32,
            delay: 2.2,
          },
          {
            color: "bg-blue-400/40",
            size: "w-24 h-24",
            initial: { x: -220, y: -220 },
            animate: {
              x: [220, -220, 220],
              y: [220, -220, 220],
              rotate: [-45, -405, -45],
            },
            duration: 28,
            delay: 1.2,
          },
          {
            color: "bg-violet-500/40",
            size: "w-20 h-20",
            initial: { x: 180, y: -180 },
            animate: {
              x: [-180, 180, -180],
              y: [180, -180, 180],
              rotate: [225, 585, 225],
            },
            duration: 24,
            delay: 2.8,
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={item.initial}
            animate={item.animate}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              ease: "linear",
              delay: item.delay,
            }}
            className={`absolute rounded-full ${item.color} ${item.size} 
              shadow-lg backdrop-blur-[1px] mix-blend-multiply`}
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}

        {/* Content Overlay */}
        <div className="relative h-full flex flex-col justify-center items-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-6 backdrop-blur-sm p-8 rounded-2xl"
          >
            <h1
              className="text-5xl font-serif bg-gradient-to-r from-blue-600 to-blue-800 
              bg-clip-text text-transparent"
            >
              Work. School. Life.
            </h1>
            <p className="text-5xl font-serif text-gray-800">
              Remember everything
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default CreateAccount;
