import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema } from "@/schemas/auth/admin-schema";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axios-instance";
import axios from "axios";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const ForgotPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (data: z.infer<typeof ForgotPasswordSchema>) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        "/admin/request-password-reset",
        data
      );
      console.log(response.data.resetUrl);

      if (response.status !== 200) {
        throw new Error("Failed to send password reset email");
      }

      console.log("Password reset email sent", data);
      toast({
        title: "Success",
        description: "Password reset email sent. Please check your inbox.",
      });
      navigate("/check-email");
    } catch (error) {
      console.error("Password reset failed", error);
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Password reset failed. Please try again.";

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
      <Card className="overflow-hidden h-[412px] flex flex-col">
        <CardContent className="flex-1 grid p-0 md:grid-cols-2">
          <div className="relative hidden bg-muted md:block">
            <img
              src="https://img.freepik.com/free-vector/realistic-neon-lights-background_23-2148907367.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <form
            className="flex flex-col gap-6 p-6 md:p-8 w-full max-w-md mx-auto overflow-auto"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Forgot Password</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your email below to reset your password
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@boipoka.com"
                  {...register("email")}
                  required
                  className="text-sm md:text-base"
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Submit
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
