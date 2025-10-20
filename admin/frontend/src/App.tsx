import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ElectionControl from "./pages/ElectionControl";
import CandidateManagement from "./pages/CandidateManagement";
import RealTimeResults from "./pages/Results";
import AdminSignup from "./pages/Register";
import AddStudents from "./pages/AddStudents";
import DeleteStudents from "./pages/DelStudents";
import ElectionList from "./pages/ElectionList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/delStud" element={<DeleteStudents />} />
        <Route path="/addStud" element={<AddStudents />} />
        <Route path="/register" element={<AdminSignup />} />
        <Route path="/admDash" element={<AdminDashboard />} />
        <Route path="/control" element={<ElectionControl />} />
        <Route path="/eleLst" element={<ElectionList />} />
        <Route path="/addEle" element={<CandidateManagement/>} />
        <Route path="/res" element={<RealTimeResults />} />
        <Route path="*" element={<Login />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
