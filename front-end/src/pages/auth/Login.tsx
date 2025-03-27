import React, { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../contexts/useAuth";
import Input from "../../components/Input";
import Button from "../../components/Button";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      await signIn(email, password);
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="h-screen w-full auth-bg flex justify-center items-center p-4">
      <div className="h-auto w-full max-w-md flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
        <img src="/src/assets/logo.png" alt="logo" width="120px" className="mb-4" />
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative w-full" role="alert">
            <span className="block text-sm">{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="w-full mt-4 space-y-4">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" />
          <Link to="/forgot-password" className="text-[#2E86FB] font-semibold text-sm block text-right">
            Forgot password?
          </Link>
          <Button text="Sign in" onClick={() => {}} className="w-full py-3" />
        </form>
      </div>
    </div>
  );
};

export default Login;
