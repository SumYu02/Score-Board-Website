import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input, Label, Navbar } from "../components";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(7, "Password must be at least 7 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success("Login successful!");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error || "Login failed. Please try again."
      );
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-64px)] bg-background flex flex-col items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
            <CardAction>
              <Button variant="link" onClick={() => navigate("/register")}>
                Sign Up
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        {...field}
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  )}
                />
                <Controller
                  control={control}
                  name="password"
                  rules={{
                    required: {
                      value: true,
                      message: "Password is required",
                    },
                  }}
                  render={({ field }) => (
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={togglePassword}
                          type="button"
                        >
                          {showPassword ? <Eye /> : <EyeOff />}
                        </Button>
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                      {errors.password && (
                        <p className="text-xs text-destructive">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
              <CardFooter className="flex-col gap-2 px-0 pt-6">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Logging in..." : "Login"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
