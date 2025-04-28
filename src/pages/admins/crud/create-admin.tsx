import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { CreateAdminSchema } from "@/schemas/superadmin/admin-schema";
import axiosInstance from "@/utils/axios-instance";
import axios from "axios";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import InputPassword from "@/components/shared/password-validation";

const CreateAdminPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof CreateAdminSchema>>({
    resolver: zodResolver(CreateAdminSchema),
  });

  const onSubmit = async (data: z.infer<typeof CreateAdminSchema>) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        "/superadmin/createAdmin",
        data
      );
      toast({
        title: "Success",
        description: response.data.message,
      });
      navigate("/admins");
    } catch (error) {
      console.error("Error in Creating Admin", error);
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Failed to create Admin";
      console.log(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-sm">
        <div className="flex flex-col">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Create Admin
              </CardTitle>
              <CardDescription className="text-gray-600">
                Enter the details of the new user below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Full Name"
                    {...register("fullName")}
                    required
                    className="text-sm"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    {...register("email")}
                    required
                    className="text-sm"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobileNumber">Mobile Number</Label>
                  <Input
                    id="mobileNumber"
                    type="text"
                    placeholder="User Mobile Number"
                    {...register("mobileNumber")}
                    required
                    className="text-sm"
                  />
                  {errors.mobileNumber && (
                    <p className="text-red-500 text-sm">
                      {errors.mobileNumber.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <InputPassword
                    value={watch("password") || ""}
                    onChange={(e) => setValue("password", e.target.value)}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Access Control</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      // "create-user",
                      "get-user",
                      // "update-user",
                      // "delete-user",
                      "deactivate-user",
                      "activate-user",
                      "get-book",
                      "update-userbooks",
                      "delete-userbooks",
                      "get-userbooks",
                      "genre",
                    ].map((access) => (
                      <label
                        key={access}
                        className="flex items-center space-x-2 p-2 border rounded-md shadow-sm transition duration-200"
                      >
                        <input
                          type="checkbox"
                          value={access}
                          checked={watch("accessTo")?.includes(access) || false}
                          onChange={(e) => {
                            const currentAccess = watch("accessTo") || [];
                            if (e.target.checked) {
                              setValue("accessTo", [...currentAccess, access]);
                            } else {
                              setValue(
                                "accessTo",
                                currentAccess.filter((item) => item !== access)
                              );
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded text-sm"
                        />
                        <span>
                          {access
                            .split("-")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.accessTo && (
                    <p className="text-red-500 text-sm">
                      {errors.accessTo.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full mt-4"
                  disabled={loading}
                >
                  Create Admin
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default CreateAdminPage;
