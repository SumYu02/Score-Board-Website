import { z } from "zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input, Label, Navbar } from "../components";
import { Eye, EyeOff } from "lucide-react";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";

const formSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username is required")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username must not contain symbols (only letters, numbers, and underscores allowed)"
      ),
    email: z.string().email("Invalid email address"),
    password: z.string().min(7, "Password must be at least 7 characters"),
    confirmPassword: z
      .string()
      .min(7, "Password must be at least 7 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

export function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      navigate("/");
    },
    onError: (error: any) => {
      console.error("Registration error:", error);
      // Error will be handled by the form
    },
  });

  const onSubmit = (data: FormData) => {
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-64px)] bg-background flex flex-col items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Enter your email below to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <Controller
                  control={control}
                  name="username"
                  render={({ field }) => (
                    <div className="grid gap-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="johndoe"
                        {...field}
                      />
                      {errors.username && (
                        <p className="text-sm text-destructive">
                          {errors.username.message}
                        </p>
                      )}
                    </div>
                  )}
                />
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
                        <p className="text-sm text-destructive">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  )}
                />
                <Controller
                  control={control}
                  name="password"
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
                        placeholder="Password"
                        {...field}
                      />
                      {errors.password && (
                        <p className="text-sm text-destructive">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                  )}
                />
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="confirmPassword">
                          Confirm Password
                        </Label>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={toggleConfirmPassword}
                          type="button"
                        >
                          {showConfirmPassword ? <Eye /> : <EyeOff />}
                        </Button>
                      </div>
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        {...field}
                      />
                      {errors.confirmPassword && (
                        <p className="text-sm text-destructive">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  )}
                />
                {registerMutation.isError && (
                  <p className="text-sm text-destructive">
                    {registerMutation.error?.response?.data?.error ||
                      "Registration failed. Please try again."}
                  </p>
                )}
              </div>
              <CardFooter className="flex-col gap-2 px-0 pt-6">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending
                    ? "Creating account..."
                    : "Create account"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
