import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

const useSearchStore = create((set) => ({
  searchQuery: "",
  searchResults: [],
  loading: false,

  setSearchQuery: (query) => set({ searchQuery: query }),
  clearSearch: () => set({ searchQuery: "", searchResults: [] }),

  searchUsers: async (query) => {
    if (query.trim() === "") {
      set({ searchResults: [], loading: false });
      return;
    }
    set({ loading: true });
    try {
      const response = await axiosInstance.get(`/message/search/${query}`);
      set({ searchResults: response.data });
    } catch (error) {
      const errorMessage = error.response.data.error || "Failed to Search!";
      toast.error(errorMessage);
      set({ searchResults: [] });
    } finally {
      set({ loading: false });
    }
  },
  sendFriendRequest: async (recipientId) => {
    try {
      const response = await axiosInstance.post(`/friends/send/${recipientId}`);
      toast.success(response.data.message || "Friend request sent!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Could not send friend request.";
      toast.error(errorMessage);
    }
  },
}));

export default useSearchStore;
