import { Link } from 'react-router-dom';
import MenuIcon from '../assets/imgs/Burger.png';
import XIcon from '../assets/imgs/Icon.png';
import Home from '../assets/imgs/Home.png';
import Settings from '../assets/imgs/Settings.png';
import User from '../assets/imgs/User.png';
import Admin from '../assets/imgs/Admin.png';

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed md:relative md:translate-x-0 transition-transform duration-300 ease-in-out bg-gray-900 text-white w-64 p-6 z-50 md:block`}
      >
        {/* Logo / Title */}
        <div className="flex items-center justify-between md:justify-start mb-10">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <button onClick={() => setIsOpen(false)} className="md:hidden">
            <img src={XIcon} alt="Close" className="h-6 w-6" />
          </button>
        </div>

        {/* Nav Items */}
        <ul className="space-y-5">
          <li>
            <Link
              to="/"
              className="flex items-center gap-3 py-2 px-4 rounded hover:bg-orange-500 hover:text-white transition-colors duration-200"
            >
              <img src={Home} alt="Home" className="w-5 h-5" />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className="flex items-center gap-3 py-2 px-4 rounded hover:bg-orange-500 hover:text-white transition-colors duration-200"
            >
              <img src={User} alt="Profile" className="w-5 h-5" />
              <span>Profile</span>
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className="flex items-center gap-3 py-2 px-4 rounded hover:bg-orange-500 hover:text-white transition-colors duration-200"
            >
              <img src={Settings} alt="Settings" className="w-5 h-5" />
              <span>Settings</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin"
              className="flex items-center gap-3 py-2 px-4 rounded hover:bg-orange-500 hover:text-white transition-colors duration-200"
            >
              <img src={Admin} alt="Admin" className="w-5 h-5" />
              <span>Admin Panel</span>
            </Link>
          </li>
        </ul>
      </aside>

      {/* Overlay for mobile */}
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
