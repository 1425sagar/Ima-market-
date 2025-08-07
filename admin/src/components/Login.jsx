import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

const Login = ({ setToken, setAdminId }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false); // Toggle for Login/Signup

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isSignup
        ? `${backendUrl}/api/admin/create` // Signup endpoint
        : `${backendUrl}/api/user/admin`; // Login endpoint

      const response = await axios.post(endpoint, {
        email,
        password,
      });

      if (response.data.success) {
        if (isSignup) {
          toast.success("Admin account created successfully!");
        } else {
          setToken(response.data.token);
          setAdminId(response.data.adminId);
          toast.success("Login successful!");
        }
        setEmail("");
        setPassword("");
      } else {
        toast.error(response.data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md">
        <h1 className="text-2xl font-bold mb-4">
          {isSignup ? "Admin Signup" : "Admin Login"}
        </h1>
        <form onSubmit={onSubmitHandler}>
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Email Address
            </p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
              type="email"
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
              type="password"
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>
          <button
            className="mt-2 w-full py-2 px-4 rounded-md text-white bg-black"
            type="submit"
            disabled={loading}
          >
            {loading
              ? isSignup
                ? "Signing up..."
                : "Logging in..."
              : isSignup
              ? "Sign Up"
              : "Login"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <span
              className="text-blue-600 cursor-pointer underline"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? "Login" : "Sign Up"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
