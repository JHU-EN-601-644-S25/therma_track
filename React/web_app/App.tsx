import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./LoginPage";
import PatientPage from "./PatientPage";
import DoctorPage from "./DoctorPage";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/patient/:status/:id" element={<PatientPage />} />
        <Route path="/doctor/:id" element={<DoctorPage />} />
        {/* Default Route: Any undefined route will navigate to /home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
