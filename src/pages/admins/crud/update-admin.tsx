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
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UpdateAdminSchema } from "@/schemas/superadmin/admin-schema";
import axiosInstance from "@/utils/axios-instance";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Admin } from "@/constants/data";

const UpdateAdminPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<Admin>();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof UpdateAdminSchema>>({
    resolver: zodResolver(UpdateAdminSchema),
    defaultValues: {
      fullName: "",
      email: "",
      mobileNumber: "",
      accessTo: [],
    },
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/superadmin/getAdmin/${id}`);
        const adminData = response.data.data.admin;
        setInitialData(adminData);

        reset({
          fullName: adminData.fullName,
          email: adminData.email,
          mobileNumber: adminData.mobileNumber,
          accessTo: adminData.accessTo,
        });
      } catch (error) {
        console.error("Error fetching admin data", error);
        toast({
          title: "Error",
          description: "Failed to load admin data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAdminData();
    }
  }, [id, reset, toast]);

  const onSubmit = async (data: z.infer<typeof UpdateAdminSchema>) => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(
        `/superadmin/updateAdmin/${id}`,
        data
      );
      toast({
        title: "Success",
        description: response.data.message,
      });
      navigate("/admins");
    } catch (error) {
      console.error("Error in Updating Admin", error);
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Failed to update Admin";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading || !initialData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col mt-3">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Update Admin
            </CardTitle>
            <CardDescription className="text-gray-600">
              Update admin details below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Full Name"
                  {...register("fullName")}
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
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  type="text"
                  placeholder="User Mobile Number"
                  {...register("mobileNumber")}
                />
                {errors.mobileNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.mobileNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Access Control</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "create-user",
                    "get-user",
                    "update-user",
                    "delete-user",
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
                            reset({
                              accessTo: [...currentAccess, access],
                            });
                          } else {
                            reset({
                              accessTo: currentAccess.filter(
                                (item) => item !== access
                              ),
                            });
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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

              <Button type="submit" className="w-full mt-4" disabled={loading}>
                Update Admin
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
};

export default UpdateAdminPage;
