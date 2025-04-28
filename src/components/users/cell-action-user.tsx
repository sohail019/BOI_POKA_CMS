import { AlertModal } from "@/components/shared/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/constants/data";
import { StopwatchIcon } from "@radix-ui/react-icons";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

interface CellActionUserProps {
  data: User;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
}

export const CellActionUser: React.FC<CellActionUserProps> = ({
  data,
  onDelete,
  onToggleStatus,
}) => {
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openToggleStatus, setOpenToggleStatus] = useState(false);
  const navigateTo = useNavigate();

  const onConfirmDelete = async () => {
    if (!data._id) {
      console.error("No ID found for deletion.");
      return;
    }

    setLoading(true);
    await onDelete([data._id]);
    setLoading(false);
    setOpenDelete(false);
  };

  // };
  const onConfirmToggleStatus = async () => {
    if (!data._id) {
      console.error("No ID found for status toggle.");
      return;
    }

    setLoading(true);
    await onToggleStatus(data._id, !data.isActive);
    setLoading(false);
    setOpenToggleStatus(false);
  };

  const handleUpdateUser = () => {
    navigateTo(`/update-user/${data._id}`, { state: { user: data } });
  };
  return (
    <>
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={onConfirmDelete}
        loading={loading}
      />
      {/* Activate/Deactivate Confirmation Modal */}
      <AlertModal
        isOpen={openToggleStatus}
        onClose={() => setOpenToggleStatus(false)}
        onConfirm={onConfirmToggleStatus}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleUpdateUser}>
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenToggleStatus(true)}>
            <StopwatchIcon className="mr-2 h-4 w-4" />{" "}
            {data.isActive ? "Deactivate" : "Activate"}
          </DropdownMenuItem>
          {/* <DropdownMenuItem onClick={() => setOpenDelete(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
