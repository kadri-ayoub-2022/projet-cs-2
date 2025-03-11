import React, { useState } from "react";
import {  useNavigate } from "react-router";
// import axios from "axios";
import { useAuth } from "../../contexts/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      await signIn(email, password);
      navigate("/admin"); 
    } catch (err) {
      console.error("Login error:", err);
      setError( "Login failed. Please try again.");
    }
  };

  return (
    <div className="h-screen w-full auth-bg flex justify-center items-center">
      <div className="h-auto w-[95%] md:w-[70%] lg:w-[42%] flex flex-col items-center mt-[-100px]">
        {/* logo image */}
        <img src="/src/assets/logo.png" alt="logo" width="120px" />
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mt-10 w-[80%]"
            role="alert"
          >
            <span className="block sm:inline text-sm">{error}</span>
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className={`${error ? "mt-2" : "mt-8"} w-[80%]`}
        >
          <div>
            <p className="font-medium text-sm">Email</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="px-4 py-3 mt-1 rounded-md shadow-sm border-2 border-[#2E86FB] focus:outline-none  w-full"
              required
            />
          </div>
          <div className="mt-8">
            <p className="font-medium text-sm">Password</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 mt-1 rounded-md shadow-sm border-2 border-[#2E86FB] focus:outline-none  w-full"
              placeholder="Your password"
              required
            />
          </div>
          <p
            onClick={() => (window.location.href = "/forgot-password")}
            className="mt-4 text-[#2E86FB] font-semibold cursor-pointer text-sm ml-1"
          >
            Forgot password
          </p>
          <button
            type="submit"
            className="py-3 w-full rounded-md  bg-[#2E86FB] text-white font-semibold mt-6 hover:opacity-[0.8] transition-[0.3s]"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
