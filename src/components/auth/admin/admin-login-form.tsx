import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminLoginSchema } from "@/schemas/auth/admin-schema";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { login } from "@/store/slices/auth-slice";
import InputPassword from "../../shared/password-validation";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axios-instance";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const AdminLoginForm = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof AdminLoginSchema>>({
    resolver: zodResolver(AdminLoginSchema),
  });

  const onSubmit = async (data: z.infer<typeof AdminLoginSchema>) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/admin/login", data);
      console.log(response);
      const { fullName, email } = response.data.data.admin;

      dispatch(
        login({
          ...response.data.data,
          ...{ userType: "Admin", adminInfo: { fullName, email } },
        })
      );
      console.log("Login successful");
      toast({
        title: "Success",
        description: "Login successful",
      });
      navigateTo("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Login failed. Please try again.";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="relative hidden bg-muted md:block">
            <img
              src="https://img.freepik.com/free-vector/realistic-neon-lights-background_23-2148907367.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your credentials below to log in to your account
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@digitalsalt.in"
                  {...register("email")}
                  required
                  className="text-sm md:text-base"
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <InputPassword
                  value={watch("password") || ""}
                  onChange={(e) => setValue("password", e.target.value)}
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                Login
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              </Button>
              <div className="flex items-center justify-between ">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    {...register("rememberMe")}
                    className="mr-2"
                  />
                  <Label htmlFor="rememberMe">Remember me</Label>
                </div>
                <a
                  href="/forgot-password"
                  className="text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginForm;
