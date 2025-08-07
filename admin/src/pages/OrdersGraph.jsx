import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the components with Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const OrdersGraph = ({ token }) => {
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/order/daily-orders", {
          headers: { token },
        });

        // Ensure data is an array and non-empty
        if (Array.isArray(data) && data.length > 0) {
          setOrderData(data);
        } else {
          console.error("No data or invalid format:", data);
        }
      } catch (error) {
        console.error("Error fetching daily orders data:", error);
      }
    };
    fetchData();
  }, [token]);

  const chartData = {
    labels: orderData.map((order) => order._id), // Date labels
    datasets: [
      {
        label: "Daily Orders",
        data: orderData.map((order) => order.count),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Order Count",
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1, // Ensure y-axis increments are whole numbers
        },
      },
    },
  };

  return (
    <div>
      <h2>Daily Orders</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default OrdersGraph;
