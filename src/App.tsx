import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Signin from './pages/Authpages/Signin';
import Signup from './pages/Authpages/Signup';
import Profile from './pages/userdashboardpages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/userdashboard/*" element={<UserDashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/profile/*" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
