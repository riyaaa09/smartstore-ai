import { useEffect, useState } from "react";
import axios from "axios";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const token = localStorage.getItem("token");

  const fetchSuppliers = async () => {
    const res = await axios.get(
      "http://127.0.0.1:8000/suppliers/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setSuppliers(res.data);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleAddSupplier = async () => {
    await axios.post(
      "http://127.0.0.1:8000/suppliers/",
      {
        name,
        email,
        category_supplied: "General",
        lead_time_days: 3,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setName("");
    setEmail("");
    fetchSuppliers();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Suppliers</h1>

      <div className="mb-4">
        <input
          className="border p-2 mr-2"
          placeholder="Supplier Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 mr-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleAddSupplier}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s) => (
            <tr key={s.id}>
              <td className="p-2 border">{s.name}</td>
              <td className="p-2 border">{s.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Suppliers;