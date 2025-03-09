import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import "antd/dist/antd.css";
import Invoices from "./pages/Invoices";
import PaymentMethods from "./pages/PaymentMethods";
import Services from "./pages/Services";
import Settings from "./pages/Settings";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/invoices" />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/payment-methods" element={<PaymentMethods />} />
        <Route path="/services" element={<Services />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
