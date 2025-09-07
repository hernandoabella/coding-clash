// app/api/user/notifications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';

// Notification types
const NOTIFICATION_TYPES = {
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  LEVEL_UP: 'level_up',
  NEW_RANK: 'new_rank',
  FRIEND_REQUEST: 'friend_request',
  FRIEND_ACCEPTED: 'friend_accepted',
  CHALLENGE_COMPLETED: 'challenge_completed',
  DAILY_REWARD: 'daily_reward',
  WEEKLY_SUMMARY: 'weekly_summary',
  SPECIAL_EVENT: 'special_event',
  SYSTEM_ANNOUNCEMENT: 'system_announcement'
} as const;

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const type = searchParams.get('type');
    const includeCount = searchParams.get('includeCount') !== 'false';

    const userId = session.user.id;

    // Build where clause
    const whereClause: any = { userId };
    
    if (unreadOnly) {
      whereClause.read = false;
    }
    
    if (type) {
      whereClause.type = type;
    }

    // Get notifications
    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
      include: {
        achievement: {
          select: {
            achievementType: true,
            unlockedAt: true
          }
        }
      }
    });

    // Get unread count if requested
    let unreadCount = 0;
    if (includeCount) {
      unreadCount = await prisma.notification.count({
        where: { userId, read: false }
      });
    }

    // Format notifications with additional data
    const formattedNotifications = notifications.map(notification => ({
      id: notification.id,
      type: notification.type,
      title: getNotificationTitle(notification.type, notification.data),
      message: getNotificationMessage(notification.type, notification.data),
      data: notification.data,
      read: notification.read,
      createdAt: notification.createdAt,
      expiresAt: notification.expiresAt,
      actionUrl: getActionUrl(notification.type, notification.data),
      icon: getNotificationIcon(notification.type),
      priority: notification.priority
    }));

    return NextResponse.json({
      notifications: formattedNotifications,
      unreadCount,
      pagination: {
        total: await prisma.notification.count({ where: { userId } }),
        limit,
        offset,
        hasMore: offset + limit < await prisma.notification.count({ where: whereClause })
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Mark notifications as read
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const notificationId = searchParams.get('id');
    const markAll = searchParams.get('markAll') === 'true';

    const userId = session.user.id;

    if (action === 'mark-read') {
      if (markAll) {
        // Mark all notifications as read
        await prisma.notification.updateMany({
          where: { userId, read: false },
          data: { read: true, readAt: new Date() }
        });

        return NextResponse.json({ 
          success: true, 
          message: 'All notifications marked as read' 
        });
      } else if (notificationId) {
        // Mark specific notification as read
        const notification = await prisma.notification.update({
          where: { 
            id: notificationId,
            userId // Ensure user owns this notification
          },
          data: { read: true, readAt: new Date() }
        });

        if (!notification) {
          return NextResponse.json(
            { error: 'Notification not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({ 
          success: true, 
          notification: {
            id: notification.id,
            read: notification.read
          }
        });
      }
    } else if (action === 'delete') {
      if (notificationId) {
        // Delete specific notification
        await prisma.notification.delete({
          where: { 
            id: notificationId,
            userId // Ensure user owns this notification
          }
        });

        return NextResponse.json({ 
          success: true, 
          message: 'Notification deleted' 
        });
      }
    } else if (action === 'clear-all') {
      // Delete all read notifications
      await prisma.notification.deleteMany({
        where: { userId, read: true }
      });

      return NextResponse.json({ 
        success: true, 
        message: 'All read notifications cleared' 
      });
    }

    return NextResponse.json(
      { error: 'Invalid action or missing parameters' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create a new notification (for internal use)
export async function createNotification(userId: string, type: string, data: any, priority: number = 1) {
  try {
    // Check if similar notification already exists recently
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const existingNotification = await prisma.notification.findFirst({
      where: {
        userId,
        type,
        createdAt: { gte: oneHourAgo },
        data: { equals: data }
      }
    });

    if (existingNotification) {
      return null; // Avoid duplicate notifications
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        data,
        priority,
        expiresAt: calculateExpirationDate(type)
      }
    });

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
}

// Helper function to calculate expiration date based on notification type
function calculateExpirationDate(type: string): Date {
  const now = new Date();
  
  switch (type) {
    case NOTIFICATION_TYPES.DAILY_REWARD:
      return new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
    case NOTIFICATION_TYPES.WEEKLY_SUMMARY:
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
    case NOTIFICATION_TYPES.SPECIAL_EVENT:
      return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days
    default:
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
  }
}

// Helper function to get notification title based on type
function getNotificationTitle(type: string, data: any): string {
  switch (type) {
    case NOTIFICATION_TYPES.ACHIEVEMENT_UNLOCKED:
      return '🎉 Achievement Unlocked!';
    case NOTIFICATION_TYPES.LEVEL_UP:
      return `📈 Level Up! Level ${data.level}`;
    case NOTIFICATION_TYPES.NEW_RANK:
      return `🏆 New Rank: ${data.rankName}`;
    case NOTIFICATION_TYPES.FRIEND_REQUEST:
      return '👥 New Friend Request';
    case NOTIFICATION_TYPES.FRIEND_ACCEPTED:
      return '✅ Friend Request Accepted';
    case NOTIFICATION_TYPES.CHALLENGE_COMPLETED:
      return '✅ Challenge Completed';
    case NOTIFICATION_TYPES.DAILY_REWARD:
      return '🎁 Daily Reward Available';
    case NOTIFICATION_TYPES.WEEKLY_SUMMARY:
      return '📊 Weekly Summary';
    case NOTIFICATION_TYPES.SPECIAL_EVENT:
      return '🎪 Special Event';
    case NOTIFICATION_TYPES.SYSTEM_ANNOUNCEMENT:
      return '📢 System Announcement';
    default:
      return 'Notification';
  }
}

// Helper function to get notification message based on type and data
function getNotificationMessage(type: string, data: any): string {
  switch (type) {
    case NOTIFICATION_TYPES.ACHIEVEMENT_UNLOCKED:
      return `You unlocked the "${data.achievementName}" achievement! ${data.description}`;
    case NOTIFICATION_TYPES.LEVEL_UP:
      return `Congratulations! You reached level ${data.level}. Keep up the great work!`;
    case NOTIFICATION_TYPES.NEW_RANK:
      return `You achieved the ${data.rankName} rank! You're now in the top ${data.percentile}% of players.`;
    case NOTIFICATION_TYPES.FRIEND_REQUEST:
      return `${data.friendUsername} wants to be your friend.`;
    case NOTIFICATION_TYPES.FRIEND_ACCEPTED:
      return `${data.friendUsername} accepted your friend request.`;
    case NOTIFICATION_TYPES.CHALLENGE_COMPLETED:
      return `You completed the "${data.challengeName}" challenge and earned ${data.xpEarned} XP!`;
    case NOTIFICATION_TYPES.DAILY_REWARD:
      return `Claim your daily reward of ${data.rewardAmount} XP for logging in today!`;
    case NOTIFICATION_TYPES.WEEKLY_SUMMARY:
      return `You played ${data.gamesPlayed} games this week with ${data.accuracy}% accuracy.`;
    case NOTIFICATION_TYPES.SPECIAL_EVENT:
      return data.message || 'A special event is happening now! Participate to earn bonus rewards.';
    case NOTIFICATION_TYPES.SYSTEM_ANNOUNCEMENT:
      return data.message || 'Important system announcement.';
    default:
      return data.message || 'You have a new notification.';
  }
}

// Helper function to get action URL based on notification type
function getActionUrl(type: string, data: any): string | null {
  switch (type) {
    case NOTIFICATION_TYPES.ACHIEVEMENT_UNLOCKED:
      return '/achievements';
    case NOTIFICATION_TYPES.LEVEL_UP:
      return '/profile';
    case NOTIFICATION_TYPES.NEW_RANK:
      return '/leaderboard';
    case NOTIFICATION_TYPES.FRIEND_REQUEST:
      return '/friends';
    case NOTIFICATION_TYPES.FRIEND_ACCEPTED:
      return `/profile/${data.friendId}`;
    case NOTIFICATION_TYPES.CHALLENGE_COMPLETED:
      return '/challenges';
    case NOTIFICATION_TYPES.DAILY_REWARD:
      return '/rewards';
    case NOTIFICATION_TYPES.WEEKLY_SUMMARY:
      return '/stats';
    case NOTIFICATION_TYPES.SPECIAL_EVENT:
      return '/events';
    case NOTIFICATION_TYPES.SYSTEM_ANNOUNCEMENT:
      return '/announcements';
    default:
      return null;
  }
}

// Helper function to get notification icon
function getNotificationIcon(type: string): string {
  switch (type) {
    case NOTIFICATION_TYPES.ACHIEVEMENT_UNLOCKED:
      return '🏆';
    case NOTIFICATION_TYPES.LEVEL_UP:
      return '⭐';
    case NOTIFICATION_TYPES.NEW_RANK:
      return '📊';
    case NOTIFICATION_TYPES.FRIEND_REQUEST:
      return '👥';
    case NOTIFICATION_TYPES.FRIEND_ACCEPTED:
      return '✅';
    case NOTIFICATION_TYPES.CHALLENGE_COMPLETED:
      return '🎯';
    case NOTIFICATION_TYPES.DAILY_REWARD:
      return '🎁';
    case NOTIFICATION_TYPES.WEEKLY_SUMMARY:
      return '📈';
    case NOTIFICATION_TYPES.SPECIAL_EVENT:
      return '🎪';
    case NOTIFICATION_TYPES.SYSTEM_ANNOUNCEMENT:
      return '📢';
    default:
      return '🔔';
  }
