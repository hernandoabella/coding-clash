"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginRegisterPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ username: "", email: "", password: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await fetch(`http://localhost:9000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        return alert(data.error || "Something went wrong");
      }

      if (data.token) localStorage.setItem("token", data.token);

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Server not reachable");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f14] text-gray-200 px-6">
      <div className="w-full max-w-md bg-[#111827] p-8 rounded-xl shadow-xl border border-gray-800">
        <div className="flex mb-8 border-b border-gray-700">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 ${mode === "login" ? "text-cyan-400 border-b-2 border-cyan-400" : "text-gray-500"}`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2 ${mode === "register" ? "text-cyan-400 border-b-2 border-cyan-400" : "text-gray-500"}`}
          >
            Register
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {mode === "register" && (
            <div>
              <label>Username</label>
              <input name="username" onChange={handleChange} className="w-full p-2 bg-black border border-gray-700 rounded" required />
            </div>
          )}

          <div>
            <label>Email</label>
            <input name="email" type="email" onChange={handleChange} className="w-full p-2 bg-black border border-gray-700 rounded" required />
          </div>

          <div>
            <label>Password</label>
            <input name="password" type="password" onChange={handleChange} className="w-full p-2 bg-black border border-gray-700 rounded" required />
          </div>

          <button disabled={loading} className="w-full bg-cyan-500 text-black py-2 rounded font-bold hover:bg-cyan-400 transition">
            {loading ? "Processing..." : mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
