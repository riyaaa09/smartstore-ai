import { useEffect, useState } from "react";
import axios from "axios";

function Automation() {
  const [logs, setLogs] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await axios.get(
        "http://127.0.0.1:8000/automation/logs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLogs(res.data);
    };

    fetchLogs();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Automation Logs
      </h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Job</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Message</th>
            <th className="p-2 border">Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="p-2 border">{log.job_name}</td>
              <td className="p-2 border">{log.status}</td>
              <td className="p-2 border">{log.message}</td>
              <td className="p-2 border">{log.run_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Automation;