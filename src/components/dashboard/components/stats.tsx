import StatsCardShimmer from "@/components/shimmers/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axiosInstance from "@/utils/axios-instance";
import { Book, CalendarRange, User, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface DashboardData {
  totalBooks: number;
  totalUsers: number;
  totalInnerCircles: number;
  booksAddedLastMonth: number;
}

export default function Stats() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get("/admin/getDashboardCardData");
        setDashboardData(response.data.data);
      } catch (err) {
        setError("Failed to fetch dashboard data. Please try again later.");
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <StatsCardShimmer />;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!dashboardData) {
    return <div>No data available.</div>;
  }

  const { totalBooks, totalUsers, totalInnerCircles, booksAddedLastMonth } =
    dashboardData;

  const bookGrowthRate = ((booksAddedLastMonth / totalBooks) * 100).toFixed(1);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Books</CardTitle>
          <Book className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBooks}</div>
          <p className="text-xs text-muted-foreground">
            +{bookGrowthRate}% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            +180.1% from last month{" "}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Number of Inner Circles
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalInnerCircles}</div>
          <p className="text-xs text-muted-foreground">+19% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Books Added Last Month
          </CardTitle>
          <CalendarRange className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{booksAddedLastMonth}</div>
          <p className="text-xs text-muted-foreground">+20 since last hour</p>
        </CardContent>
      </Card>
    </div>
  );
}
