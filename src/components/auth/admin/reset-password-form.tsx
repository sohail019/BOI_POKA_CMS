import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema } from "@/schemas/auth/admin-schema";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import InputPassword from "../../shared/password-validation";
import { cn } from "@/lib/utils";
import axiosInstance from "@/utils/axios-instance";
import { useParams } from "react-router";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const ResetPasswordForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { token } = useParams();
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const onSubmit = async (data: z.infer<typeof ResetPasswordSchema>) => {
    try {
      setLoading(true);
      if (!token) {
        toast({
          title: "Error",
          description: "Invalid or missing token.",
          variant: "destructive",
        });
        return;
      }

      const response = await axiosInstance.put(
        `/admin/resetPassword/${token}`,
        data
      );

      if (response.status !== 200) {
        throw new Error("Failed to reset password");
      }
      console.log("Password reset successful", data);
      toast({
        title: "Success",
        description: "Your password has been reset successfully.",
      });
      navigate("/admin-login");
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
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="relative hidden bg-muted md:block ">
            <img
              src="https://img.freepik.com/free-vector/realistic-neon-lights-background_23-2148907367.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <form className="p-6 md:p-8 h-96" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Reset Password</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your new password below to reset it
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                <InputPassword
                  value={watch("password") || ""}
                  onChange={(e) => setValue("password", e.target.value)}
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <InputPassword
                  value={watch("confirmPassword") || ""}
                  onChange={(e) => setValue("confirmPassword", e.target.value)}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Reset Password
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordForm;
