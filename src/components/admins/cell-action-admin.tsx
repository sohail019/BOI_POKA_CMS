import { AlertModal } from "@/components/shared/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Admin } from "@/constants/data";
import { Edit, MoreHorizontal, Shield, Trash } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import axiosInstance from "@/utils/axios-instance";
import { StopwatchIcon } from "@radix-ui/react-icons";

interface CellActionAdminProps {
  data: Admin;
  onDelete: (id: string) => void;
  onUpdateAdmin: (updatedAdmin: Admin) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
}

export const CellActionAdmin: React.FC<CellActionAdminProps> = ({
  data,
  onDelete,
  onUpdateAdmin,
  onToggleStatus,
}) => {
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openToggleStatus, setOpenToggleStatus] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [privileges, setPrivileges] = useState<string[]>(data.accessTo || []);

  const allPrivileges = [
    "get-user",
    "deactivate-user",
    "activate-user",
    "get-book",
    "update-userbooks",
    "delete-userbooks",
    "get-userbooks",
    "genre",
  ];

  const handleConfirm = async (
    action: () => Promise<void>,
    setOpen: (open: boolean) => void
  ) => {
    if (!data._id) {
      console.error("No ID found for action.");
      return;
    }

    setLoading(true);
    await action();
    setLoading(false);
    setOpen(false);
  };

  const handleDelete = () =>
    handleConfirm(() => onDelete(data._id), setOpenDelete);

  const handleToggleStatus = () =>
    handleConfirm(
      () => onToggleStatus(data._id, !data.isActive),
      setOpenToggleStatus
    );

  const handleUpdateAdmin = () => {
    navigate(`/update-admin/${data._id}`);
  };

  const openPrivilegeDialog = () => {
    setDialogOpen(true);
  };

  const handlePrivilegeChange = (privilege: string) => {
    setPrivileges((prev) =>
      prev.includes(privilege)
        ? prev.filter((item) => item !== privilege)
        : [...prev, privilege]
    );
  };

  const handleSavePrivileges = async () => {
    try {
      const response = await axiosInstance.put(
        `/superadmin/updateAccess/${data._id}`,
        { accessTo: privileges }
      );

      if (response.status === 200) {
        console.log("Updated Privileges:", response.data);
        setDialogOpen(false);
        onUpdateAdmin({ ...data, accessTo: privileges });
      }
    } catch (error) {
      console.error("Failed to update privileges:", error);
      alert("Error updating privileges. Please try again.");
    }
  };

  return (
    <>
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        loading={loading}
      />
      <AlertModal
        isOpen={openToggleStatus}
        onClose={() => setOpenToggleStatus(false)}
        onConfirm={handleToggleStatus}
        loading={loading}
      />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Privileges</DialogTitle>
            <DialogDescription>
              Modify the privileges for <strong>{data.fullName}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {allPrivileges.map((privilege) => (
              <label key={privilege} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={privileges.includes(privilege)}
                  onChange={() => handlePrivilegeChange(privilege)}
                />{" "}
                {privilege
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
              </label>
            ))}
          </div>

          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)} variant="secondary">
              Cancel
            </Button>
            <Button onClick={handleSavePrivileges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleUpdateAdmin}>
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenToggleStatus(true)}>
            <StopwatchIcon className="mr-2 h-4 w-4" />{" "}
            {data.isActive ? "Deactivate" : "Activate"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={openPrivilegeDialog}>
            <Shield className="mr-2 h-4 w-4" /> Update Privileges
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenDelete(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
