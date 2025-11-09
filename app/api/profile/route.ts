import { NextRequest, NextResponse } from "next/server";
import { ProfileData } from "@/lib/gemini";
import { getUserId, setProfile, getProfile } from "@/lib/storage";

/**
 * POST /api/profile
 * Stores user profile data
 *
 * Request body: ProfileData
 * Response: { message: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body (basic validation)
    const profile: ProfileData = {
      age: body.age,
      weight: body.weight,
      height: body.height,
      sex: body.sex,
      severity: body.severity,
    };

    // Get user identifier
    const userId = getUserId(request);

    // Store profile in memory (stateless for now, but maintains session state)
    setProfile(userId, profile);

    console.log(`Stored profile for user_id=${userId} payload=${JSON.stringify(profile)}`);

    return NextResponse.json({ message: "Profile updated successfully!" });
  } catch (error) {
    console.error("Error in profile endpoint:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/profile
 * Retrieves the stored profile for the current user
 *
 * Response: ProfileData | { error: string }
 */
export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request);
    const profile = getProfile(userId);

    if (!profile || Object.keys(profile).length === 0) {
      return NextResponse.json(
        { error: "No profile found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error retrieving profile:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
