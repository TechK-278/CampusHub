/**
 * CampusHub — Secure Portal Sign-In Page
 * Practical 9: Role-Based Authentication & JWT Sign-In
 */

import React, { useState } from "react";
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Loader2, 
  GraduationCap, 
  BookOpen, 
  KeyRound,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

const DEMO_CREDENTIALS = [
  {
    role: "student",
    label: "Student Account",
    username: "aarav.mehta",
    password: "Student@123",
    description: "Access academic timetable, courses, attendance, results & tasks",
    badgeColor: "bg-blue-100 text-blue-800"
  },
  {
    role: "faculty",
    label: "Faculty Account",
    username: "prof.nair",
    password: "Faculty@123",
    description: "Manage students registry, grades, admissions & course curriculum",
    badgeColor: "bg-emerald-100 text-emerald-800"
  },
  {
    role: "admin",
    label: "Admin Account",
    username: "admin.campus",
    password: "Admin@123",
    description: "Full system administration, user management & database access",
    badgeColor: "bg-purple-100 text-purple-800"
  }
];

export function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const showDemoAccounts = import.meta.env.DEV || import.meta.env.VITE_SHOW_DEMO_ACCOUNTS === "true" || true;

  const validate = () => {
    const errors = {};
    if (!username.trim()) {
      errors.username = "Username is required.";
    }
    if (!password) {
      errors.password = "Password is required.";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validate()) return;

    setSubmitting(true);
    try {
      await login(username.trim(), password);
    } catch (err) {
      setErrorMessage(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemo = (demo) => {
    setUsername(demo.username);
    setPassword(demo.password);
    setValidationErrors({});
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen w-full bg-slate-100/80 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 select-none">
      <div className="max-w-md w-full space-y-5">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-2.5 rounded-xl bg-white shadow-2xs border border-slate-200">
            <img
              src="/logo.png"
              alt="CampusHub Logo"
              className="h-10 w-10 rounded-lg object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">CampusHub</h1>
            <p className="text-xs font-medium text-slate-500 mt-0.5">College Academic Management Portal</p>
          </div>
        </div>

        {/* Sign In Card */}
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lock className="h-4 w-4 text-blue-600" />
              Sign In to Your Account
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Enter your university credentials to access authorized portal services.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {errorMessage && (
              <div 
                className="rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 flex items-start gap-2.5"
                role="alert"
              >
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold block">Authentication Error</span>
                  <span className="text-[11px] text-rose-700">{errorMessage}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
              <div className="space-y-1 text-left">
                <label 
                  htmlFor="login-username" 
                  className="block text-xs font-semibold text-slate-700"
                >
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  <Input
                    id="login-username"
                    type="text"
                    autoComplete="username"
                    placeholder="e.g. aarav.mehta"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (validationErrors.username) {
                        setValidationErrors((prev) => ({ ...prev, username: null }));
                      }
                    }}
                    className={`pl-9 text-xs h-9 ${
                      validationErrors.username ? "border-rose-400 focus:ring-rose-500" : ""
                    }`}
                    disabled={submitting}
                  />
                </div>
                {validationErrors.username && (
                  <p className="text-[11px] text-rose-600 font-medium mt-0.5">{validationErrors.username}</p>
                )}
              </div>

              <div className="space-y-1 text-left">
                <div className="flex items-center justify-between">
                  <label 
                    htmlFor="login-password" 
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (validationErrors.password) {
                        setValidationErrors((prev) => ({ ...prev, password: null }));
                      }
                    }}
                    className={`pl-9 pr-9 text-xs h-9 ${
                      validationErrors.password ? "border-rose-400 focus:ring-rose-500" : ""
                    }`}
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-[11px] text-rose-600 font-medium mt-0.5">{validationErrors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 font-semibold transition-colors mt-2"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                    Authenticating Session...
                  </>
                ) : (
                  <>
                    <KeyRound className="h-4 w-4 mr-1.5" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Fictional Demo Accounts Quick Selector */}
        {showDemoAccounts && (
          <Card className="border-slate-200 bg-white shadow-2xs">
            <CardHeader className="py-3 px-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                  Demo Accounts (Fictional)
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Click to auto-fill</span>
              </div>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              {DEMO_CREDENTIALS.map((demo) => (
                <button
                  key={demo.role}
                  type="button"
                  onClick={() => handleFillDemo(demo)}
                  className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all text-xs group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-900 group-hover:text-blue-700 flex items-center gap-1.5">
                      {demo.label}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold uppercase ${demo.badgeColor}`}>
                      {demo.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    User: <strong className="text-slate-700">{demo.username}</strong> | Pass: <strong className="text-slate-700">{demo.password}</strong>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 leading-tight">{demo.description}</p>
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Security Notice Footer */}
        <div className="text-center text-[11px] text-slate-400 space-y-1">
          <p>Protected by Stateless JSON Web Token (JWT) Authorization & BCrypt Hashing.</p>
          <p>© 2025–2026 CampusHub Academic Information Network</p>
        </div>
      </div>
    </div>
  );
}
