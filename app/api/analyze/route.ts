import { NextRequest, NextResponse } from "next/server";
import {
  generateAIText,
  buildWorkoutPrompt,
  parseWorkoutResponse,
  WorkoutDay,
  ProfileData,
} from "@/lib/gemini";
import { getUserId, getProfile, setProfile } from "@/lib/storage";

/**
 * POST /api/analyze
 * Generates a workout plan based on injury and profile data
 *
 * Request body: { injury: string, profile?: ProfileData }
 * Response: WorkoutDay[] | { error: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { injury, profile: bodyProfile } = body;

    // Validate required field
    if (!injury || typeof injury !== "string") {
      return NextResponse.json(
        { error: "No injury provided" },
        { status: 400 }
      );
    }

    // Get user identifier
    const userId = getUserId(request);
    console.log(`Analyze request user_id=${userId} injury=${injury}`);

    // Use profile from request body if provided, otherwise get from storage
    let profileData: ProfileData;
    if (bodyProfile) {
      profileData = bodyProfile;
      // Also store it for future requests
      setProfile(userId, bodyProfile);
    } else {
      profileData = getProfile(userId);
    }

    // Check if profile exists and has required data
    if (!profileData || typeof profileData !== "object" || Object.keys(profileData).length === 0) {
      console.error(`No profile found for user ${userId}. Profile data:`, profileData);
      return NextResponse.json(
        { error: "No profile found. Please create a profile first by visiting the Profile page." },
        { status: 400 }
      );
    }

    // Build prompt for Gemini
    const prompt = buildWorkoutPrompt(injury, profileData);

    // Get AI response
    const rawResponseText = await generateAIText(prompt);

    // Parse and normalize the response
    const workoutPlan: WorkoutDay[] = parseWorkoutResponse(rawResponseText);

    return NextResponse.json(workoutPlan);
  } catch (error) {
    console.error("Error in analyze endpoint:", error);

    // Check if it's a JSON parse error
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Failed to parse AI response." },
        { status: 500 }
      );
    }

    // Return appropriate error response
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    const statusCode = errorMessage.includes("API key not configured") ? 500 : 500;

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
