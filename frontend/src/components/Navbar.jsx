import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import {
  LogOut,
  Settings,
  User,
  Menu,
  MessageSquareHeart,
  UserPlus,
  Search,
} from "lucide-react";
import useDebounce from "../hooks/useDebounce.js";
import useSearchStore from "../store/useSearchStore.js";
import { useEffect } from "react";
import useFriendRequestStore from "../store/useFriendRequestStore.js";
import { useState } from "react";
import FriendRequestsModal from "./FriendRequestModal.jsx";
import SearchModal from "./SearchModal.jsx";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const {
    searchQuery,
    searchResults,
    loading,
    setSearchQuery,
    searchUsers,
    sendFriendRequest,
    clearSearch,
  } = useSearchStore();
  const { requests } = useFriendRequestStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    searchUsers(debouncedSearchQuery);
  }, [debouncedSearchQuery, searchUsers]);

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
            <div className="flex items-center gap-4">
              <div
                className="relative hidden md:block"
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) clearSearch();
                }}
              >
                <div className="absolute inset-y-0 flex items-center pl-3 pointer-events-none start-0">
                  <Search className="size-4 text-base-content/50" />
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full max-w-xs pl-10 input input-bordered input-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery.trim() && (
                  <div className="absolute z-50 w-full mt-2 rounded-lg shadow-xl bg-base-200">
                    <ul className="py-2 overflow-y-auto menu max-h-80">
                      {loading && (
                        <li className="px-4 py-2 text-sm text-center menu-title">
                          <span>Loading...</span>
                        </li>
                      )}
                      {!loading &&
                        searchResults.length === 0 &&
                        debouncedSearchQuery && (
                          <li className="px-4 py-2 text-sm text-center menu-title">
                            <span>No users found.</span>
                          </li>
                        )}
                      {!loading &&
                        searchResults.map((user) => (
                          <li key={user._id}>
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-3">
                                <div className="avatar">
                                  <div className="w-8 rounded-full">
                                    <img
                                      src={user.profilePic || "/avatar.png"}
                                      alt="user avatar"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <p className="font-semibold">
                                    {user.username}
                                  </p>
                                  <p className="text-xs text-base-content/70">
                                    {user.fullName}
                                  </p>
                                </div>
                              </div>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => sendFriendRequest(user._id)}
                              >
                                <UserPlus className="size-4" />
                              </button>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="btn btn-ghost btn-circle md:hidden"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="size-5" />
                </button>
                <div className="dropdown dropdown-end md:hidden">
                  <label tabIndex={0} className="btn btn-ghost btn-circle">
                    <Menu className="size-5" />
                  </label>
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52"
                  >
                    <li>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex justify-between"
                      >
                        Friend Requests
                        {requests.length > 0 && (
                          <div className="badge badge-secondary">
                            {requests.length}
                          </div>
                        )}
                      </button>
                    </li>
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
        </div>
      </header>
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <nav className="fixed z-40 flex-col hidden gap-2 p-2 transition-all duration-300 -translate-y-1/2 border border-l-0 rounded-r-lg left-5 group md:flex top-1/2 border-base-300 bg-base-100/80 backdrop-blur-lg hover:shadow-lg">
        <button
          onClick={() => setIsModalOpen(true)}
          className="relative flex items-center p-2 pl-2.5 transition-colors rounded-lg hover:bg-base-200"
        >
          <UserPlus className="size-5 shrink-0" />
          {requests.length > 0 && (
            <span className="absolute top-0 right-0 indicator-item badge badge-secondary badge-xs">
              {requests.length}
            </span>
          )}
          <span className="w-0 overflow-hidden text-sm font-medium transition-all duration-300 opacity-0 group-hover:w-auto group-hover:opacity-100 group-hover:ml-3">
            Requests
          </span>
        </button>
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
      <FriendRequestsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
