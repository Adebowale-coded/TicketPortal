import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Signin from './pages/Authpages/Signin';
import Signup from './pages/Authpages/Signup';
import Profile from './pages/userdashboardpages/Profile';
import Tickets from './pages/Admindashboardpages/Tickets';
import RaiseTicket from './pages/userdashboardpages/RaiseTicket';
import IncidenceReport from './pages/Admindashboardpages/IncidenceReport';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/Tickets" element={<Tickets />} />
        <Route path="/raiseticket" element={<RaiseTicket />} />
        <Route path="/incidence-report" element={<IncidenceReport />} />
      </Routes>

      
    </Router>
  );
}

export default App;
