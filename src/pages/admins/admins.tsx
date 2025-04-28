import { useEffect, useState } from "react";
import axios from "axios";
import { DataTableSkeleton } from "@/components/shared/data-table-skeleton";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { CheckCircle, Plus, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import axiosInstance from "@/utils/axios-instance";
import { useToast } from "@/hooks/use-toast";
import { DataTable } from "@/components/shared/table/data-table";
import { CellActionAdmin } from "@/components/admins/cell-action-admin";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface Admin {
  fullName: string;
  email: string;
  mobileNumber: string;
  id: string;
  accessTo: string[];
  isActive: boolean;
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/superadmin/getAllAdmin");
        console.log(response.data.data.admins);
        setAdmins(
          response.data.data.admins.map((admin: Admin) => ({
            ...admin,
            id: admin._id,
          }))
        );
        setError(null);
      } catch (error) {
        const errorMessage =
          axios.isAxiosError(error) && error.response?.data?.error
            ? error.response.data.error
            : "Failed to fetch admins";
        console.log(error);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [toast]);

  const handleDeleteAdmin = async (id: string) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/superadmin/deleteAdmin/${id}`);
      setAdmins((prev) => prev.filter((admin) => admin.id !== id));
      toast({
        title: "Success",
        description: "Admin deleted successfully.",
      });
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Failed to delete Admin";
      console.error("Error in Deleting Admin", error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdminStatus = async (
    adminId: string,
    isActive: boolean
  ) => {
    try {
      const endpoint = isActive
        ? "/superadmin/activateAdmins"
        : "/superadmin/deactivateAdmins";
      await axiosInstance.put(endpoint, { adminIds: [adminId] });
      toast({
        title: "Success",
        description: `Admin successfully ${
          isActive ? "Activated" : "Deactivated"
        }.`,
      });
      setAdmins((prev) => {
        return prev.map((admin) => {
          if (admin.id === adminId) {
            return {
              ...admin,
              isActive: !admin.isActive,
            };
          }
          return admin;
        });
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle admin status.",
        variant: "destructive",
      });
    }
  };

  const handleCreateAdmin = () => {
    navigate("/create-admin");
  };

  const handleUpdateAdmin = (updatedAdmin: Admin) => {
    setAdmins((prev) =>
      prev.map((admin) => (admin.id === updatedAdmin.id ? updatedAdmin : admin))
    );
  };

  const columns: ColumnDef<Admin>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    },
    {
      accessorKey: "fullName",
      header: "Full Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "mobileNumber",
      header: "Mobile Number",
    },
    {
      accessorKey: "accessTo",
      header: "Privileges",
      cell: ({ row }) => {
        const accessTo = row.original.accessTo;

        const privilegeMapping = {
          // "create-user": "Create",
          "get-user": "Get",
          // "update-user": "Update",
          // "delete-user": "Delete",
          "deactivate-user": "Deactivate",
          "activate-user": "Activate",
          "get-book": "Get Book",
          "update-userbooks": "Update Userbook",
          genre: "Genre",
          "delete-userbooks": "Delete Userbook",
          "get-userbooks": "Get Userbook",
        };

        const privilegeOrder = [
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
        ];

        const sortedAccessTo = accessTo
          ? accessTo.sort(
              (a, b) => privilegeOrder.indexOf(a) - privilegeOrder.indexOf(b)
            )
          : [];

        const displayedPrivileges = sortedAccessTo.slice(0, 3);
        const remainingPrivileges = sortedAccessTo.slice(3);

        return (
          <div className="flex space-x-2 items-center">
            {displayedPrivileges.map((privilege, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-800"
              >
                {privilegeMapping[privilege as keyof typeof privilegeMapping] ||
                  privilege.replace("-", " ").toUpperCase()}
              </span>
            ))}
            {remainingPrivileges.length > 0 && (
              <HoverCard>
                <HoverCardTrigger>
                  <span className="px-2 py-1 cursor-pointer underline text-xs rounded-full bg-gray-200 text-blue-800">
                    +{remainingPrivileges.length}
                  </span>
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className="flex flex-wrap gap-2 p-2">
                    {remainingPrivileges.map((privilege, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800"
                      >
                        {privilegeMapping[
                          privilege as keyof typeof privilegeMapping
                        ] || privilege.replace("-", " ").toUpperCase()}
                      </span>
                    ))}
                  </div>
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
        );
      },
    },

    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.isActive;
        return (
          <div className="px-3">
            {status ? (
              <CheckCircle className="text-green-500 w-5 h-5" />
            ) : (
              <XCircle className="text-red-500 w-5 h-5" />
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <CellActionAdmin
          data={row.original}
          onDelete={handleDeleteAdmin}
          onToggleStatus={handleToggleAdminStatus}
          onUpdateAdmin={handleUpdateAdmin}
        />
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between gap-2 py-5">
        <div className="flex gap-3">
          <Button onClick={handleCreateAdmin} className="text-xs md:text-sm">
            <Plus className="mr-2 h-4 w-4" /> Create Admin
          </Button>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {loading ? (
        <DataTableSkeleton columnCount={7} rowCount={10} />
      ) : admins.length === 0 ? (
        <p className="text-center text-gray-500">No admins found.</p>
      ) : (
        <DataTable columns={columns} data={admins} />
      )}
    </div>
  );
}
