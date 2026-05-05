import { useState } from "react";
import axios from "axios";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const sendMessage = async () => {
    if (!input) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/ai/chat",
        { message: input },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let reply =
        res.data.response ||
        JSON.stringify(res.data.data, null, 2);

      setMessages([
        ...newMessages,
        { role: "assistant", content: reply },
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Error fetching response" },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI Store Assistant</h1>

      <div className="border h-96 overflow-y-auto p-4 mb-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.role === "user"
                ? "text-right"
                : "text-left text-blue-600"
            }`}
          >
            <strong>{msg.role}:</strong>
            <div className="whitespace-pre-wrap">
              {msg.content}
            </div>
          </div>
        ))}

        {loading && <div>AI is typing...</div>}
      </div>

      <div className="flex">
        <input
          className="border flex-1 p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about stock, products..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;