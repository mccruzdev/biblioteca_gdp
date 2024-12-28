import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { Suspense } from "react";
import { Toaster } from "./components/ui/toaster";

const Login = React.lazy(() => import("./pages/auth/modules/login/Login"));
const ConfirmChangePassword = React.lazy(
  () =>
    import(
      "./pages/auth/modules/confirm-change-password/confirm-change-password"
    )
);
const ConfirmedEmail = React.lazy(
  () => import("./pages/auth/modules/confirm-email/confirm-email")
);
const DashboardPage = React.lazy(() => import("./pages/dashboard/page"));
const DashboardCatalog = React.lazy(
  () => import("./pages/dashboard/modules/pages/catalog/catalog")
);
const DashboardLoan = React.lazy(
  () => import("./pages/dashboard/modules/pages/loan/loan")
);
const DashboardBooks = React.lazy(
  () => import("./pages/dashboard/modules/pages/books/books")
);
const DashboardUsers = React.lazy(
  () => import("./pages/dashboard/modules/pages/users/users")
);
const DashboardDonation = React.lazy(
  () => import("./pages/dashboard/modules/pages/donation/donation")
);
const DashboardLoanHistory = React.lazy(
  () => import("./pages/dashboard/modules/pages/loan-history/loan-history")
);
const DashboardDonors = React.lazy(
  () => import("./pages/dashboard/modules/pages/donors/donors")
);

export default function App() {
  return (
    <Router>
      <div className="App" id="app">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/auth/confirm-email" element={<ConfirmedEmail />} />
            <Route
              path="/auth/confirm-change-password"
              element={<ConfirmChangePassword />}
            />
            <Route path="/dashboard" element={<DashboardPage />}>
              <Route path="" element={<DashboardCatalog />} />
              <Route path="loan" element={<DashboardLoan />} />
              <Route path="loan-history" element={<DashboardLoanHistory />} />
              <Route path="books" element={<DashboardBooks />} />
              <Route path="users" element={<DashboardUsers />} />
              <Route path="donations" element={<DashboardDonation />} />
              <Route path="donors" element={<DashboardDonors />} />
            </Route>
          </Routes>
        </Suspense>
        <Toaster />
      </div>
    </Router>
  );
}
