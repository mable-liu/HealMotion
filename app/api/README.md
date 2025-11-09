# HealMotion API Documentation

This directory contains the Next.js API routes that replace the Python FastAPI backend.

## API Endpoints

### 1. POST /api/profile

Stores user profile data for later use in generating workout and diet plans.

**Request Body:**
```json
{
  "age": 30,
  "weight": 70,
  "height": 175,
  "sex": "male",
  "severity": "moderate"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully!"
}
```

**Error Response:**
```json
{
  "error": "Error message"
}
```

### 2. GET /api/profile

Retrieves the stored profile for the current user.

**Response:**
```json
{
  "age": 30,
  "weight": 70,
  "height": 175,
  "sex": "male",
  "severity": "moderate"
}
```

**Error Response (404):**
```json
{
  "error": "No profile found for this user"
}
```

### 3. POST /api/analyze

Generates a 7-day workout plan based on injury and profile data.

**Request Body:**
```json
{
  "injury": "knee pain",
  "profile": {
    "age": 30,
    "weight": 70,
    "height": 175,
    "sex": "male",
    "severity": "moderate"
  }
}
```

Note: The `profile` field is optional. If not provided, the API will use the profile stored via `/api/profile`.

**Response:**
```json
[
  {
    "day": "Monday",
    "exercises": [
      {
        "name": "Quad Sets",
        "reps": "10-15 reps, 3 sets",
        "url": "https://www.google.com/search?q=Quad+Sets"
      },
      {
        "name": "Straight Leg Raises",
        "reps": "10-12 reps, 3 sets",
        "url": "https://www.google.com/search?q=Straight+Leg+Raises"
      }
    ]
  },
  {
    "day": "Tuesday",
    "exercises": [...]
  }
  // ... 7 days total
]
```

**Error Responses:**

400 Bad Request:
```json
{
  "error": "No injury provided"
}
```

500 Internal Server Error:
```json
{
  "error": "Failed to parse AI response."
}
```

or

```json
{
  "error": "API key not configured. Please set GEMINI_API_KEY environment variable."
}
```

### 4. POST /api/diet

Generates a 7-day diet plan based on injury and profile data.

**Request Body:**
```json
{
  "injury": "knee pain",
  "profile": {
    "age": 30,
    "weight": 70,
    "height": 175,
    "sex": "male",
    "severity": "moderate"
  }
}
```

Note: The `profile` field is optional. If not provided, the API will use the profile stored via `/api/profile`.

**Response:**
```json
[
  {
    "day": "Monday",
    "meals": [
      {
        "meal": "Breakfast",
        "items": ["Oatmeal with berries", "Greek yogurt", "Green tea"]
      },
      {
        "meal": "Lunch",
        "items": ["Grilled chicken salad", "Whole wheat bread", "Water"]
      },
      {
        "meal": "Dinner",
        "items": ["Salmon with quinoa", "Steamed vegetables", "Water"]
      }
    ]
  },
  {
    "day": "Tuesday",
    "meals": [...]
  }
  // ... 7 days total
]
```

**Error Responses:**

400 Bad Request:
```json
{
  "error": "No injury provided"
}
```

500 Internal Server Error:
```json
{
  "error": "Failed to parse AI response."
}
```

or

```json
{
  "error": "API key not configured. Please set GEMINI_API_KEY environment variable."
}
```

## Environment Variables

The following environment variables must be set in `.env.local`:

- **GEMINI_API_KEY** (required): Your Google Gemini API key. Get one at https://makersuite.google.com/app/apikey
- **GEMINI_MODEL** (optional): The Gemini model to use. Defaults to `gemini-1.5-flash`

## Implementation Details

### Architecture

- **API Routes**: Located in `app/api/[endpoint]/route.ts`
- **Gemini Helper**: `lib/gemini.ts` - Contains all Gemini API interaction logic
- **Storage Helper**: `lib/storage.ts` - Manages in-memory user profile storage
- **TypeScript**: All code is fully typed for type safety

### User Identification

The API identifies users based on the `x-forwarded-for` header (IP address), falling back to "anonymous" if not available. This matches the behavior of the Python backend.

### Profile Storage

User profiles are stored in-memory using a Map. This is suitable for development but should be replaced with a proper database (PostgreSQL, Redis, etc.) in production.

### Error Handling

All endpoints include comprehensive error handling:
- Input validation (required fields)
- Gemini API errors (network, parsing, etc.)
- Type validation
- Appropriate HTTP status codes

### Response Format

The API responses match the format expected by the existing frontend to ensure compatibility.
