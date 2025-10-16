
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../../components/Dashboard/Dashboard.jsx";
import Chat from "../../components/Dashboard/Chat/Chat.jsx";
import Documents from "../../components/Dashboard/Documents/Documents.jsx";

export default function DashboardPage() {
  return (
    <Dashboard>
      <Routes>
        {/* Default child route -> /dashboard/chat */}
        <Route index element={<Navigate to="chat" replace />} />
        <Route path="chat" element={<Chat />} />
        <Route path="documents" element={<Documents />} />
      </Routes>
    </Dashboard>
  );
}
