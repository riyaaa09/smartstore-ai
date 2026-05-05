import { useEffect, useState } from "react";
import axios from "axios";

function Products() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/products/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/products/",
        {
          name,
          sku: name + "-001",
          category,
          stock_level: 50,
          unit_price: 100,
          expiry_date: "2026-12-31",
          reorder_threshold: 10,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchProducts();
      setName("");
      setCategory("");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const getStatusColor = (status) => {
    if (status === "ok") return "text-green-600";
    if (status === "low") return "text-yellow-600";
    if (status === "expired") return "text-red-600";
    return "";
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      {/* Add Product */}
      <div className="mb-6">
        <input
          className="border p-2 mr-2"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 mr-2"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button
          onClick={handleAddProduct}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* Product Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Stock</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="p-2 border">{p.name}</td>
              <td className="p-2 border">{p.category}</td>
              <td className="p-2 border">{p.stock_level}</td>
              <td
                className={`p-2 border font-bold ${getStatusColor(
                  p.status
                )}`}
              >
                {p.status}
              </td>
              <td className="p-2 border">
                <button
                  onClick={() =>
                    (window.location.href = `/products/${p.id}`)
                  }
                  className="bg-purple-500 text-white px-3 py-1 rounded"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Products;