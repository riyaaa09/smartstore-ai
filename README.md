# smartstore-ai
SmartStore AI is a full-stack intelligent inventory and vendor management platform built with FastAPI (backend) and React (frontend). It helps retail businesses manage inventory, automate purchase orders, forecast demand, parse invoices using AI, and interact with real store data through an LLM-powered assistant.

🚀 Features
✅ Module A – Inventory Management
Product CRUD operations
Stock health indicators (OK / Low / Expired)
Dashboard summary cards
7-day demand forecast
Forecast visualization (Recharts)

✅ Module B – Supplier & Purchase Orders
Supplier directory management
Create purchase orders with line items
PO status workflow (Draft → Sent → Acknowledged → Received)
PO history view

✅ Module C – AI Store Assistant
LLM-powered chat assistant
Tool/function calling
Real database grounding (no hallucinated data)
Tools implemented:
get_low_stock_products
get_product_detail
get_po_history

✅ Module D – Demand Forecast
7-day forecast endpoint
Moving average-based estimation
Forecast chart visualization

✅ Module E – Invoice OCR Parser
Upload invoice image (PNG/JPG)
AI vision-based structured data extraction
Extract supplier, line items, totals
Parsed JSON preview

✅ Module F – Agentic Automation
APScheduler-based automation
Low-stock agent
Auto-creation of draft purchase orders
Automation logs persisted in database

🏗 Architecture
Frontend (React + Tailwind)
        ↓
FastAPI Backend
        ↓
PostgreSQL Database
        ↓
OpenAI API (LLM + Vision)

🛠 Tech Stack
Backend
Python 3.11
FastAPI
SQLAlchemy ORM
PostgreSQL
APScheduler
OpenAI API
Frontend
React (Vite)
Tailwind CSS
Axios
Recharts

⚙️ Setup Instructions
🔹 Backend Setup
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
Create .env file using .env.example

Run:uvicorn main:app --reload

🔹 Frontend Setup
cd frontend
npm install
npm run dev
Open:http://localhost:5173

🔄 Running with Docker
docker-compose up --build

🤖 AI Integration
OpenAI GPT model was used for:

Tool calling
Data-grounded responses
Invoice OCR parsing
Tool-calling ensures real database queries are executed instead of hallucinated responses.

📈 Forecast Approach
A simple moving average logic is used to estimate 7-day demand.
This approach was selected for interpretability and simplicity.
In a production system, ARIMA or Prophet could improve accuracy.

🔄 Automation
A background scheduler runs a low-stock agent periodically.
If a product falls below its reorder threshold, a draft purchase order is automatically generated and logged.

⚠️ Known Limitations
Forecast uses simplified logic
OCR assumes clean invoice layout
UI is functional but minimally styled
Automation frequency reduced for demo

📹 Demo Video
(Insert your demo video link here)


