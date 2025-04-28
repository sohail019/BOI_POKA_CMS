import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios-instance";
import { useToast } from "@/hooks/use-toast";
import { Book } from "@/constants/data";
import { DataTable } from "@/components/shared/table/data-table";
import { booksColumns } from "./book-column";
import { DataTablePagination } from "@/components/shared/table/data-table-pagination";
import { DataTableSkeleton } from "@/components/shared/data-table-skeleton";
import { Input } from "@/components/ui/input";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchBooks = async (page: number, limit: number, title: string) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/admin/getAllBooks", {
        params: { page, limit, title },
      });

      const { books, totalBooks } = response.data.data;
      setBooks(books.map((book: Book) => ({ ...book, id: book._id })));
      setTotalBooks(totalBooks);
      setError(null);
    } catch (error: any) {
      setError("Failed to fetch books.");
      toast({
        title: "Error",
        description: error.message || "Failed to fetch books.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchBooks(currentPage, pageSize);
  // }, [currentPage, pageSize]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchBooks(currentPage, pageSize, searchQuery);
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, pageSize, searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    fetchBooks(1, size, searchQuery);
  };

  return (
    <div className="p-4 space-y-4">
      <Input
        placeholder="Search books..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {/* Error Message */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Data Table */}
      {loading ? (
        <DataTableSkeleton columnCount={6} rowCount={10} />
      ) : books.length === 0 ? (
        <p className="text-center text-gray-500">No Books found.</p>
      ) : (
        <div className="space-y-4">
          <DataTable columns={booksColumns} data={books} />
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
              getPageCount: () => Math.ceil(totalBooks / pageSize),
              getCanNextPage: () =>
                currentPage < Math.ceil(totalBooks / pageSize),
              getCanPreviousPage: () => currentPage > 1,
              nextPage: () => handlePageChange(currentPage + 1),
              previousPage: () => handlePageChange(currentPage - 1),
              setPageSize: handlePageSizeChange,
              setPageIndex: (index: number) => handlePageChange(index + 1),
              getFilteredSelectedRowModel: () => ({ rows: [] }),
              getFilteredRowModel: () => ({ rows: books }),
            }}
          />
        </div>
      )}
    </div>
  );
}
