import { Link, useNavigate } from 'react-router-dom';
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

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <aside
        className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        fixed md:relative md:translate-x-0 transition-transform duration-300 ease-in-out 
        bg-gradient-to-b from-slate-800 via-slate-700 to-slate-600 text-white w-64 z-50 h-full
        shadow-2xl border-r border-slate-600/50 backdrop-blur-sm flex flex-col`}
      >
        {/* Header with gradient overlay */}
        <div className="relative bg-gradient-to-r from-orange-600/20 to-orange-500/10 p-6 mb-2">
          <div className="flex justify-between md:justify-start items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <h2 className="font-bold text-xl bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
                Alpha Desk
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              <img src={Menubtn} alt="Close" className="w-5 h-5" />
            </button>
          </div>
          {/* Decorative line */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
        </div>

        {/* Navigation Menu */}
        <nav className="px-4 pb-6 flex-1">
          <ul className="space-y-2">
            <li>
              <Link
                to={role === 'user' ? '/UserDashboard' : '/admin'}
                className="group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 
                hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-orange-600/20 
                hover:shadow-lg hover:shadow-orange-500/10 hover:scale-105 hover:translate-x-1
                border border-transparent hover:border-orange-500/30"
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700/50 group-hover:bg-orange-500/20 transition-colors duration-200">
                  <img src={Home} alt="Home" className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                </div>
                <span className="font-medium group-hover:text-orange-300 transition-colors duration-200">Home</span>
              </Link>
            </li>

            <li>
              <Link
                to="/profile"
                className="group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 
                hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-orange-600/20 
                hover:shadow-lg hover:shadow-orange-500/10 hover:scale-105 hover:translate-x-1
                border border-transparent hover:border-orange-500/30"
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700/50 group-hover:bg-orange-500/20 transition-colors duration-200">
                  <img src={User} alt="Profile" className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                </div>
                <span className="font-medium group-hover:text-orange-300 transition-colors duration-200">Profile</span>
              </Link>
            </li>

            <li>
              <Link
                to="/settings"
                className="group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 
                hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-orange-600/20 
                hover:shadow-lg hover:shadow-orange-500/10 hover:scale-105 hover:translate-x-1
                border border-transparent hover:border-orange-500/30"
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700/50 group-hover:bg-orange-500/20 transition-colors duration-200">
                  <img src={Settings} alt="Settings" className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                </div>
                <span className="font-medium group-hover:text-orange-300 transition-colors duration-200">Settings</span>
              </Link>
            </li>

            {role === 'user' && (
              <>
                {/* Divider for user-specific items */}
                <li className="py-2">
                  <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                </li>
                <li>
                  <Link
                    to="/raiseticket"
                    className="group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 
                    hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-orange-600/20 
                    hover:shadow-lg hover:shadow-orange-500/10 hover:scale-105 hover:translate-x-1
                    border border-transparent hover:border-orange-500/30"
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700/50 group-hover:bg-orange-500/20 transition-colors duration-200">
                      <img src={Incidenceicon} alt="Raise Ticket" className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    </div>
                    <span className="font-medium group-hover:text-orange-300 transition-colors duration-200">Raise Ticket</span>
                  </Link>
                </li>
              </>
            )}

            {role === 'admin' && (
              <>
                {/* Divider for admin-specific items */}
                <li className="py-2">
                  <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                  <div className="text-xs text-slate-400 mt-3 mb-2 px-4 uppercase tracking-wider font-semibold">
                    Admin Tools
                  </div>
                </li>
                <li>
                  <Link
                    to="/incidence-report"
                    className="group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 
                    hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-orange-600/20 
                    hover:shadow-lg hover:shadow-orange-500/10 hover:scale-105 hover:translate-x-1
                    border border-transparent hover:border-orange-500/30"
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700/50 group-hover:bg-orange-500/20 transition-colors duration-200">
                      <img src={Admin} alt="Incidence Report" className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    </div>
                    <span className="font-medium group-hover:text-orange-300 transition-colors duration-200">Incidence Report</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Tickets"
                    className="group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 
                    hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-orange-600/20 
                    hover:shadow-lg hover:shadow-orange-500/10 hover:scale-105 hover:translate-x-1
                    border border-transparent hover:border-orange-500/30"
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700/50 group-hover:bg-orange-500/20 transition-colors duration-200">
                      <img src={ticketicon} alt="Tickets" className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    </div>
                    <span className="font-medium group-hover:text-orange-300 transition-colors duration-200">Tickets</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin-panel"
                    className="group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 
                    hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-orange-600/20 
                    hover:shadow-lg hover:shadow-orange-500/10 hover:scale-105 hover:translate-x-1
                    border border-transparent hover:border-orange-500/30"
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700/50 group-hover:bg-orange-500/20 transition-colors duration-200">
                      <img src={Admin} alt="Admin Panel" className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    </div>
                    <span className="font-medium group-hover:text-orange-300 transition-colors duration-200">Admin Panel</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="px-4 pb-6 mt-auto">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-4"></div>
          <button
            onClick={handleLogout}
            className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 
            hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-600/20 
            hover:shadow-lg hover:shadow-red-500/10 hover:scale-105 hover:translate-x-1
            border border-transparent hover:border-red-500/30"
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700/50 group-hover:bg-red-500/20 transition-colors duration-200">
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>
            <span className="font-medium group-hover:text-red-300 transition-colors duration-200">Logout</span>
          </button>
        </div>

        {/* Bottom decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600 opacity-30"></div>
      </aside>

      {/* Enhanced Mobile overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;