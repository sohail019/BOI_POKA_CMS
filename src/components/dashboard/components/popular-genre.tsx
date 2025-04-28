import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import axiosInstance from "@/utils/axios-instance";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AA00FF",
  "#FF00AA",
  "#FF6347",
  "#7CFC00",
  "#6A5ACD",
  "#FFD700",
];

const chartConfig = {
  genres: {
    label: "Genres",
    color: COLORS[0],
  },
} satisfies ChartConfig;

const PopularGenre = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenreDistribution = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get("/admin/getGenreDistribution");
        const genreData = response.data.data.genreDistribution;
        const formattedData = genreData.map(
          (item: { genre: string; count: number }) => ({
            name: item.genre,
            value: item.count,
          })
        );

        setChartData(formattedData);
      } catch (err) {
        setError("Failed to fetch genre distribution data.");
        console.error("Error fetching genre distribution:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGenreDistribution();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 rounded-lg shadow-md">
      <ChartContainer config={chartConfig}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="80%"
            labelLine={false}
            fill="#8884d8"
            dataKey="value"
            // label={({ name, value }) => `${name} (${value})`}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
        </PieChart>
      </ChartContainer>
    </div>
  );
};

export default PopularGenre;
