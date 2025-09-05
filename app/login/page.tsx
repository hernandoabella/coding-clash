"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!res?.error) {
      router.push("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }), // ✅ send username too
    });

    if (res.ok) {
      alert("Account created! Please log in.");
      setIsRegister(false);
    } else {
      const data = await res.json();
      alert(data.error || "Registration failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl mb-4">{isRegister ? "Register" : "Login"}</h2>

      <form
        onSubmit={isRegister ? handleRegister : handleLogin}
        className="flex flex-col"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        {isRegister && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 w-full mb-2"
          />
        )}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {isRegister ? "Register" : "Login"}
        </button>
      </form>

      <p className="mt-4 text-sm text-center">
        {isRegister ? "Already have an account?" : "Don’t have an account?"}{" "}
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="text-blue-500 underline"
        >
          {isRegister ? "Login" : "Register"}
        </button>
      </p>
    </div>
  );
}
