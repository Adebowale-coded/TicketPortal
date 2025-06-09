import { Link } from 'react-router-dom';
import XIcon from '../assets/imgs/Icon.png';
import Home from '../assets/imgs/Home.png';
import Settings from '../assets/imgs/Settings.png';
import User from '../assets/imgs/User.png';
import Admin from '../assets/imgs/Admin.png';
import Tickets from '../pages/Admindashboardpages/Tickets';

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const role = localStorage.getItem("role"); // either 'admin' or 'user'

  return (
    <div className="flex h-screen overflow-hidden">
      <aside
        className={`${isOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed md:relative md:translate-x-0 transition-transform duration-300 ease-in-out bg-gray-900 text-white w-64 p-6 z-50 md:block`}
      >
        <div className="flex items-center justify-between md:justify-start mb-10">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <button onClick={() => setIsOpen(false)} className="md:hidden">
            <img src={XIcon} alt="Close" className="h-6 w-6" />
          </button>
        </div>

        <ul className="space-y-5">
          {/* Shared items */}
          <li>
            <Link to="/" className="flex items-center gap-3 py-2 px-4 rounded hover:bg-orange-500 transition-colors duration-200">
              <img src={Home} alt="Home" className="w-5 h-5" />
              <span>Home</span>
            </Link>
          </li>

          <li>
            <Link to="/profile" className="flex items-center gap-3 py-2 px-4 rounded hover:bg-orange-500 transition-colors duration-200">
              <img src={User} alt="Profile" className="w-5 h-5" />
              <span>Profile</span>
            </Link>
          </li>

          <li>
            <Link to="/settings" className="flex items-center gap-3 py-2 px-4 rounded hover:bg-orange-500 transition-colors duration-200">
              <img src={Settings} alt="Settings" className="w-5 h-5" />
              <span>Settings</span>
            </Link>
          </li>

          {/* User-only */}
          {role === 'user' && (
            <li>
              <Link to="/raise-ticket" className="flex items-center gap-3 py-2 px-4 rounded hover:bg-orange-500 transition-colors duration-200">
                <img src={User} alt="Raise Ticket" className="w-5 h-5" />
                <span>Raise Ticket</span>
              </Link>
            </li>
          )}

          {/* Admin-only */}
          {role === 'admin' && (
            <>
              <li>
                <Link to="/incidence-report" className="flex items-center gap-3 py-2 px-4 rounded hover:bg-orange-500 transition-colors duration-200">
                  <img src={Admin} alt="Incidence Report" className="w-5 h-5" />
                  <span>Incidence Report</span>
                </Link>
              </li>

              <li>
                <Link to="/Tickets" className="flex items-center gap-3 py-2 px-4 rounded hover:bg-orange-500 transition-colors duration-200">
                  <img src={Admin} alt="Tickets" className="w-5 h-5" />
                  <span>Tickets</span>
                </Link>
              </li>

              <li>
                <Link to="/admin-panel" className="flex items-center gap-3 py-2 px-4 rounded hover:bg-orange-500 transition-colors duration-200">
                  <img src={Admin} alt="Admin Panel" className="w-5 h-5" />
                  <span>Admin Panel</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};


export default Sidebar;
