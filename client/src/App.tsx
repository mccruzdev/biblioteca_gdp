import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/modules/login/Login";
import ConfirmChangePassword from "./pages/auth/modules/confirm-change-password/confirm-change-password";
import { Toaster } from "sonner";

export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/auth/confirm-change-password" element={<ConfirmChangePassword />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}
