import { useEffect } from "react";
import useSearchStore from "../store/useSearchStore.js";
import { X, Search, UserPlus } from "lucide-react";

const SearchModal = ({ isOpen, onClose }) => {
  const {
    searchQuery,
    searchResults,
    loading,
    setSearchQuery,
    searchUsers,
    sendFriendRequest,
    clearSearch,
  } = useSearchStore();

  useEffect(() => {
    const handler = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery, searchUsers]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(clearSearch, 300);
    }
  }, [isOpen, clearSearch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-base-100">
      <div className="flex items-center gap-2 p-4 border-b border-base-300">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 flex items-center pl-3 pointer-events-none start-0">
            <Search className="size-5 text-base-content/50" />
          </div>
          <input
            type="text"
            placeholder="Search users by name or username..."
            className="w-full pl-10 input input-bordered"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>
        <button className="btn btn-ghost btn-circle" onClick={onClose}>
          <X className="size-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ul className="py-2 menu">
          {loading && (
            <li className="px-4 py-2 text-sm text-center menu-title">
              <span>Loading...</span>
            </li>
          )}
          {!loading && searchResults.length === 0 && searchQuery && (
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
                      <div className="w-10 rounded-full">
                        <img
                          src={user.profilePic || "/avatar.png"}
                          alt="user avatar"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold">{user.username}</p>
                      <p className="text-sm text-base-content/70">
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
    </div>
  );
};

export default SearchModal;
