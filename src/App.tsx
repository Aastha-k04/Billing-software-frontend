// import React, { useState } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// import DashboardPage from "./dashboard";
// import QuotationPage from "./quotation";
// import ItemsPage from "./Items";
// import AdminPage from "./admin";
// import Layout from "./Layout";
// import LoginForm from "./login";

// export default function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(true);

//   // Fake login for demo
//   const handleLogin = () => setIsLoggedIn(true);

//   // Protected route wrapper
//   const ProtectedRoute = ({ children }: any) => {
//     if (!isLoggedIn) {
//       return <Navigate to="/login" replace />;
//     }
//     return <Layout>{children}</Layout>;
//   };

//   return (
//     <Router>
//       <Routes>
//         {/* Login route */}
//         <Route path="/login" element={<LoginForm />} />

//         {/* Protected routes inside Layout */}
//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute>
//               <DashboardPage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/quotation"
//           element={
//             <ProtectedRoute>
//               <QuotationPage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/items"
//           element={
//             <ProtectedRoute>
//               <ItemsPage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/admin"
//           element={
//             <ProtectedRoute>
//               <AdminPage />
//             </ProtectedRoute>
//           }
//         />

//         {/* Default redirect */}
//         <Route
//           path="/"
//           element={
//             isLoggedIn ? (
//               <Navigate to="/dashboard" replace />
//             ) : (
//               <Navigate to="/login" replace />
//             )
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }


// App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import DashboardPage from "./pages/Dashboard";
import QuotationPage from "./pages/Quotation";
import ItemsPage from "./pages/Items";
import AdminPage from "./pages/Admin";
import Layout from "./components/Layout";
import LoginForm from "./pages/Login";
import SignupForm from "./pages/Signup";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Settings from "./pages/Settings";
import UserManagement from "./pages/User";
import QuantileLanding from "./pages/Landing";
import CustomerQuotations from "./pages/CustomerQuotations";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<QuantileLanding />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/quotation"
            element={
              <ProtectedRoute>
                <Layout>
                  <QuotationPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer-quotations"
            element={
              <ProtectedRoute>
                <Layout>
                  <CustomerQuotations />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/items"
            element={
              <ProtectedRoute>
                <Layout>
                  <ItemsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <Layout>
                  <UserManagement />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <Layout>
                  <AdminPage />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
