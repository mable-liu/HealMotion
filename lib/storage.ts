/**
 * Shared in-memory storage for user profiles
 * This allows profile data to be shared across API routes
 *
 * In production, this should be replaced with a proper database
 * or session storage solution (Redis, PostgreSQL, etc.)
 */

import { ProfileData } from "./gemini";
import { NextRequest } from "next/server";

// Declare global type for TypeScript
declare global {
  var userProfiles: Map<string, ProfileData> | undefined;
}

// Global in-memory storage that persists across hot reloads in development
const userProfiles = globalThis.userProfiles ?? new Map<string, ProfileData>();

if (process.env.NODE_ENV !== "production") {
  globalThis.userProfiles = userProfiles;
}

/**
 * Derives a stable identifier for the requester
 * Matches the get_user_id function from the Python backend
 *
 * @param request - The Next.js request object
 * @returns A user identifier string
 */
export function getUserId(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "anonymous";
}

/**
 * Retrieves a user's profile from storage
 *
 * @param userId - The user identifier
 * @returns The user's profile data, or an empty object if not found
 */
export function getProfile(userId: string): ProfileData {
  return userProfiles.get(userId) || {};
}

/**
 * Stores a user's profile in storage
 *
 * @param userId - The user identifier
 * @param profile - The profile data to store
 */
export function setProfile(userId: string, profile: ProfileData): void {
  userProfiles.set(userId, profile);
}

/**
 * Checks if a user has a profile stored
 *
 * @param userId - The user identifier
 * @returns True if the user has a profile, false otherwise
 */
export function hasProfile(userId: string): boolean {
  return userProfiles.has(userId);
}

/**
 * Deletes a user's profile from storage
 *
 * @param userId - The user identifier
 * @returns True if the profile was deleted, false if it didn't exist
 */
export function deleteProfile(userId: string): boolean {
  return userProfiles.delete(userId);
}
