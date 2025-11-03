import { FaUserPlus, FaCheck } from "react-icons/fa";

export default function ProfileHeader({ profile }: any) {
  return (
    <div className="flex justify-between items-center bg-white rounded-2xl p-6 shadow">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{profile.fullName}</h1>
        <p className="text-gray-600">@{profile.username}</p>
      </div>
      {!profile.isCurrentUser && (
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
          {profile.isFollowing ? <FaCheck /> : <FaUserPlus />}{" "}
          {profile.isFollowing ? "Following" : "Follow"}
        </button>
      )}
    </div>
  );
}
