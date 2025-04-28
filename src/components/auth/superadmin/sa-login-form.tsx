import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SuperAdminLoginSchema } from "@/schemas/auth/admin-schema";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { login } from "@/store/slices/auth-slice";
import InputPassword from "@/components/shared/password-validation";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axios-instance";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const SuperAdminLoginForm = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof SuperAdminLoginSchema>>({
    resolver: zodResolver(SuperAdminLoginSchema),
  });
  const navigateTo = useNavigate();

  const onSubmit = async (data: z.infer<typeof SuperAdminLoginSchema>) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/superadmin/login", data);
      const { fullName, email } = response.data.data.superAdmin;

      dispatch(
        login({
          ...response.data.data,
          ...{ userType: "SuperAdmin", adminInfo: { fullName, email } },
        })
      );
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
              alt="Background"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">SuperAdmin Login</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your credentials below to login.
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="superadmin@digitalsalt.com"
                  {...register("email")}
                  className="text-sm md:text-base"
                  required
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <InputPassword
                  value={watch("password") || ""}
                  onChange={(e) => setValue("password", e.target.value)}
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Login
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminLoginForm;
