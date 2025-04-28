import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import axiosInstance from "@/utils/axios-instance";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { registerSchema, RegisterFormData } from "@/schemas/auth/admin-schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import PasswordWithValidation from "../shared/password-validation";
import { useNavigate } from "react-router-dom";
const AdminRegisterForm: React.FC = () => {
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  const navigateTo = useNavigate();
  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      // await axiosInstance.post("/admin/register", data);
      console.log(data);
      navigateTo("/admin-login");
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        alert(error.response?.data?.error || "Registration failed");
      } else {
        alert("Registration failed");
      }
    }
  };

  return (
    <>
        <div className="flex flex-col gap-2">
          <Card>
            <CardHeader className=" p-4"> 
              <CardTitle className="text-lg">Register</CardTitle>
              <CardDescription className="text-sm">
                Enter your details to create a new account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@cms.com"
                      {...register("email")}
                      required
                    />
                    {errors.email && (
                      <p className="text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Admin "
                      {...register("fullName")}
                      required
                    />
                    {errors.fullName && (
                      <p className="text-red-500">{errors.fullName.message}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="mobileNumber">Mobile Number</Label>
                    <Input
                      id="mobileNumber"
                      type="text"
                      placeholder="+91 123456789"
                      {...register("mobileNumber")}
                      required
                    />
                    {errors.mobileNumber && (
                      <p className="text-red-500">
                        {errors.mobileNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>

                    {/* <PasswordWithValidation
                      value={watch("password") || ""}
                      onChange={(e) => setValue("password", e.target.value)}
                    /> */}
                    {errors.password && (
                      <p className="text-red-500">{errors.password.message}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full">
                    Register
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <a
                    href="/admin-login"
                    className="underline underline-offset-4"
                  >
                    Login
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
    </>
  );
};

export default AdminRegisterForm;
