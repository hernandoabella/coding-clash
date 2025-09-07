// lib/auth-utils.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";

// For API routes
export async function getSession(req: NextApiRequest, res: NextApiResponse) {
  return await getServerSession(req, res, authOptions);
}

// For App Router (Server Components/Server Actions)
export async function getServerAuthSession() {
  return await getServerSession(authOptions);
}

// Get current user for API routes
export async function getCurrentUser(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);
  return session?.user || null;
}

// Get current user for App Router
export async function getCurrentUserServer() {
  const session = await getServerAuthSession();
  return session?.user || null;
}

// Require authentication utility
export async function requireAuth(req: NextApiRequest, res: NextApiResponse) {
  const user = await getCurrentUser(req, res);
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}

// Check if user is authenticated
export async function isAuthenticated(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await getCurrentUser(req, res);
    return !!user;
  } catch {
    return false;
  }
}