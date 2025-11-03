export default function ProfileSidebar({ profile }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center">
      <img
        src={profile.avatar}
        alt={profile.username}
        className="w-28 h-28 rounded-full border-4 border-white shadow mb-4"
      />
      <p className="text-gray-700 text-center mb-3">{profile.bio}</p>
      <div className="flex flex-wrap justify-center gap-2">
        {profile.skills.map((skill: string, i: number) => (
          <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
