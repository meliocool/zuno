import { AtSign, Camera, Loader2, Mail, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    fullName: authUser.fullName || "",
    username: authUser.username || "",
    profilePic: "",
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      setFormData((prev) => ({ ...prev, profilePic: base64Image }));
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateProfile(formData);
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl p-4 py-8 mx-auto">
        <div className="p-6 space-y-5 bg-base-300 rounded-xl">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your Account Information</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={selectedImage || authUser.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="object-cover border-4 rounded-full size-32"
                />
                <label
                  htmlFor="avatar-upload"
                  className={`
                absolute bottom-0 right-0
                bg-base-content hover:scale-105
                p-2 rounded-full cursor-pointer
                transition-all duration-200
                ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
                >
                  <Camera className="w-5 h-5 text-base-200" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
              <p className="text-sm text-zinc-400">
                {isUpdatingProfile
                  ? "Uploading..."
                  : "Click the camera icon to update your profile picture"}
              </p>
            </div>
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="label">
                  <span className="font-medium label-text">Full Name</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type="text"
                    className={`input input-bordered w-full pl-10`}
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="label">
                  <span className="font-medium label-text">Username</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <AtSign className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type="text"
                    className={`input input-bordered w-full pl-10`}
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="label">
                  <span className="font-medium label-text">Email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type="email"
                    className={`input input-bordered w-full pl-10`}
                    value={authUser.email}
                    disabled
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full btn btn-primary"
                disabled={isUpdatingProfile}
              >
                {isUpdatingProfile ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Update Profile"
                )}
              </button>
            </div>
          </form>
        </div>
        <div className="p-6 mt-6 bg-base-300 rounded-xl">
          <h2 className="mb-4 text-lg font-medium">Account Informatiom</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-zinc-700">
              <span>Member Since</span>
              <span>{authUser.createdAt?.split("T")[0]}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Account Status</span>
              <span className="text-green-500">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
