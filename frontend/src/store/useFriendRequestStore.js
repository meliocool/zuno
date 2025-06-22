import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

const useFriendRequestStore = create((set) => ({
  requests: [],
  loading: false,
  fetchRequests: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get("/friends/pending");
      set({ requests: response.data });
    } catch (error) {
      toast.error(error.response.data.error || "Failed to Fetch Requests");
    } finally {
      set({ loading: false });
    }
  },

  respondToRequest: async (friendshipId, response) => {
    try {
      await axiosInstance.put(`/friends/respond/${friendshipId}`, { response });

      toast.success(`Request ${response}!`);
      set((state) => ({
        requests: state.requests.filter((r) => r._id !== friendshipId),
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Action failed.";
      toast.error(errorMessage);
    }
  },
}));

export default useFriendRequestStore;
