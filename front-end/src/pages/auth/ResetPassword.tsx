import React, { useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("No token provided");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:7777/auth/auth/reset-password?token=${token}`,
        {
          newPassword,
        }
      );

      const { data } = response;
      if (response.status !== 200) {
        throw new Error(data.message || "Failed to reset password");
      }

      setMessage(data.message);
      setTimeout(() => (window.location.href = "/login"), 1000);
    } catch (err) {
      console.log(err)
      console.log(error)
    }
  };

  return (
    <div className="h-screen w-full auth-bg flex justify-center items-center">
      <div className="h-auto w-[95%] md:w-[70%] lg:w-[42%] flex flex-col items-center">
        <h3 className="text-[36px] font-semibold mt-8 text-center">
          Reset Password
        </h3>
        <p className="text-darkGray2 mt-1 text-center">
          Enter your new password below
        </p>
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mt-10 w-[80%]"
            role="alert"
          >
            <span className="block sm:inline text-sm">{error}</span>
          </div>
        )}
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
          className={`${error || message ? "mt-2" : "mt-10"} w-[80%]`}
        >
          <div>
            <p className="ml-2">New Password</p>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="px-4 py-3 mt-1 rounded-md shadow-sm border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="py-3 w-full rounded-md bg-[#2E86FB] text-white cursor-pointer font-semibold mt-6 hover:opacity-[0.8] transition-[0.3s]"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
