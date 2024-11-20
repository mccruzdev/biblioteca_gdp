import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/modules/login/Login";
import ConfirmChangePassword from "./pages/auth/modules/confirm-change-password/confirm-change-password";
import ConfirmedEmail from "./pages/auth/modules/confirm-email/confirm-email";
import { Dashboard } from "./pages/auth/modules/dashboard/dashboard";
import Loan from "./pages/auth/modules/dashboard/loan/loan";
import LoanHistory from "./pages/auth/modules/dashboard/loan/loan-history/loan-history";
import Users from "./pages/auth/modules/dashboard/users/users";
import Management from "./pages/auth/modules/dashboard/management/management";
import AddBooks from "./pages/auth/modules/dashboard/add-books/add-books";
import DonationHistory from "./pages/auth/modules/dashboard/donation/donation-history/donation-history";
import DonatedBooks from "./pages/auth/modules/dashboard/donation/donated-books/donated-books";
import { Toaster } from "sonner";
import { DashboardPage } from "./pages/dashboard/page";
import { DashboardCatalog } from "./pages/dashboard/modules/pages/catalog/catalog";
import { DashboardLoan } from "./pages/dashboard/modules/pages/loan/loan";
import { DashboardAddBook } from "./pages/dashboard/modules/pages/add-books/add-books";
import { DashboardUsers } from "./pages/dashboard/modules/pages/users/users";
import { DashboardManagement } from "./pages/dashboard/modules/pages/management/management";
import { DashboardDonation } from "./pages/dashboard/modules/pages/donation/donation";
import { DashboardLoanHistory } from "./pages/dashboard/modules/pages/loan-history/loan-history";

export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/auth/confirm-email" element={<ConfirmedEmail />} />
          <Route
            path="/auth/confirm-change-password"
            element={<ConfirmChangePassword />}
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/loan" element={<Loan />} />
          <Route path="/dashboard/loan-history" element={<LoanHistory />} />
          <Route path="/dashboard/add-books" element={<AddBooks />} />
          <Route path="/dashboard/users" element={<Users />} />
          <Route path="/dashboard/management" element={<Management />} />
          <Route
            path="/dashboard/donation-history"
            element={<DonationHistory />}
          />
          <Route path="/dashboard/donated-books" element={<DonatedBooks />} />
          <Route path="/_dashboard" element={<DashboardPage />}>
            <Route path="" element={<DashboardCatalog />} />
            <Route path="loan" element={<DashboardLoan />} />
            <Route path="loan-history" element={<DashboardLoanHistory />} />
            <Route path="add-books" element={<DashboardAddBook />} />
            <Route path="users" element={<DashboardUsers />} />
            <Route path="management" element={<DashboardManagement />} />
            <Route path="donations" element={<DashboardDonation />} />
          </Route>
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}
