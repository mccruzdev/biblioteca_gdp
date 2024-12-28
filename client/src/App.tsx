import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/modules/login/Login";
import ConfirmChangePassword from "./pages/auth/modules/confirm-change-password/confirm-change-password";
import ConfirmedEmail from "./pages/auth/modules/confirm-email/confirm-email";
import { Toaster } from "./components/ui/toaster";
import { DashboardPage } from "./pages/dashboard/page";
import { DashboardCatalog } from "./pages/dashboard/modules/pages/catalog/catalog";
import { DashboardLoan } from "./pages/dashboard/modules/pages/loan/loan";
import { DashboardBooks } from "./pages/dashboard/modules/pages/books/books";
import { DashboardUsers } from "./pages/dashboard/modules/pages/users/users";
import { DashboardDonation } from "./pages/dashboard/modules/pages/donation/donation";
import { DashboardLoanHistory } from "./pages/dashboard/modules/pages/loan-history/loan-history";
import { DashboardDonors } from "./pages/dashboard/modules/pages/donors/donors";

export default function App() {
  return (
    <Router>
      <div className="App" id="app">
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
        <Toaster />
      </div>
    </Router>
  );
}
