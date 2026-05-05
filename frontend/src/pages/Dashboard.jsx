import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://127.0.0.1:8000/products/dashboard-summary",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSummary(res.data);
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <button
       onClick={() => (window.location.href = "/products")}
       className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
       >
       View Products
      </button>

      <button
      onClick={() => (window.location.href = "/chat")}
      className="bg-purple-500 text-white px-4 py-2 rounded mb-4 ml-2"
      >
      Open AI Assistant
      </button>

      <button
       onClick={() => (window.location.href = "/invoice")}
       className="bg-green-500 text-white px-4 py-2 rounded ml-2"
      >
       Upload Invoice
      </button>

      <button
  onClick={() => (window.location.href = "/automation")}
  className="bg-orange-500 text-white px-4 py-2 rounded ml-2"
>
  Automation Logs
</button>

<button
  onClick={() => (window.location.href = "/suppliers")}
  className="bg-teal-500 text-white px-4 py-2 rounded ml-2"
>
  Suppliers
</button>

<button
  onClick={() => (window.location.href = "/purchase-orders")}
  className="bg-indigo-500 text-white px-4 py-2 rounded ml-2"
>
  Purchase Orders
</button>

      {summary && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-200 p-4 rounded shadow">
            Total Products: {summary.total_products}
          </div>

          <div className="bg-yellow-200 p-4 rounded shadow">
            Low Stock Alerts: {summary.low_stock_alerts}
          </div>

          <div className="bg-red-200 p-4 rounded shadow">
            Expired Items: {summary.expired_items}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;