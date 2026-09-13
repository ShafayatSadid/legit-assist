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
  Description,
  TextField,
} from "@heroui/react";
import toast from "react-hot-toast";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";

export default function RegisterForm() {
  const router = useRouter();

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());
    setLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        name: user.name,
        email: user.email,
        password: user.password,
        image: user.photoURL || undefined,
      });

      if (error) {
        toast.error(error.message || "Registration failed");
        return;
      }

      if (data) {
        toast.success("Account created successfully!");
        router.push("/select-role");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/select-role",
      });
    } catch (err) {
      toast.error(err.message || "Google sign-up failed");
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
              Create Your Account
            </h2>
            <p className="text-sm text-secondary-text mt-1.5 font-sans">
              Join LegalEase and connect with expert lawyers
            </p>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-secondary" />
          </div>

          {/* Form */}
          <Form className="space-y-4" onSubmit={onSubmit}>
            {/* Full Name */}
            <TextField
              isRequired
              name="name"
              validate={(value) => {
                if (!value || value.trim().length === 0)
                  return "Full name is required";
                if (value.trim().length < 2)
                  return "Name must be at least 2 characters";
                return null;
              }}
            >
              <Label className="text-sm font-medium text-foreground">
                Full Name
              </Label>
              <Input
                name="name"
                placeholder="John Doe"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-transparent text-foreground placeholder:text-secondary-text/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              />
              <FieldError className="text-xs text-error mt-1" />
            </TextField>

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

            {/* Photo URL (optional) */}
            <TextField name="photoURL">
              <Label className="text-sm font-medium text-foreground">
                Photo URL{" "}
                <span className="text-secondary-text font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                name="photoURL"
                type="url"
                placeholder="https://example.com/photo.jpg"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-transparent text-foreground placeholder:text-secondary-text/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              />
            </TextField>

            {/* Password */}
            <TextField
              isRequired
              name="password"
              type={isShowPassword ? "text" : "password"}
              validate={(value) => {
                if (!value) return "Password is required";
                if (value.length < 6)
                  return "Password must be at least 6 characters";
                if (!/[A-Z]/.test(value))
                  return "Must contain at least 1 uppercase letter";
                if (!/[a-z]/.test(value))
                  return "Must contain at least 1 lowercase letter";
                return null;
              }}
            >
              <Label className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  name="password"
                  type={isShowPassword ? "text" : "password"}
                  placeholder="••••••••"
                  onChange={(e) => setPasswordValue(e.target.value)}
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
              <Description className="text-xs text-secondary-text mt-1">
                Min 6 characters, 1 uppercase, 1 lowercase
              </Description>
              <FieldError className="text-xs text-error mt-1" />
            </TextField>

            {/* Confirm Password */}
            <TextField
              isRequired
              name="confirmPassword"
              type={isShowConfirmPassword ? "text" : "password"}
              validate={(value) => {
                if (!value) return "Please confirm your password";
                if (value !== passwordValue) return "Passwords do not match";
                return null;
              }}
            >
              <Label className="text-sm font-medium text-foreground">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  name="confirmPassword"
                  type={isShowConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-transparent text-foreground placeholder:text-secondary-text/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition pr-12"
                />
                <button
                  type="button"
                  onClick={() =>
                    setIsShowConfirmPassword(!isShowConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-text hover:text-foreground transition"
                  aria-label="Toggle confirm password visibility"
                >
                  {isShowConfirmPassword ? (
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
              {loading ? "Creating account..." : "Create Account"}
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
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center gap-2 border border-border bg-transparent hover:bg-background text-foreground font-sans font-medium py-2.5 rounded-xl transition disabled:opacity-50"
          >
            <FcGoogle size={20} />
            {googleLoading ? "Connecting..." : "Continue with Google"}
          </Button>

          {/* Login link */}
          <p className="text-center text-sm text-secondary-text mt-6 font-sans">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-semibold transition"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}