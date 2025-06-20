import { Link } from 'react-router-dom';
import Home from '../assets/imgs/Home.png';
import Settings from '../assets/imgs/Settings.png';
import User from '../assets/imgs/User.png';
import Admin from '../assets/imgs/Admin.png';
import Menubtn from '../assets/imgs/Menubtn.png';
import ticketicon from '../assets/imgs/ticket.png';
import Incidenceicon from '../assets/imgs/Audit.png'

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const role = localStorage.getItem("role") as 'user' | 'admin';

  return (
    <>
      <aside
        className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        fixed md:relative md:translate-x-0 transition-transform duration-300 ease-in-out 
        bg-gray-900 text-white w-64 p-6 z-50 h-full`}
      >
        <div className="flex justify-between md:justify-start items-center mb-10">
          <h2 className="font-bold text-2xl">Dashboard</h2>
          <button onClick={() => setIsOpen(false)} className="md:hidden">
            <img src={Menubtn} alt="Close" className="w-6 h-6" />
          </button>
        </div>

        <ul className="space-y-5">
          <li>
            <Link to={role === 'user' ? '/UserDashboard' : '/admin'} className="flex items-center gap-3 hover:bg-orange-500 px-4 py-2 rounded transition-colors duration-200">
              <img src={Home} alt="Home" className="w-5 h-5" />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/profile" className="flex items-center gap-3 hover:bg-orange-500 px-4 py-2 rounded transition-colors duration-200">
              <img src={User} alt="Profile" className="w-5 h-5" />
              <span>Profile</span>
            </Link>
          </li>
          <li>
            <Link to="/settings" className="flex items-center gap-3 hover:bg-orange-500 px-4 py-2 rounded transition-colors duration-200">
              <img src={Settings} alt="Settings" className="w-5 h-5" />
              <span>Settings</span>
            </Link>
          </li>

          {role === 'user' && (
            <li>
              <Link to="/raiseticket" className="flex items-center gap-3 hover:bg-orange-500 px-4 py-2 rounded transition-colors duration-200">
                <img src={Incidenceicon} alt="Raise Ticket" className="w-5 h-5" />
                <span>Raise Ticket</span>
              </Link>
            </li>
          )}

          {role === 'admin' && (
            <>
              <li>
                <Link to="/incidence-report" className="flex items-center gap-3 hover:bg-orange-500 px-4 py-2 rounded transition-colors duration-200">
                  <img src={Admin} alt="Incidence Report" className="w-5 h-5" />
                  <span>Incidence Report</span>
                </Link>
              </li>
              <li>
                <Link to="/Tickets" className="flex items-center gap-3 hover:bg-orange-500 px-4 py-2 rounded transition-colors duration-200">
                  <img src={ticketicon} alt="Tickets" className="w-5 h-5" />
                  <span>Tickets</span>
                </Link>
              </li>
              <li>
                <Link to="/admin-panel" className="flex items-center gap-3 hover:bg-orange-500 px-4 py-2 rounded transition-colors duration-200">
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
          className="md:hidden fixed inset-0 bg-black opacity-40 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
