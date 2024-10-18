import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/modules/login/Login";
import ConfirmChangePassword from "./pages/auth/modules/confirm-change-password/confirm-change-password";
import ConfirmedEmail from "./pages/auth/modules/confirm-email/confirm-email";
import { Toaster } from "sonner";

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
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}
