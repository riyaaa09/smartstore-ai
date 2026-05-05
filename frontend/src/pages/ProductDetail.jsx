import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

function ProductDetail() {
  const { id } = useParams();
  const [forecast, setForecast] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchForecast = async () => {
      const res = await axios.get(
        `http://127.0.0.1:8000/products/${id}/forecast`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setForecast(res.data.forecast);
    };

    fetchForecast();
  }, [id]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Demand Forecast
      </h1>

      <LineChart width={600} height={300} data={forecast}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="predicted_demand"
          stroke="#8884d8"
        />
      </LineChart>
    </div>
  );
}

export default ProductDetail;