# AI Learning Lab

A personalized AI-powered learning platform that adapts to your learning style, time constraints, and goals.

## Features

- **Phase 1: Onboarding & Learning Contract** - Personalized questionnaire that creates a custom learning contract
- **Phase 2: Daily Learning** - Adaptive daily learning units with concept explanations, examples, and applications
- **Phase 3: Memory & Proof-of-Work** - Track your learning journey with evidence-backed memory entries

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS with accessibility-friendly colors
- **AI:** Anthropic Claude API
- **Testing:** Jest, React Testing Library, Playwright
- **Database:** PostgreSQL (to be configured)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (optional for initial setup)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file and configure:
   ```bash
   cp .env.example .env
   ```

4. Add your Anthropic API key to `.env`:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing

Run unit and integration tests:
```bash
npm test
```

Run E2E tests:
```bash
npm run test:e2e
```

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── onboarding/  # Onboarding flow components
│   ├── daily/       # Daily learning unit components
│   ├── memory/      # Memory system components
│   ├── layout/      # Layout components
│   ├── common/      # Shared components
│   └── settings/    # Settings components
├── services/        # Business logic and API integrations
├── types/           # TypeScript type definitions
├── api/            # API routes
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── database/       # Database schema and migrations
└── config/         # Configuration files
tests/
├── e2e/            # End-to-end tests
└── utils/          # Test utilities
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md) - System architecture and design
- [API Documentation](docs/API.md) - API endpoints and schemas
- [Topic Graph Guide](docs/TOPIC_GRAPH_GUIDE.md) - Creating curated topic graphs
- [Deployment](docs/DEPLOYMENT.md) - Deployment instructions

## Development Workflow

See [docs/tasks-ai-learning-lab.md](docs/tasks-ai-learning-lab.md) for the complete task breakdown and progress tracking.

## License

Private - All rights reserved
