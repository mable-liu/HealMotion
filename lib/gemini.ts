/**
 * Gemini API Integration Library
 * Provides functions to interact with Google's Gemini API for workout and diet plan generation
 */

// Type definitions
export interface ProfileData {
  age?: number;
  weight?: number;
  height?: number;
  sex?: string;
  severity?: string;
}

export interface Exercise {
  name: string;
  reps: string;
  url: string;
}

export interface WorkoutDay {
  day: string;
  exercises: Exercise[];
}

export interface Meal {
  meal: string;
  items: string[];
}

export interface DietDay {
  day: string;
  meals: Meal[];
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

/**
 * Calls the Gemini API with a given prompt
 * @param prompt - The text prompt to send to Gemini
 * @returns The generated text response
 * @throws Error if API key is not configured or if the request fails
 */
export async function generateAIText(prompt: string): Promise<string> {
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    throw new Error("API key not configured. Please set GEMINI_API_KEY environment variable.");
  }

  const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;

  const payload = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ]
  };

  try {
    const response = await fetch(`${GEMINI_ENDPOINT}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI service request failed: ${errorText || response.statusText}`);
    }

    const data: GeminiResponse = await response.json();

    const candidates = data.candidates || [];
    if (!candidates.length) {
      throw new Error("No candidates returned from AI model.");
    }

    const parts = candidates[0]?.content?.parts || [];
    if (!parts.length) {
      throw new Error("No content parts found in AI response.");
    }

    return parts[0].text || "";
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`AI service request failed: ${String(error)}`);
  }
}

/**
 * Builds a prompt for generating a workout plan
 * @param injury - The injury description
 * @param profile - User profile data
 * @returns The formatted prompt string
 */
export function buildWorkoutPrompt(injury: string, profile: ProfileData): string {
  const age = profile.age || "unknown";
  const weight = profile.weight || "unknown";
  const height = profile.height || "unknown";
  const sex = profile.sex || "unknown";
  const severity = profile.severity || "unknown";

  return (
    `Given the injury '${injury}' with ${severity} severity, for a person aged ${age}, weighing ${weight} kg, sex: ${sex}, and ${height} cm tall, ` +
    "generate a detailed 7-day workout plan in JSON format. " +
    "The response should include:" +
    "  - 'workoutPlan': An object containing:" +
    "      - 'days': A list of days, where each day is an object with the fields:" +
    "          - 'day': The name of the day (e.g., 'Monday')." +
    "          - 'exercises': A list of exercise objects, each with the fields:" +
    "              - 'name': The name of the exercise." +
    "              - 'reps': Repetitions and sets (e.g., '10-15 reps, 3 sets')." +
    "              - 'url': A URL to a google search for additional information."
  );
}

/**
 * Builds a prompt for generating a diet plan
 * @param injury - The injury description
 * @param profile - User profile data
 * @returns The formatted prompt string
 */
export function buildDietPrompt(injury: string, profile: ProfileData): string {
  const age = profile.age || "unknown";
  const weight = profile.weight || "unknown";
  const height = profile.height || "unknown";
  const sex = profile.sex || "unknown";
  const severity = profile.severity || "unknown";

  return (
    `Given the injury '${injury}' with ${severity} severity, for a person aged ${age}, weighing ${weight} kg, sex: ${sex}, and ${height} cm tall, ` +
    "generate a detailed 7-day diet plan in JSON format. Each day should include:" +
    "  - 'day': The name of the day (e.g., 'Monday')." +
    "  - 'meals': A list of meals for breakfast, lunch, and dinner."
  );
}

/**
 * Extracts and parses JSON from AI response text
 * @param responseText - The raw response text from Gemini
 * @returns Parsed JSON object
 * @throws Error if no valid JSON is found
 */
export function extractJSON(responseText: string): any {
  // Use RegExp with dotAll flag for compatibility
  const jsonMatch = responseText.match(new RegExp("{.*}", "s"));
  if (!jsonMatch) {
    throw new Error("No valid JSON found in the response.");
  }

  const cleanResponseText = jsonMatch[0];
  return JSON.parse(cleanResponseText);
}

/**
 * Parses and normalizes workout plan response from Gemini
 * @param responseText - Raw response text from Gemini
 * @returns Array of workout days
 * @throws Error if parsing fails or format is invalid
 */
export function parseWorkoutResponse(responseText: string): WorkoutDay[] {
  const responseJson = extractJSON(responseText);

  // Ensure workoutPlan exists and contains days
  const workoutPlan = responseJson.workoutPlan?.days || [];
  if (!Array.isArray(workoutPlan)) {
    throw new Error("Invalid workout plan format: 'days' should be a list");
  }

  // Simplify response for frontend
  const simplifiedResponse: WorkoutDay[] = [];
  for (const dayData of workoutPlan) {
    const day = dayData.day || "Unknown Day";
    const exercises = dayData.exercises || [];

    if (!Array.isArray(exercises)) {
      continue;
    }

    const simplifiedExercises: Exercise[] = exercises.map((exercise: any) => ({
      name: exercise.name || "Unknown Exercise",
      reps: exercise.reps || "",
      url: exercise.url || ""
    }));

    simplifiedResponse.push({ day, exercises: simplifiedExercises });
  }

  if (!simplifiedResponse.length) {
    throw new Error("No valid workout data could be processed");
  }

  return simplifiedResponse;
}

/**
 * Parses and normalizes diet plan response from Gemini
 * @param responseText - Raw response text from Gemini
 * @returns Array of diet days
 * @throws Error if parsing fails or format is invalid
 */
export function parseDietResponse(responseText: string): DietDay[] {
  const responseJson = extractJSON(responseText);

  // Extract diet plan from response
  const dietPlan = responseJson.dietPlan || [];

  if (!Array.isArray(dietPlan)) {
    throw new Error("Invalid diet plan format");
  }

  // Simplify response for frontend
  const simplifiedResponse: DietDay[] = [];
  for (const dayData of dietPlan) {
    const day = dayData.day || "Unknown Day";
    const meals = dayData.meals || [];

    const simplifiedMeals: Meal[] = meals.map((meal: any) => ({
      meal: meal.meal || "Unknown Meal",
      items: meal.items || []
    }));

    simplifiedResponse.push({ day, meals: simplifiedMeals });
  }

  return simplifiedResponse;
}
