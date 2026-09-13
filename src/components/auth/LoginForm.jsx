"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Form,
  Button,
  Input,
  Label,
  FieldError,
  TextField,
} from "@heroui/react";
import toast from "react-hot-toast";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";

export default function LoginForm() {
  const router = useRouter();

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const redirectByRole = (role) => {
    if (role === "lawyer") return router.push("/dashboard/lawyer");
    if (role === "admin") return router.push("/dashboard/admin");
    return router.push("/");
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());
    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: user.email,
        password: user.password,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password");
        return;
      }

      if (data) {
        toast.success("Welcome back!");
        redirectByRole(data.user?.role);
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/redirect",
      });
    } catch (err) {
      toast.error(err.message || "Google sign-in failed");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-5 py-12 overflow-hidden bg-background">
      {/* Decorative glow */}
      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-secondary/5 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl shadow-primary/5">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-3">
              <h1 className="text-2xl font-bold tracking-tight font-heading">
                <span className="text-primary">Legal</span>
                <span className="text-secondary">Ease</span>
              </h1>
            </Link>
            <h2 className="text-2xl font-bold text-foreground font-heading">
              Welcome Back
            </h2>
            <p className="text-sm text-secondary-text mt-1.5 font-sans">
              Sign in to continue to your account
            </p>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-secondary" />
          </div>

          {/* Form */}
          <Form className="space-y-4" onSubmit={onSubmit}>
            {/* Email */}
            <TextField
              isRequired
              name="email"
              validate={(value) => {
                if (!value) return "Email is required";
                if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
                ) {
                  return "Please enter a valid email address";
                }
                return null;
              }}
            >
              <Label className="text-sm font-medium text-foreground">
                Email
              </Label>
              <Input
                name="email"
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-transparent text-foreground placeholder:text-secondary-text/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              />
              <FieldError className="text-xs text-error mt-1" />
            </TextField>

            {/* Password */}
            <TextField
              isRequired
              name="password"
              type={isShowPassword ? "text" : "password"}
              validate={(value) => {
                if (!value) return "Password is required";
                return null;
              }}
            >
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-secondary-text hover:text-primary transition font-sans"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  name="password"
                  type={isShowPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-transparent text-foreground placeholder:text-secondary-text/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition pr-12"
                />
                <button
                  type="button"
                  onClick={() => setIsShowPassword(!isShowPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-text hover:text-foreground transition"
                  aria-label="Toggle password visibility"
                >
                  {isShowPassword ? (
                    <IoEyeOffOutline size={20} />
                  ) : (
                    <IoEyeOutline size={20} />
                  )}
                </button>
              </div>
              <FieldError className="text-xs text-error mt-1" />
            </TextField>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-white font-heading font-semibold py-2.5 rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </Form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-secondary-text font-sans">
                OR
              </span>
            </div>
          </div>

          {/* Google */}
          <Button
            type="button"
            disabled={googleLoading}
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 border border-border bg-transparent hover:bg-background text-foreground font-sans font-medium py-2.5 rounded-xl transition disabled:opacity-50"
          >
            <FcGoogle size={20} />
            {googleLoading ? "Connecting..." : "Continue with Google"}
          </Button>

          {/* Register link */}
          <p className="text-center text-sm text-secondary-text mt-6 font-sans">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-primary hover:underline font-semibold transition"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}