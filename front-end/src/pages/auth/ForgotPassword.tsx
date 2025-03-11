import React, { useState } from "react";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa6";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:7777/auth/auth/forgot-password",
        {
          email,
        }
      );

      const { data } = response;
      if (response.status !== 200) {
        throw new Error(data.message || "Failed to send reset email");
      }

      setMessage(data.message);
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <div className="h-screen w-full auth-bg flex justify-center items-center">
      <div className="h-auto w-[95%] md:w-[70%] lg:w-[42%] flex flex-col items-center">
        <h3 className="text-[36px] font-semibold mt-8 text-center">
          Forgot password?
        </h3>
        <p className="text-gray-500 mt-1 text-center">
          No worries! Just enter your email address and we'll help you reset it
        </p>
        
        {message && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded relative mt-10 w-[80%]"
            role="alert"
          >
            <span className="block sm:inline text-sm">{message}</span>
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className={`${message ? "mt-2" : "mt-10"} w-[80%]`}
        >
          <div>
            <p className="ml-2">Email</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="px-4 py-3 mt-1 rounded-md shadow-sm border-2 border-[#2E86FB] focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="py-3 w-full  rounded-md bg-[#2E86FB] text-white font-semibold mt-6 hover:opacity-[0.8] transition-[0.3s]"
          >
            Reset password
          </button>
        </form>
        <button
          onClick={() => (window.location.href = "/login")}
          className="flex items-center gap-2 text-gray-500 font-medium cursor-pointer mt-8"
        >
          <FaArrowLeft className="mt-1" /> <p>back to login</p>
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
