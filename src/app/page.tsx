"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button, Input } from "@/components/ui";

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isAdmin } = useAuth();
  const router = useRouter();

  if (isAdmin) {
    router.replace("/admin/dashboard");
    return null;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    const success = login(username.trim(), password);
    if (success) {
      router.push("/admin/dashboard");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gray-950" />
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/10 blur-[120px]" />
      <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[100px]" />
      <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-blue-600/10 blur-[80px]" />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Brand */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 text-2xl font-bold shadow-lg shadow-brand-600/25">
            BB
          </div>
          <h1 className="text-3xl font-bold tracking-tight">BuildingBlox</h1>
          <p className="mt-2 text-gray-400">Roblox Game Development Studio</p>
        </div>

        {!showLogin ? (
          <div className="space-y-4">
            <Button fullWidth onClick={() => setShowLogin(true)}>
              Log in as Admin
            </Button>
            <Button fullWidth variant="secondary" onClick={() => router.push("/home")}>
              Continue as Guest
            </Button>
            <p className="text-center text-xs text-gray-500">
              Guests can browse our portfolio and company info.
              <br />
              Admin login required for dashboard access.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6 backdrop-blur-sm">
            <h2 className="mb-6 text-lg font-semibold">Admin Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                id="username"
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
              />
              <Input
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
              />
              {error && <p className="text-sm text-red-400">{error}</p>}
              <Button type="submit" fullWidth>
                Sign In
              </Button>
              <button
                type="button"
                onClick={() => { setShowLogin(false); setError(""); }}
                className="w-full text-center text-sm text-gray-400 transition-colors hover:text-white"
              >
                Back to options
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
