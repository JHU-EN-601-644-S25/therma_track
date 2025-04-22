import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./LoginPage";
import PatientPage from "./PatientPage";
import DoctorPage from "./DoctorPage";
<<<<<<< HEAD
import LogsPage from "./LogsPage";
=======
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
import "./App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/patient/:status/:id" element={<PatientPage />} />
        <Route path="/doctor/:id" element={<DoctorPage />} />
<<<<<<< HEAD
        <Route path="/logs" element={<LogsPage />} />

=======
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
        {/* Default Route: Any undefined route will navigate to /home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
