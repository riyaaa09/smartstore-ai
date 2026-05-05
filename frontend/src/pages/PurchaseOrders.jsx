import { useEffect, useState } from "react";
import axios from "axios";

function PurchaseOrders() {
  const [pos, setPos] = useState([]);
  const [supplierId, setSupplierId] = useState("");
  const [productId, setProductId] = useState("");

  const token = localStorage.getItem("token");

  const fetchPOs = async () => {
    const res = await axios.get(
      "http://127.0.0.1:8000/purchase-orders/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setPos(res.data);
  };

  useEffect(() => {
    fetchPOs();
  }, []);

  const handleCreatePO = async () => {
    await axios.post(
      "http://127.0.0.1:8000/purchase-orders/",
      {
        supplier_id: Number(supplierId),
        items: [
          {
            product_id: Number(productId),
            quantity: 10,
            unit_price: 100,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchPOs();
  };

  const handleStatusUpdate = async (id, status) => {
    await axios.patch(
      `http://127.0.0.1:8000/purchase-orders/${id}/status?status=${status}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchPOs();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Purchase Orders
      </h1>

      <div className="mb-4">
        <input
          className="border p-2 mr-2"
          placeholder="Supplier ID"
          onChange={(e) => setSupplierId(e.target.value)}
        />
        <input
          className="border p-2 mr-2"
          placeholder="Product ID"
          onChange={(e) => setProductId(e.target.value)}
        />
        <button
          onClick={handleCreatePO}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create PO
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Supplier</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pos.map((po) => (
            <tr key={po.id}>
              <td className="p-2 border">{po.id}</td>
              <td className="p-2 border">{po.supplier_id}</td>
              <td className="p-2 border">{po.status}</td>
              <td className="p-2 border">
                <button
                  onClick={() =>
                    handleStatusUpdate(po.id, "Sent")
                  }
                  className="bg-yellow-500 text-white px-2 py-1 mr-2 rounded"
                >
                  Sent
                </button>
                <button
                  onClick={() =>
                    handleStatusUpdate(po.id, "Received")
                  }
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Received
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PurchaseOrders;