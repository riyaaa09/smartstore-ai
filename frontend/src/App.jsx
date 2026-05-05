import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Chat from "./pages/Chat";
import ProductDetail from "./pages/ProductDetail";
import Invoice from "./pages/Invoice";
import Automation from "./pages/Automation";
import Suppliers from "./pages/Suppliers";
import PurchaseOrders from "./pages/PurchaseOrders";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/automation" element={<Automation />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/purchase-orders" element={<PurchaseOrders />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
