import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { RegisterPage } from "./features/auth/pages/RegisterPage";
import IncomeSourcePage from "./features/income-source/pages";
import { IncomeSourceDetail } from "./features/income-source/pages/IncomeSourceDetail";
import { DashboardPage } from "./features/dashboard/pages/DashboardPage";
import "./App.css";

/** 앱 루트 컴포넌트 — 라우팅 설정 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/income-sources" element={<IncomeSourcePage />} />
          <Route path="/income-sources/:id" element={<IncomeSourceDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
