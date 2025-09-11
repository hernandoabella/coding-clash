"use client";

import { useState, useEffect } from "react";
import Quiz from "./QuizModals";
import { FaFire, FaTrophy, FaUsers, FaRobot, FaCrown, FaChartLine, FaBell, FaGamepad } from "react-icons/fa";
import { useSession } from "next-auth/react";

interface UserStats {
  rank: number;
  wins: number;
  losses: number;
  winRate: number;
  totalXP: number;
  level: number;
  gamesPlayed: number;
  correctAnswers: number;
  totalAnswers: number;
  maxStreak: number;
  accuracy: number;
}

interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
}

interface LeaderboardPlayer {
  rank: number;
  name: string;
  score: number;
  isCurrentUser?: boolean;
}

interface GameSession {
  id: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  language: string;
  difficulty: string;
  completed: boolean;
  startTime: string;
}

export default function DashboardContent() {
  const [mode, setMode] = useState<"none" | "bot" | "pvp">("none");
  const [dailyStreak, setDailyStreak] = useState(0);
  const [notifications, setNotifications] = useState(0);
  const [onlinePlayers, setOnlinePlayers] = useState(1247); // Initial static value
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);
  const [leaderboardPreview, setLeaderboardPreview] = useState<LeaderboardPlayer[]>([]);
  const [recentGames, setRecentGames] = useState<GameSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const { data: session } = useSession();

  // Set client-side flag to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch user data from the database
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Fetch all data in parallel
        const [
          statsResponse,
          achievementsResponse,
          leaderboardResponse,
          gamesResponse,
          onlineResponse,
          notificationsResponse,
          streakResponse
        ] = await Promise.allSettled([
          fetch('/api/user/stats'),
          fetch('/api/user/achievements'),
          fetch('/api/leaderboard?limit=4'),
          fetch('/api/user/games?limit=5'),
          fetch('/api/online-players'),
          fetch('/api/user/notifications'),
          fetch('/api/user/streak')
        ]);

        // Process user stats
        if (statsResponse.status === 'fulfilled' && statsResponse.value.ok) {
          const statsData = await statsResponse.value.json();
          setUserStats({
            rank: statsData.rank || 0,
            wins: Math.floor((statsData.gamesPlayed || 0) * (statsData.winRate || 0)),
            losses: Math.floor((statsData.gamesPlayed || 0) * (1 - (statsData.winRate || 0))),
            winRate: Math.round((statsData.accuracy || 0) * 100),
            totalXP: statsData.xp || 0,
            level: statsData.level || 1,
            gamesPlayed: statsData.gamesPlayed || 0,
            correctAnswers: statsData.correctAnswers || 0,
            totalAnswers: statsData.totalAnswers || 0,
            maxStreak: statsData.maxStreak || 0,
            accuracy: statsData.accuracy || 0,
          });
        }

        // Process achievements
        if (achievementsResponse.status === 'fulfilled' && achievementsResponse.value.ok) {
          const achievementsData = await achievementsResponse.value.json();
          setRecentAchievements(achievementsData.slice(0, 3));
        }

        // Process leaderboard
        if (leaderboardResponse.status === 'fulfilled' && leaderboardResponse.value.ok) {
          const leaderboardData = await leaderboardResponse.value.json();
          setLeaderboardPreview(leaderboardData);
        }

        // Process recent games
        if (gamesResponse.status === 'fulfilled' && gamesResponse.value.ok) {
          const gamesData = await gamesResponse.value.json();
          setRecentGames(gamesData);
        }

        // Process online players
        if (onlineResponse.status === 'fulfilled' && onlineResponse.value.ok) {
          const onlineData = await onlineResponse.value.json();
          setOnlinePlayers(onlineData.count);
        }

        // Process notifications
        if (notificationsResponse.status === 'fulfilled' && notificationsResponse.value.ok) {
          const notificationsData = await notificationsResponse.value.json();
          setNotifications(notificationsData.unreadCount || 0);
        }

        // Process daily streak
        if (streakResponse.status === 'fulfilled' && streakResponse.value.ok) {
          const streakData = await streakResponse.value.json();
          setDailyStreak(streakData.streak || 0);
        }

      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [session]);

  // Simulate live player count updates (only on client side)
  useEffect(() => {
    if (!isClient) return;
    
    const interval = setInterval(() => {
      setOnlinePlayers(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(1200, prev + change);
      });
    }, 10000);
    
    return () => clearInterval(interval);
  }, [isClient]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const username = session?.user?.username || "Player";

  return (
    <div className="space-y-8">
      {/* Welcome Header with Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{username}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg">
              <FaFire className="text-orange-400" />
              <span className="font-semibold">{dailyStreak} day streak</span>
            </div>
            <button className="relative bg-white/20 p-3 rounded-lg hover:bg-white/30 transition">
              <FaBell />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <div className="text-2xl font-bold">#{userStats?.rank || '-'}</div>
            <div className="text-sm opacity-80">Global Rank</div>
          </div>
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <div className="text-2xl font-bold">{userStats?.winRate || 0}%</div>
            <div className="text-sm opacity-80">Win Rate</div>
          </div>
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <div className="text-2xl font-bold">{userStats?.wins || 0}</div>
            <div className="text-sm opacity-80">Victories</div>
          </div>
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <div className="text-2xl font-bold">{userStats?.totalXP || 0}</div>
            <div className="text-sm opacity-80">Total XP</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Game Modes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Game Mode Cards */}
          {mode === "none" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Play vs Random Opponent */}
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100 transition-all hover:shadow-xl hover:scale-[1.02]">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUsers className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Battle Players</h3>
                <p className="text-gray-600 mb-4">Test your skills against real opponents</p>
                <div className="mb-4 text-sm text-gray-500">
                  <span className="inline-flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    {onlinePlayers} players online
                  </span>
                </div>
                <button
                  onClick={() => setMode("pvp")}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg w-full"
                >
                  Find Match
                </button>
              </div>

              {/* Play with Bot */}
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100 transition-all hover:shadow-xl hover:scale-[1.02]">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaRobot className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Practice</h3>
                <p className="text-gray-600 mb-4">Improve your skills against computer</p>
                <div className="flex justify-center gap-2 mb-4">
                  {["Easy", "Medium", "Hard"].map((difficulty) => (
                    <span key={difficulty} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {difficulty}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setMode("bot")}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg w-full"
                >
                  Train Now
                </button>
              </div>
            </div>
          )}

          {/* Bot Quiz Mode */}
          {mode === "bot" && <Quiz />}

          {/* PvP Mode */}
          {mode === "pvp" && (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaGamepad className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Finding Opponent</h3>
              <p className="text-gray-600 mb-6">Searching for players with similar skill level...</p>
              
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-blue-800">Estimated wait: 15 seconds</span>
                  <div className="animate-pulse bg-blue-200 rounded-full px-3 py-1">
                    <span className="text-xs text-blue-800">Live</span>
                  </div>
                </div>
                <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full animate-[progressBar_2s_ease-in-out_infinite]"></div>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setMode("none")}
                  className="px-6 py-3 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-6 py-3 rounded-xl bg-blue-100 text-blue-700 font-medium">
                  Practice while waiting
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Stats and Info */}
        <div className="space-y-6">
          {/* Leaderboard Preview */}
          {leaderboardPreview.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaTrophy className="text-yellow-500" /> Top Players
              </h2>
              <div className="space-y-3">
                {leaderboardPreview.map((player) => (
                  <div key={player.rank} className={`flex items-center justify-between p-3 rounded-lg ${player.isCurrentUser ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${player.rank === 1 ? 'bg-yellow-500' : player.rank === 2 ? 'bg-gray-400' : player.rank === 3 ? 'bg-amber-700' : 'bg-gray-600'}`}>
                        {player.rank}
                      </div>
                      <span className={`font-medium ${player.isCurrentUser ? 'text-blue-600' : 'text-gray-900'}`}>
                        {player.isCurrentUser ? 'You' : player.name}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-700">{player.score}</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-center text-blue-600 hover:text-blue-800 font-medium text-sm">
                View Full Leaderboard →
              </button>
            </div>
          )}

          {/* Recent Achievements */}
          {recentAchievements.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaCrown className="text-purple-500" /> Recent Achievements
              </h2>
              <div className="space-y-3">
                {recentAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {achievement.name}
                      </div>
                      <div className="text-sm text-gray-500">{achievement.description}</div>
                    </div>
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-center text-blue-600 hover:text-blue-800 font-medium text-sm">
                View All Achievements →
              </button>
            </div>
          )}

          {/* Recent Games */}
          {recentGames.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaChartLine className="text-green-500" /> Recent Games
              </h2>
              <div className="space-y-3">
                {recentGames.map((game) => (
                  <div key={game.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{game.language} - {game.difficulty}</div>
                      <div className="text-sm text-gray-500">
                        {game.correctAnswers}/{game.totalQuestions} correct
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-700">{game.score} pts</div>
                      <div className={`text-xs ${game.completed ? 'text-green-600' : 'text-red-600'}`}>
                        {game.completed ? 'Completed' : 'Incomplete'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-center text-blue-600 hover:text-blue-800 font-medium text-sm">
                View Game History →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}