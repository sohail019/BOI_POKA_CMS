import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios-instance";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/constants/data";
import { DataTable } from "@/components/shared/table/data-table";
import { DataTablePagination } from "@/components/shared/table/data-table-pagination";
import { DataTableSkeleton } from "@/components/shared/data-table-skeleton";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, XCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { CellActionUser } from "@/components/users/cell-action-user";
import { Input } from "@/components/ui/input";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const fetchUsers = async (page: number, limit: number, fullName: string) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/admin/getAllUser", {
        params: { page, limit, sortOrder: "desc", fullName },
      });
      const { users, totalUsers } = response.data.data;
      console.log(users.fullName);
      setUsers(
        users.map((user: User) => ({
          ...user,
          id: user._id,
        })) // Reverse the order to make it LIFO
      );
      setTotalUsers(totalUsers);
      setError(null);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to fetch users.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(currentPage, pageSize, searchQuery);
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, pageSize, searchQuery]);

  // useEffect(() => {
  //   fetchUsers(currentPage, pageSize);
  // }, [currentPage, pageSize]);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const columns: ColumnDef<User>[] = [
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
      cell: ({ row }) => {
        const mobileNumber = row.original.mobileNumber;
        return (
          <div>
            {mobileNumber ? <p> {mobileNumber} </p> : <p className="px-8">-</p>}
          </div>
        );
      },
    },
    {
      accessorKey: "userBookCount",
      header: "User Book Count",
      cell: ({ row }) => {
        const userBookCount = row.original.userBookCount;
        return (
          <div className="px-12">
            {userBookCount ? <p> {userBookCount} </p> : <p>-</p>}
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
        <CellActionUser
          data={row.original}
          onDelete={(id) => handleDeleteUsers(id)}
          onToggleStatus={(id, isActive) =>
            handleToggleUserStatus(id, isActive)
          }
        />
      ),
    },
  ];

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const endpoint = isActive
        ? "/admin/activateUser"
        : "/admin/deactivateUser";
      await axiosInstance.put(endpoint, { userIds: [userId] });
      toast({
        title: "Success",
        description: `User successfully ${isActive ? "Activated" : "Deactivated"}.`,
      });
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, isActive: !user.isActive } : user
        )
      );
    } catch {
      toast({
        title: "Error",
        description: "Failed to toggle user status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUsers = async (id: string) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/admin/deleteUsers/${id}`);
      fetchUsers(currentPage, pageSize);
      toast({
        title: "Success",
        description: "User deleted successfully.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Input
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {loading ? (
        <DataTableSkeleton columnCount={6} rowCount={10} />
      ) : users.length === 0 ? (
        <p className="text-center text-gray-500">No users found.</p>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <DataTable columns={columns} data={users} />
          </div>
          <DataTablePagination
            table={{
              getState: () => ({
                pagination: { pageIndex: currentPage - 1, pageSize },
                columnVisibility: {},
                columnOrder: [],
                columnPinning: {},
                rowPinning: {},
                sorting: [],
                globalFilter: searchQuery,
                columnFilters: [],
                columnSizing: {},
                columnSizingInfo: {
                  isResizingColumn: false,
                  startOffset: 0,
                  startSize: 0,
                },
                expanded: {},
                grouping: [],
                selectedRowIds: {},
                rowSelection: {},
              }),
              getPageCount: () => Math.ceil(totalUsers / pageSize),
              getCanNextPage: () =>
                currentPage < Math.ceil(totalUsers / pageSize),
              getCanPreviousPage: () => currentPage > 1,
              nextPage: () => handlePageChange(currentPage + 1),
              previousPage: () => handlePageChange(currentPage - 1),
              setPageSize: handlePageSizeChange,
              setPageIndex: (index: number) => handlePageChange(index + 1),
              getFilteredSelectedRowModel: () => ({ rows: [] }),
              getFilteredRowModel: () => ({ rows: users }),
            }}
          />
        </div>
      )}
    </div>
  );
}
