// app/profile/[username]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/app/dashboard/layout";
import { 
  FaUser, FaTrophy, FaCode, FaEdit, FaSave, FaTimes, FaChartLine, 
  FaCalendarAlt, FaMedal, FaGithub, FaTwitter, FaLinkedin, FaGlobe, 
  FaMapMarkerAlt, FaEnvelope, FaUserPlus, FaCheck, FaStar, FaShare 
} from "react-icons/fa";

interface UserStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  totalXP: number;
  rank: number;
  correctAnswers: number;
  averageTime: string;
  streak: number;
  joinedDate: string;
}

interface SocialLinks {
  github?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
}

interface UserProfile {
  id: number;
  username: string;
  fullName: string;
  email: string;
  bio: string;
  country: string;
  city: string;
  avatar: string;
  skills: string[];
  stats: UserStats;
  socialLinks: SocialLinks;
  isCurrentUser: boolean;
  isFriend: boolean;
  isFollowing: boolean;
}

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [isEditing, setIsEditing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  const [profile, setProfile] = useState<UserProfile>({
    id: 1,
    username: "coder123",
    fullName: "Alex Johnson",
    email: "alex.johnson@example.com",
    bio: "Full-stack developer passionate about React, Node.js, and competitive programming. Always learning new technologies!",
    country: "United States",
    city: "San Francisco, CA",
    avatar: "https://i.pravatar.cc/150?img=1",
    skills: ["JavaScript", "React", "Node.js", "Python", "TypeScript", "CSS"],
    stats: {
      gamesPlayed: 42,
      wins: 28,
      losses: 14,
      winRate: 67,
      totalXP: 3250,
      rank: 15,
      correctAnswers: 136,
      averageTime: "12.4s",
      streak: 5,
      joinedDate: "2023-06-15"
    },
    socialLinks: {
      github: "https://github.com/coder123",
      twitter: "https://twitter.com/coder123",
      linkedin: "https://linkedin.com/in/coder123",
      website: "https://alexjohnson.dev"
    },
    isCurrentUser: true,
    isFriend: false,
    isFollowing: false
  });

  const [badges, setBadges] = useState<Badge[]>([
    { id: 1, name: "First Win", description: "Win your first game", icon: "🥇", earned: true, earnedDate: "2023-10-15", rarity: "common" },
    { id: 2, name: "Code Master", description: "Answer 100 questions correctly", icon: "💻", earned: true, earnedDate: "2023-11-20", rarity: "rare" },
    { id: 3, name: "Speed Demon", description: "Average under 10s per question", icon: "⚡", earned: false, rarity: "epic" },
    { id: 4, name: "Unbeatable", description: "Win 10 games in a row", icon: "🏆", earned: false, rarity: "legendary" },
    { id: 5, name: "JavaScript Expert", description: "Master JavaScript questions", icon: "📜", earned: true, earnedDate: "2023-12-05", rarity: "rare" },
    { id: 6, name: "Python Guru", description: "Master Python questions", icon: "🐍", earned: false, rarity: "epic" },
    { id: 7, name: "Streak Master", description: "Maintain a 7-day streak", icon: "🔥", earned: true, earnedDate: "2023-11-28", rarity: "common" },
    { id: 8, name: "Community Contributor", description: "Help other users 10 times", icon: "🤝", earned: true, earnedDate: "2023-12-12", rarity: "rare" },
  ]);

  useEffect(() => {
    // In a real app, you would fetch profile data based on the username parameter
    if (username !== profile.username) {
      // Simulate fetching another user's profile
      const mockOtherUser: UserProfile = {
        ...profile,
        username: username,
        fullName: "Sarah Miller",
        isCurrentUser: false,
        isFriend: true,
        isFollowing: true,
        avatar: "https://i.pravatar.cc/150?img=2",
        city: "New York, NY",
        bio: "Software engineer at TechCorp. Love solving complex problems and participating in coding competitions.",
        skills: ["Java", "Spring Boot", "SQL", "AWS", "Docker"],
        stats: {
          ...profile.stats,
          gamesPlayed: 67,
          wins: 45,
          losses: 22,
          winRate: 67,
          totalXP: 4870,
          rank: 8,
          correctAnswers: 210,
          averageTime: "11.2s",
          streak: 3,
        }
      };
      setProfile(mockOtherUser);
      setIsFollowing(true);
      setIsFriend(true);
    }
  }, [username]);

  const handleSave = () => {
    // In a real app, you would save to an API
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
    // In a real app, you would update via API
  };

  const toggleFriend = () => {
    setIsFriend(!isFriend);
    // In a real app, you would update via API
  };

  const earnedBadges = badges.filter(badge => badge.earned);
  const lockedBadges = badges.filter(badge => !badge.earned);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "border-gray-300 bg-gray-50";
      case "rare": return "border-blue-300 bg-blue-50";
      case "epic": return "border-purple-300 bg-purple-50";
      case "legendary": return "border-yellow-300 bg-yellow-50";
      default: return "border-gray-300 bg-gray-50";
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600">
              {profile.isCurrentUser ? "Manage your profile and stats" : `Viewing ${profile.username}'s profile`}
            </p>
          </div>
          
          {!profile.isCurrentUser && (
            <div className="flex gap-3">
              <button 
                onClick={toggleFollow}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${isFollowing ? "bg-gray-200 text-gray-800" : "bg-blue-600 text-white"} transition-colors`}
              >
                {isFollowing ? <FaCheck size={14} /> : <FaUserPlus size={14} />}
                {isFollowing ? "Following" : "Follow"}
              </button>
              <button 
                onClick={toggleFriend}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${isFriend ? "bg-green-600 text-white" : "bg-gray-200 text-gray-800"} transition-colors`}
              >
                {isFriend ? <FaCheck size={14} /> : <FaUserPlus size={14} />}
                {isFriend ? "Friends" : "Add Friend"}
              </button>
              <button className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 flex items-center gap-2 transition-colors hover:bg-gray-300">
                <FaShare size={14} /> Share
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <img
                    src={profile.avatar}
                    alt={profile.username}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  {profile.isCurrentUser && isEditing && (
                    <button className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 transition-colors">
                      <FaEdit size={14} />
                    </button>
                  )}
                </div>
                
                {isEditing ? (
                  <div className="w-full space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                      <input
                        type="text"
                        value={profile.username}
                        onChange={(e) => setProfile({...profile, username: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profile.fullName}
                        onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea
                        value={profile.bio}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleSave}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                      >
                        <FaSave size={14} /> Save
                      </button>
                      <button 
                        onClick={handleCancel}
                        className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-300 transition-colors"
                      >
                        <FaTimes size={14} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-semibold text-gray-900">{profile.fullName}</h2>
                    <p className="text-gray-600 mb-2">@{profile.username}</p>
                    
                    <div className="flex items-center gap-1 text-gray-600 mb-4">
                      <FaMapMarkerAlt size={12} />
                      <span className="text-sm">{profile.city}, {profile.country}</span>
                    </div>
                    
                    <p className="text-gray-700 text-center mb-6">{profile.bio}</p>
                    
                    {profile.isCurrentUser && (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors mb-6"
                      >
                        <FaEdit size={14} /> Edit Profile
                      </button>
                    )}
                    
                    {/* Social Links */}
                    <div className="w-full mb-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Social Links</h3>
                      <div className="flex justify-center gap-3">
                        {profile.socialLinks.github && (
                          <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 transition-colors">
                            <FaGithub size={20} />
                          </a>
                        )}
                        {profile.socialLinks.twitter && (
                          <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600 transition-colors">
                            <FaTwitter size={20} />
                          </a>
                        )}
                        {profile.socialLinks.linkedin && (
                          <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors">
                            <FaLinkedin size={20} />
                          </a>
                        )}
                        {profile.socialLinks.website && (
                          <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 transition-colors">
                            <FaGlobe size={20} />
                          </a>
                        )}
                        {!profile.socialLinks.github && !profile.socialLinks.twitter && 
                         !profile.socialLinks.linkedin && !profile.socialLinks.website && (
                          <span className="text-gray-500 text-sm">No social links added</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Contact Button for other users */}
                    {!profile.isCurrentUser && (
                      <button className="w-full bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors mb-4">
                        <FaEnvelope size={14} /> Send Message
                      </button>
                    )}
                    
                    {/* Skills */}
                    <div className="w-full">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Skills & Technologies</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Rank Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Rank & Stats</h3>
                <FaTrophy className="text-yellow-500" />
              </div>
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-gray-900 mb-2">#{profile.stats.rank}</div>
                <div className="text-gray-600">Global Leaderboard</div>
                <div className="mt-4 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" 
                    style={{ width: `${100 - profile.stats.rank}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>#1</span>
                  <span>#100</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Joined</span>
                  <span className="font-medium">{new Date(profile.stats.joinedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Streak</span>
                  <span className="font-medium flex items-center gap-1">
                    {profile.stats.streak} days <FaStar className="text-yellow-500" />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total XP</span>
                  <span className="font-medium">{profile.stats.totalXP}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats and Badges */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl shadow-lg mb-6">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "overview" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("stats")}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "stats" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                >
                  Statistics
                </button>
                <button
                  onClick={() => setActiveTab("badges")}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "badges" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                >
                  Badges
                </button>
                <button
                  onClick={() => setActiveTab("activity")}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "activity" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                >
                  Activity
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Stats Overview */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl text-center">
                      <div className="text-2xl font-bold text-blue-600">{profile.stats.gamesPlayed}</div>
                      <div className="text-sm text-gray-600">Games Played</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl text-center">
                      <div className="text-2xl font-bold text-green-600">{profile.stats.wins}</div>
                      <div className="text-sm text-gray-600">Wins</div>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-xl text-center">
                      <div className="text-2xl font-bold text-amber-600">{profile.stats.winRate}%</div>
                      <div className="text-sm text-gray-600">Win Rate</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl text-center">
                      <div className="text-2xl font-bold text-purple-600">{profile.stats.correctAnswers}</div>
                      <div className="text-sm text-gray-600">Correct Answers</div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <FaChartLine className="text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Average Response Time</span>
                      </div>
                      <div className="text-xl font-bold text-gray-900">{profile.stats.averageTime}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <FaCode className="text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Favorite Language</span>
                      </div>
                      <div className="text-xl font-bold text-gray-900">JavaScript</div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Won against Bot (Intermediate)</p>
                          <p className="text-xs text-gray-500">10 minutes ago</p>
                        </div>
                      </div>
                      <span className="text-green-600 font-medium">+25 XP</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaCode className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Completed JavaScript Challenge</p>
                          <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                      </div>
                      <span className="text-blue-600 font-medium">+15 XP</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Lost against SarahM</p>
                          <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                      </div>
                      <span className="text-red-600 font-medium">-10 XP</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "stats" && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Detailed Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-medium text-gray-900 mb-3">Performance by Category</h4>
                    <div className="space-y-3">
                      {[
                        { category: "JavaScript", correct: 42, total: 50, percentage: 84 },
                        { category: "Python", correct: 38, total: 50, percentage: 76 },
                        { category: "Algorithms", correct: 32, total: 50, percentage: 64 },
                        { category: "Data Structures", correct: 28, total: 50, percentage: 56 },
                        { category: "System Design", correct: 22, total: 50, percentage: 44 },
                      ].map((item, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{item.category}</span>
                            <span>{item.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-medium text-gray-900 mb-3">Weekly Activity</h4>
                    <div className="flex items-end justify-between h-40">
                      {[
                        { day: "Mon", value: 65 },
                        { day: "Tue", value: 45 },
                        { day: "Wed", value: 75 },
                        { day: "Thu", value: 35 },
                        { day: "Fri", value: 90 },
                        { day: "Sat", value: 60 },
                        { day: "Sun", value: 80 },
                      ].map((item, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div 
                            className="w-8 bg-blue-500 rounded-t transition-all hover:bg-blue-600" 
                            style={{ height: `${item.value}%` }}
                          ></div>
                          <span className="text-xs mt-2 text-gray-600">{item.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-medium text-gray-900 mb-3">Win/Loss Ratio</h4>
                    <div className="flex items-center justify-center">
                      <div className="relative w-40 h-40">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle className="text-gray-200 stroke-current" strokeWidth="10" cx="50" cy="50" r="40" fill="transparent" />
                          <circle
                            className="text-green-500 stroke-current"
                            strokeWidth="10"
                            strokeLinecap="round"
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            strokeDasharray="251.2"
                            strokeDashoffset={251.2 - (251.2 * profile.stats.winRate) / 100}
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold">{profile.stats.winRate}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span className="text-sm">Wins ({profile.stats.wins})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-200 rounded"></div>
                        <span className="text-sm">Losses ({profile.stats.losses})</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-medium text-gray-900 mb-3">Progress Over Time</h4>
                    <div className="flex items-center justify-center h-40">
                      <div className="relative w-full h-full">
                        <div className="absolute bottom-0 left-0 w-full h-px bg-gray-300"></div>
                        <div className="absolute bottom-0 left-0 w-full flex justify-between items-end">
                          {[30, 45, 60, 55, 70, 65, 80, 75, 67, 72, 78, 84].map((value, index) => (
                            <div
                              key={index}
                              className="w-2 bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                              style={{ height: `${value}%` }}
                              title={`Month ${index + 1}: ${value}%`}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "badges" && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Your Badges</h3>
                  <span className="text-sm text-gray-600">{earnedBadges.length}/{badges.length} earned</span>
                </div>

                <div className="mb-8">
                  <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <FaMedal className="text-amber-500" /> Earned Badges
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {earnedBadges.map(badge => (
                      <div key={badge.id} className={`border-2 p-4 rounded-xl text-center ${getRarityColor(badge.rarity)}`}>
                        <div className="text-2xl mb-2">{badge.icon}</div>
                        <h5 className="font-semibold text-gray-900">{badge.name}</h5>
                        <p className="text-xs text-gray-600">{badge.description}</p>
                        {badge.earnedDate && (
                          <div className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-500">
                            <FaCalendarAlt size={10} /> {badge.earnedDate}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Locked Badges</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {lockedBadges.map(badge => (
                      <div key={badge.id} className="border-2 border-gray-200 p-4 rounded-xl text-center bg-gray-100 opacity-75">
                        <div className="text-2xl mb-2 filter grayscale">{badge.icon}</div>
                        <h5 className="font-semibold text-gray-900">{badge.name}</h5>
                        <p className="text-xs text-gray-600">{badge.description}</p>
                        <div className="mt-2 text-xs text-gray-500">
                          {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "activity" && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { type: "win", opponent: "Bot (Advanced)", date: "2 hours ago", xp: 30 },
                    { type: "loss", opponent: "JohnDoe", date: "5 hours ago", xp: -5 },
                    { type: "challenge", name: "JavaScript Arrays", date: "1 day ago", xp: 15 },
                    { type: "achievement", name: "10 Day Streak", date: "2 days ago", xp: 50 },
                    { type: "win", opponent: "SarahM", date: "3 days ago", xp: 25 },
                    { type: "friend", name: "MikeT", date: "4 days ago", xp: 10 },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                        activity.type === "win" ? "bg-green-100 text-green-600" :
                        activity.type === "loss" ? "bg-red-100 text-red-600" :
                        activity.type === "challenge" ? "bg-blue-100 text-blue-600" :
                        activity.type === "achievement" ? "bg-yellow-100 text-yellow-600" :
                        "bg-purple-100 text-purple-600"
                      }`}>
                        {activity.type === "win" && <FaTrophy size={16} />}
                        {activity.type === "loss" && <FaTimes size={16} />}
                        {activity.type === "challenge" && <FaCode size={16} />}
                        {activity.type === "achievement" && <FaMedal size={16} />}
                        {activity.type === "friend" && <FaUserPlus size={16} />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {activity.type === "win" && `Won against ${activity.opponent}`}
                          {activity.type === "loss" && `Lost against ${activity.opponent}`}
                          {activity.type === "challenge" && `Completed ${activity.name} challenge`}
                          {activity.type === "achievement" && `Earned ${activity.name} achievement`}
                          {activity.type === "friend" && `Became friends with ${activity.name}`}
                        </p>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                      </div>
                      <div className={`font-medium ${activity.xp > 0 ? "text-green-600" : "text-red-600"}`}>
                        {activity.xp > 0 ? "+" : ""}{activity.xp} XP
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}