import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import { LogOut, Settings, User, Menu, MessageSquareHeart } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <>
      <header className="fixed top-0 z-40 w-full border-b bg-base-100 border-base-300 backdrop-blur-lg bg-base-100/80">
        <div className="container h-16 px-4 mx-auto">
          <div className="flex items-center justify-between h-full">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="flex items-center justify-center rounded-lg size-9 bg-primary/10">
                <MessageSquareHeart className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">ZUNO</h1>
            </Link>
            <div className="md:hidden">
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle">
                  <Menu className="size-5" />
                </label>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52"
                >
                  <li>
                    <Link to={"/settings"}>Settings</Link>
                  </li>
                  {authUser && (
                    <>
                      <li>
                        <Link to="/profile">Profile</Link>
                      </li>
                      <li>
                        <button onClick={handleLogout}>Logout</button>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
      <nav className="fixed z-40 flex-col hidden gap-2 p-2 transition-all duration-300 -translate-y-1/2 border border-l-0 rounded-r-lg left-5 group md:flex top-1/2 border-base-300 bg-base-100/80 backdrop-blur-lg hover:shadow-lg">
        <Link
          to={"/settings"}
          className="flex items-center p-2 transition-colors rounded-lg hover:bg-base-200"
        >
          <Settings className="size-5 shrink-0" />
          <span className="w-0 overflow-hidden text-sm font-medium transition-all duration-300 opacity-0 group-hover:w-auto group-hover:opacity-100 group-hover:ml-3">
            Settings
          </span>
        </Link>

        {authUser && (
          <>
            <Link
              to="/profile"
              className="flex items-center p-2 transition-colors rounded-lg hover:bg-base-200"
            >
              <User className="size-5 shrink-0" />
              <span className="w-0 overflow-hidden text-sm font-medium transition-all duration-300 opacity-0 group-hover:w-auto group-hover:opacity-100 group-hover:ml-3">
                Profile
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center p-2 transition-colors rounded-lg hover:bg-base-200"
            >
              <LogOut className="size-5 shrink-0" />
              <span className="w-0 overflow-hidden text-sm font-medium transition-all duration-300 opacity-0 group-hover:w-auto group-hover:opacity-100 group-hover:ml-3">
                Logout
              </span>
            </button>
          </>
        )}
      </nav>
    </>
  );
};

export default Navbar;
