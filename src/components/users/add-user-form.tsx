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
import { AddUserSchema } from "@/schemas/user-schema";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

const AddUserForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof AddUserSchema>>({
    resolver: zodResolver(AddUserSchema),
  });

  const onSubmit = (data: z.infer<typeof AddUserSchema>) => {
    try {
      console.log("Form data:", data);

      const newUser = { ...data };

      if (typeof window !== "undefined" && window.localStorage) {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        console.log("Users before:", users);
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        console.log("Users after:", users);
      }

      toast({
        title: "Success",
        description: "User added successfully",
      });
      navigate("/users");
    } catch (error) {
      console.error("Error in adding user", error);
      toast({
        title: "Error",
        description: "Failed to add user",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-sm">
      <div className="flex flex-col">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Add New User
            </CardTitle>
            <CardDescription className="text-gray-600">
              Enter the details of the new user below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="User Name"
                  {...register("name")}
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user-email@example.com"
                  {...register("email")}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  {...register("role")}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-transparent"
                  required
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                  <option value="SuperAdmin">SuperAdmin</option>
                </select>
                {errors.role && (
                  <p className="text-red-500 text-sm">{errors.role.message}</p>
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
                />
                {errors.mobileNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.mobileNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="User Location"
                  {...register("location")}
                  required
                />
                {errors.location && (
                  <p className="text-red-500 text-sm">
                    {errors.location.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full mt-4">
                Add User
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
};

export default AddUserForm;
