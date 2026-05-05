import { useState } from "react";
import axios from "axios";

function Invoice() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const token = localStorage.getItem("token");

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(
      "http://127.0.0.1:8000/invoices/parse",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setResult(res.data);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Upload Invoice</h1>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Parse Invoice
      </button>

      {result && (
        <pre className="mt-4 bg-gray-100 p-4">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default Invoice;