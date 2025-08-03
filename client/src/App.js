import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { PrimeReactProvider } from "primereact/api";
import { ConfirmDialog } from "primereact/confirmdialog";

import Auth from "./components/Auth";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Redeemed from "./pages/Redeemed";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import Chatbot from "./components/Chatbot"; 

import "./App.css";

function AppRoutes() {
  const location = useLocation();
  const hideChatbot = location.pathname === "/";

  return (
    <>
      <ConfirmDialog />
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/redeemed" element={<Redeemed />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      {!hideChatbot && <Chatbot />} 
    </>
  );
}

function App() {
  return (
    <PrimeReactProvider
      value={{
        hideOverlaysOnDocumentScrolling: true,
        autoZIndex: true,
        appendTo: "self",
      }}
    >
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </PrimeReactProvider>
  );
}

export default App;