import React, { useState, useEffect } from "react";
import rootUrl from "@/app/root-url/url";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import { MdArrowDropDown } from "react-icons/md";
import Loader from "../Loader";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { formatCurrency } from "@/utils/formatCurrency";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

type ChartType = "bar" | "line" | "pie" | "doughnut";

const Analytics = () => {
  const [orderStatusChartType, setOrderStatusChartType] =
    useState<ChartType>("bar");
  const [topProductsChartType, setTopProductsChartType] =
    useState<ChartType>("bar");
  const [analyticsData, setAnalyticsData] = useState<{
    salesOverview: {
      totalSales: number;
      pendingDeliverySales: number;
      deliveredSales: number;
    };
    orderStatusCount: Record<string, number>;
    topProducts: { name: string; totalSales: number; imageUrls: string[] }[];
  } | null>(null);
  const [showOrderStatusDropdown, setShowOrderStatusDropdown] = useState(false);
  const [showTopProductsDropdown, setShowTopProductsDropdown] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`${rootUrl}/api/analytics`);
        const data = await response.json();
        setAnalyticsData(data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };
    fetchAnalytics();
  }, []);

  if (!analyticsData)
    return (
      <div>
        Loading analytics...
        <Loader />
      </div>
    );

  const { salesOverview, orderStatusCount, topProducts } = analyticsData;

  const orderStatusData = {
    labels: Object.keys(orderStatusCount),
    datasets: [
      {
        label: "Order Status",
        data: Object.values(orderStatusCount),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        borderColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        borderWidth: 1,
      },
    ],
  };

  const topProductsData = {
    labels: topProducts.map((product) => product.name),
    datasets: [
      {
        label: "Top Products by Sales",
        data: topProducts.map((product) => product.totalSales),
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  const ChartComponent: Record<ChartType, React.ElementType> = {
    bar: Bar,
    line: Line,
    pie: Pie,
    doughnut: Doughnut,
  };

  return (
    <div className="analytics">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">
        Dashboard Analytics
      </h3>
      <div className="bg-gray-50 p-6 rounded-md shadow-md">
        <h4 className="text-xl font-semibold text-gray-800 mb-4">
          Overall Statistics
        </h4>
        <p>Sales Overview: {formatCurrency(salesOverview.totalSales)}</p>
        <p>
          Pending Delivery Sales:{" "}
          {formatCurrency(salesOverview.pendingDeliverySales)}
        </p>
        <p>Delivered Sales: {formatCurrency(salesOverview.deliveredSales)}</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-md shadow-md mt-6">
        <h4 className="text-xl font-semibold text-gray-800 mb-4">
          Order Status
        </h4>

        {/* Dropdown for small screens */}
        <div className="sm:hidden">
          <button
            onClick={() => setShowOrderStatusDropdown(!showOrderStatusDropdown)}
            className="px-4 py-2 text-white rounded bg-blue-500 flex"
          >
            Chart Type
            <MdArrowDropDown size={24} />
          </button>
          {showOrderStatusDropdown && (
            <div className="mt-2 bg-white border rounded shadow-md transition-all">
              {["bar", "line", "pie", "doughnut"].map((type) => (
                <button
                  key={type}
                  className={`block w-full px-4 py-2 text-left ${
                    orderStatusChartType === type
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100"
                  }`}
                  onClick={() => {
                    setOrderStatusChartType(type as ChartType);
                    setShowOrderStatusDropdown(false);
                  }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Button toggle for larger screens */}
        <div className="hidden sm:flex gap-3 mb-3">
          {["bar", "line", "pie", "doughnut"].map((type) => (
            <button
              key={type}
              className={`px-4 py-2 text-white rounded ${
                orderStatusChartType === type ? "bg-blue-500" : "bg-gray-400"
              }`}
              onClick={() => setOrderStatusChartType(type as ChartType)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-1/2 md:w-2/3 lg:w-full xl:w-2/3">
          {React.createElement(ChartComponent[orderStatusChartType], {
            data: orderStatusData,
            options: { responsive: true },
          })}
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-md shadow-md mt-6">
        <h4 className="text-xl font-semibold text-gray-800 mb-4">
          Top Products
        </h4>

        {/* Dropdown for small screens */}
        <div className="sm:hidden">
          <button
            onClick={() => setShowTopProductsDropdown(!showTopProductsDropdown)}
            className="px-4 py-2 text-white rounded bg-blue-500"
          >
            Select Chart Type
          </button>
          {showTopProductsDropdown && (
            <div className="mt-2 bg-white border rounded shadow-md">
              {["bar", "line", "pie", "doughnut"].map((type) => (
                <button
                  key={type}
                  className={`block w-full px-4 py-2 text-left ${
                    topProductsChartType === type
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100"
                  }`}
                  onClick={() => {
                    setTopProductsChartType(type as ChartType);
                    setShowTopProductsDropdown(false);
                  }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Button toggle for larger screens */}
        <div className="hidden sm:flex gap-3 mb-3">
          {["bar", "line", "pie", "doughnut"].map((type) => (
            <button
              key={type}
              className={`px-4 py-2 text-white rounded ${
                topProductsChartType === type ? "bg-blue-500" : "bg-gray-400"
              }`}
              onClick={() => setTopProductsChartType(type as ChartType)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-1/2 md:w-2/3 lg:w-full xl:w-2/3">
          {React.createElement(ChartComponent[topProductsChartType], {
            data: topProductsData,
            options: { responsive: true },
          })}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
