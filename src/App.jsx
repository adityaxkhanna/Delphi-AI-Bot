
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./pages/Dashboard/DashboardPage.jsx";
import Login from "./pages/auth/Login.jsx";

import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { loginRequest } from "./authConfig";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected dashboard */}
        <Route
          path="/dashboard/*"
          element={
            <MsalAuthenticationTemplate
              interactionType={InteractionType.Redirect}
              authenticationRequest={{
                ...loginRequest,
                // Force exact redirect URI Azure has registered (with trailing slash)
                redirectUri: "http://localhost:3000",
              }}
              loadingComponent={<div style={{ padding: 24 }}>Signing you in…</div>}
              errorComponent={({ error }) => (
                <div style={{ padding: 24, color: "crimson" }}>
                  Auth error: {error?.message}
                </div>
              )}
            >
              <DashboardPage />
            </MsalAuthenticationTemplate>
          }
        />

        {/* Fallback: redirect everything else to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
