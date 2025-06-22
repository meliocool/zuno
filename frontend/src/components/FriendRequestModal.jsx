import useFriendRequestStore from "../store/useFriendRequestStore";
import { Check, X } from "lucide-react";

const FriendRequestsModal = ({ isOpen, onClose }) => {
  const { requests, loading, respondToRequest } = useFriendRequestStore();

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="w-11/12 max-w-lg modal-box">
        <h3 className="text-lg font-bold">Friend Requests</h3>
        <button
          className="absolute btn btn-sm btn-circle btn-ghost top-2 right-2"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="py-4 space-y-4">
          {loading && (
            <div className="text-center">
              <span className="loading loading-spinner"></span>
            </div>
          )}
          {!loading && requests.length === 0 && (
            <p className="text-center text-base-content/70">
              You have no pending friend requests.
            </p>
          )}
          {!loading &&
            requests.map((request) => (
              <div
                key={request._id}
                className="flex items-center justify-between p-2 rounded-lg bg-base-200"
              >
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <img
                        src={
                          request.requester.profilePic || "/default-avatar.png"
                        }
                        alt="avatar"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">
                      {request.requester.username}
                    </p>
                    <p className="text-xs text-base-content/70">
                      {request.requester.fullName}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn btn-sm btn-success btn-circle"
                    onClick={() => respondToRequest(request._id, "accepted")}
                  >
                    <Check className="size-4" />
                  </button>
                  <button
                    className="btn btn-sm btn-error btn-circle"
                    onClick={() => respondToRequest(request._id, "declined")}
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>
            ))}
        </div>
        <div className="hidden modal-action sm:flex">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default FriendRequestsModal;
