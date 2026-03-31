import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import OAuthCallback from "./pages/OAuthCallback";
import ProtectedRoute from "./components/ProtectedRoute";
import ShelfMapPage from "./pages/ShelfMapPage";
import AlertsPage from "./pages/AlertsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import PlanogramPage from "./pages/PlanogramPage";
import CamerasPage from "./pages/CamerasPage";
import ProductsPage from "./pages/ProductsPage";
import ForecastingPage from "./pages/ForecastingPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

import { AuthProvider } from "./context/AuthContext";
import { AlertProvider } from "./context/AlertContext";
import { ThemeProvider } from "./context/ThemeContext";
import MainLayout from "./components/common/Layout/MainLayout";

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AlertProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/auth/callback" element={<OAuthCallback />} />
              
              {/* Protected Routes with Layout */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Dashboard />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shelf-map"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ShelfMapPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/alerts"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <AlertsPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <AnalyticsPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/planogram"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <PlanogramPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cameras"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <CamerasPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ProductsPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/forecasting"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ForecastingPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ReportsPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <SettingsPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* Catch-all and Home */}
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/not-found" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/not-found" />} />
            </Routes>
          </AlertProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
