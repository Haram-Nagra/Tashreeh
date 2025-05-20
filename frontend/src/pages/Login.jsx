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

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((state) => state.login);
  const setUser = useAuthStore((state) => state.setUser);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors on type
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validate email
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setErrors((prev) => ({ ...prev, email: emailError }));
      setLoading(false);
      return;
    }

    try {
      if (!formData.email || !formData.password) {
        throw new Error("Please fill in all fields");
      }

      // Simulate backend check for user existence
      const userExists = await checkUserExists(formData.email);
      if (!userExists) {
        setErrors((prev) => ({
          ...prev,
          email: "No account found with this email",
        }));
        throw new Error("No account found with this email");
      }

      // Perform login
      await login(formData.email.trim().toLowerCase(), formData.password);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      if (error.message.includes("password")) {
        setErrors((prev) => ({
          ...prev,
          password: "Incorrect password",
        }));
      }
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Simulate user existence check (replace with actual API call)
  const checkUserExists = async (email) => {
    // Replace with actual API call to check if the user exists
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true); // Simulate user exists
      }, 500);
    });
  };

  // Google login handler
  const handleGoogleLogin = () => {
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
            id: user._id,
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
    <div className="min-h-screen relative overflow-hidden font-roboto">
      {/* Animated SVGs */}
      <motion.div
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 0.7 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute -left-52 top-0 w-1/3"
      >
        <motion.svg
          animate={{
            rotate: [0, 10, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          width="100%"
          height="100%"
          viewBox="0 0 500 500"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M144.95 71.7439C120.397 85.9193 106.156 111.096 104.857 137.452C79.7347 145.528 59.1022 165.801 51.7645 193.185C44.4269 220.569 52.159 248.442 69.8774 267.998C57.8239 291.473 57.5692 320.396 71.7443 344.95C85.9201 369.501 111.096 383.743 137.453 385.043C145.529 410.165 165.801 430.797 193.186 438.134C220.57 445.472 248.443 437.74 267.999 420.022C291.473 432.075 320.397 432.329 344.95 418.155C369.502 403.978 383.743 378.803 385.043 352.447C410.165 344.37 430.797 324.097 438.135 296.713C445.473 269.328 437.741 241.456 420.023 221.9C432.075 198.425 432.33 169.502 418.155 144.949C403.979 120.396 378.803 106.155 352.447 104.857C344.37 79.734 324.097 59.1013 296.713 51.7638C269.329 44.4261 241.456 52.1582 221.901 69.8767C198.426 57.8233 169.502 57.5685 144.95 71.7439Z"
            fill="#119da4"
            className="filter blur-[0.5px]"
          />
        </motion.svg>
      </motion.div>

      <motion.div
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 0.9 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute -right-0 bottom-0 w-1/3"
      >
        <motion.svg
          animate={{
            rotate: [0, -5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          width="100%"
          height="100%"
          viewBox="-300 0 500 500"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M170.35 62.1166L93.0755 41.411L66.3055 141.318L14.5898 51.7439L-54.6923 91.7438L-2.97645 181.318L-102.884 154.548L-123.589 231.822L-23.6822 258.592L-113.256 310.307L-73.2564 379.59L16.318 327.874L-10.4521 427.781L66.8219 448.487L93.5921 348.579L145.308 438.155L214.59 398.155L162.873 308.58L262.781 335.35L283.487 258.076L183.579 231.306L273.154 179.59L233.155 110.308L143.58 162.024L170.35 62.1166Z"
            fill="#4B9CD3"
            className="filter blur-[0.5px]"
          />
        </motion.svg>
      </motion.div>

      {/* Login Form */}
      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20"
        >
          {/* Form Container with Fixed Height */}
          <div className="p-8 space-y-4">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold bg-black bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-gray-600 mt-2">to continue to your account</p>
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              className="w-full border border-gray-200 p-3 rounded-xl flex items-center justify-center gap-2 \
                hover:bg-gray-50 transition-all duration-300"
            >
              <FcGoogle size={20} />
              <span className="text-gray-700">Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-gray-500">
                  Or login with email
                </span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Field - Fixed Height Container */}
              <div className="h-[75px]">
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <HiOutlineMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-3 border ${
                      errors.email ? "border-red-500" : "border-gray-200"
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500`}
                    placeholder="Email address"
                  />
                </div>
                <div className="min-h-[20px] mt-1">
                  {errors.email && (
                    <p className="text-red-500 text-xs">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Password Field - Fixed Height Container */}
              <div className="h-[75px]">
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <HiOutlineLockClosed className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-10 py-3 border ${
                      errors.password ? "border-red-500" : "border-gray-200"
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500`}
                    placeholder="Password"
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
                <div className="min-h-[20px] mt-1">
                  {errors.password && (
                    <p className="text-red-500 text-xs">{errors.password}</p>
                  )}
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-xl
                  hover:from-blue-700 hover:to-blue-800 transition-all duration-300 mt-6"
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
                    <span>Logging in...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <span className="text-gray-600">Don't have an account? </span>
              <Link
                to="/create-account"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign up
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
