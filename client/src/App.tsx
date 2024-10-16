import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/modules/login/Login";
import { Toaster } from "sonner";

export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}
