# HealMotion

Your Personal Fitness and Rehabilitation Assistant powered by AI

## Overview

HealMotion is a modern, AI-powered fitness and rehabilitation application designed to help users manage recovery and achieve their fitness goals. Built with Next.js 16, TypeScript, and Tailwind CSS, it provides personalized workout and diet plans using Google's Gemini AI.

## Features

- **Profile Management**: Manage personal information including age, height, weight, fitness goals, and injury history
- **AI-Powered Workout Plans**: Generate customized 7-day workout plans tailored to your injuries, goals, and fitness level
- **Personalized Diet Recommendations**: Get AI-generated dietary plans optimized for recovery and training
- **Modern UI/UX**: Clean, responsive design with intuitive navigation and interactive components
- **Real-time AI Integration**: Direct integration with Google Gemini AI for personalized recommendations

## Tech Stack

- **Frontend**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **AI Integration**: Google Gemini API (gemini-1.5-flash)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 20.x or later
- npm or yarn
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/HealMotion.git
   cd HealMotion
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `GEMINI_API_KEY` | Yes | Your Google Gemini API key | - |
| `GEMINI_MODEL` | No | Gemini model to use | `gemini-1.5-flash` |

**Important**: Never commit your `.env.local` file. It's already included in `.gitignore`.

## Project Structure

```
HealMotion/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── diet/            # Diet plan generation endpoint
│   │   ├── profile/         # Profile management endpoint
│   │   └── workout/         # Workout plan generation endpoint
│   ├── components/          # Reusable React components
│   │   ├── DietPlanner.tsx
│   │   ├── Navigation.tsx
│   │   ├── Profile.tsx
│   │   └── WorkoutPlanner.tsx
│   ├── diet/                # Diet planning page
│   ├── profile/             # Profile management page
│   ├── workout/             # Workout planning page
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── lib/                     # Utility functions
│   └── gemini.ts            # Gemini AI client
├── public/                  # Static assets
├── .env.local.example       # Environment variables template
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project dependencies
```

## How It Works

### Profile Management
Users can create and manage their fitness profile, including:
- Personal information (age, height, weight)
- Fitness goals (weight loss, muscle gain, rehabilitation, etc.)
- Injury history and current limitations
- Activity level and preferences

### Workout Planning
The AI generates personalized 7-day workout plans based on:
- User's fitness goals
- Current injuries or limitations
- Fitness level
- Available equipment
- Time constraints

### Diet Planning
Get customized meal plans that consider:
- Fitness goals (bulking, cutting, maintenance)
- Dietary restrictions and preferences
- Caloric needs based on profile
- Macronutrient distribution
- Recovery and training phases

## Deployment

### Deploy to Vercel

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

   For production deployment:
   ```bash
   vercel --prod
   ```

3. **Set environment variables in Vercel Dashboard**
   - Go to your project settings in Vercel
   - Navigate to "Environment Variables"
   - Add `GEMINI_API_KEY` with your API key
   - Redeploy if necessary

### Alternative: Deploy via GitHub Integration

1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure environment variables in project settings
4. Vercel will automatically deploy on every push to main

## API Routes

### POST /api/profile
Save or update user profile
```typescript
Body: {
  age: number;
  height: number;
  weight: number;
  goals: string;
  injuries: string;
}
```

### POST /api/workout
Generate workout plan
```typescript
Body: {
  profile: ProfileData;
}
Response: {
  plan: string; // Formatted workout plan
}
```

### POST /api/diet
Generate diet plan
```typescript
Body: {
  profile: ProfileData;
}
Response: {
  plan: string; // Formatted diet plan
}
```

## Development

### Code Quality

The project uses:
- TypeScript for type safety
- ESLint for code linting
- Next.js best practices
- React 19 features

### Adding New Features

1. Create new components in `app/components/`
2. Add new pages in `app/[page-name]/`
3. Add API routes in `app/api/[route-name]/`
4. Update types as needed
5. Test thoroughly before committing

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

**Build fails with module not found**
- Run `npm install` to ensure all dependencies are installed
- Delete `node_modules` and `.next`, then reinstall: `rm -rf node_modules .next && npm install`

**API returns 500 error**
- Check that `GEMINI_API_KEY` is set in `.env.local`
- Verify your API key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)
- Check API rate limits

**Styles not loading**
- Clear `.next` folder: `rm -rf .next`
- Restart dev server: `npm run dev`

## License

This project is licensed under the MIT License.

## Contact

For questions, issues, or suggestions:
- Email: [liyuxiao2006@gmail.com](mailto:liyuxiao2006@gmail.com)
- GitHub Issues: [Create an issue](https://github.com/yourusername/HealMotion/issues)

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Powered by [Google Gemini AI](https://ai.google.dev)
- Styled with [Tailwind CSS](https://tailwindcss.com)

---

Made with care for your health and fitness journey.
