"use client";

import { useState, useEffect } from "react";
import Quiz from "./Quiz";
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
  createdAt: string;
}

export default function DashboardContent() {
  const [mode, setMode] = useState<"none" | "bot" | "pvp">("none");
  const [dailyStreak, setDailyStreak] = useState(0);
  const [notifications, setNotifications] = useState(0);
  const [onlinePlayers, setOnlinePlayers] = useState(0);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);
  const [leaderboardPreview, setLeaderboardPreview] = useState<LeaderboardPlayer[]>([]);
  const [recentGames, setRecentGames] = useState<GameSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data: session } = useSession();

  // Fetch user data from the database
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch user stats
        const statsResponse = await fetch('/api/user/stats');
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setUserStats({
            rank: statsData.rank || 42,
            wins: Math.floor((statsData.gamesPlayed || 0) * (statsData.winRate || 0.67)),
            losses: Math.floor((statsData.gamesPlayed || 0) * (1 - (statsData.winRate || 0.67))),
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

        // Fetch achievements
        const achievementsResponse = await fetch('/api/user/achievements');
        if (achievementsResponse.ok) {
          const achievementsData = await achievementsResponse.json();
          setRecentAchievements(achievementsData.slice(0, 3));
        }

        // Fetch leaderboard
        const leaderboardResponse = await fetch('/api/leaderboard?limit=4');
        if (leaderboardResponse.ok) {
          const leaderboardData = await leaderboardResponse.json();
          setLeaderboardPreview(leaderboardData);
        }

        // Fetch recent games
        const gamesResponse = await fetch('/api/user/games?limit=5');
        if (gamesResponse.ok) {
          const gamesData = await gamesResponse.json();
          setRecentGames(gamesData);
        }

        // Fetch online players count
        const onlineResponse = await fetch('/api/online-players');
        if (onlineResponse.ok) {
          const onlineData = await onlineResponse.json();
          setOnlinePlayers(onlineData.count);
        }

        // Fetch notifications
        const notificationsResponse = await fetch('/api/user/notifications');
        if (notificationsResponse.ok) {
          const notificationsData = await notificationsResponse.json();
          setNotifications(notificationsData.unreadCount);
        }

        // Fetch daily streak
        const streakResponse = await fetch('/api/user/streak');
        if (streakResponse.ok) {
          const streakData = await streakResponse.json();
          setDailyStreak(streakData.streak);
        }

      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [session]);

  // Simulate live player count updates
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlinePlayers(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(0, prev + change);
      });
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

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
            <h1 className="text-3xl font-bold mb-2">Welcome back, {username}! 👋</h1>
            <p className="opacity-90">Ready to test your coding knowledge today?</p>
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
            <div className="text-2xl font-bold">#{userStats?.rank || 42}</div>
            <div className="text-sm opacity-80">Global Rank</div>
          </div>
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <div className="text-2xl font-bold">{userStats?.winRate || 67}%</div>
            <div className="text-sm opacity-80">Win Rate</div>
          </div>
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <div className="text-2xl font-bold">{userStats?.wins || 28}</div>
            <div className="text-sm opacity-80">Victories</div>
          </div>
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <div className="text-2xl font-bold">{userStats?.totalXP || 3250}</div>
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Practice with AI</h3>
                <p className="text-gray-600 mb-4">Improve your skills against computer opponents</p>
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

          {/* Quick Play Challenges */}
          {mode === "none" && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaFire className="text-orange-500" /> Daily Challenges
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                  <div className="text-lg font-semibold text-blue-800 mb-2">Speed Run</div>
                  <p className="text-sm text-blue-600 mb-3">Answer 10 questions in record time</p>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                  <div className="text-xs text-blue-700 mt-1">3/10 completed</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                  <div className="text-lg font-semibold text-green-800 mb-2">JavaScript Master</div>
                  <p className="text-sm text-green-600 mb-3">Solve 5 JS challenges perfectly</p>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                  <div className="text-xs text-green-700 mt-1">4/5 completed</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                  <div className="text-lg font-semibold text-purple-800 mb-2">Win Streak</div>
                  <p className="text-sm text-purple-600 mb-3">Win 3 matches in a row</p>
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '66%' }}></div>
                  </div>
                  <div className="text-xs text-purple-700 mt-1">2/3 completed</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Stats and Info */}
        <div className="space-y-6">
          {/* Leaderboard Preview */}
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

          {/* Recent Achievements */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaCrown className="text-purple-500" /> Achievements
            </h2>
            <div className="space-y-3">
              {recentAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`text-2xl ${achievement.earned ? '' : 'filter grayscale opacity-50'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium ${achievement.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                      {achievement.name}
                    </div>
                    <div className="text-sm text-gray-500">{achievement.description}</div>
                  </div>
                  {achievement.earned ? (
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-center text-blue-600 hover:text-blue-800 font-medium text-sm">
              View All Achievements →
            </button>
          </div>

          {/* Recent Games */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaChartLine className="text-green-500" /> Recent Games
            </h2>
            <div className="space-y-3">
              {recentGames.length > 0 ? (
                recentGames.map((game) => (
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
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No games played yet
                </div>
              )}
            </div>
            <button className="w-full mt-4 text-center text-blue-600 hover:text-blue-800 font-medium text-sm">
              View Game History →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}