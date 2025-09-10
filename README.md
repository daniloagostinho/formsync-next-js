# FormSync Next.js

A modern form management application built with Next.js, TypeScript, and modern React patterns.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form with Zod validation
- **Testing**: Jest, React Testing Library, Vitest, Cypress
- **Build Tools**: Turbopack, Webpack, Babel
- **Containerization**: Docker & Docker Compose
- **Code Quality**: ESLint, Prettier

## Features

- Modern React patterns with hooks and functional components
- Type-safe development with TypeScript
- Responsive design with Tailwind CSS
- State management with Zustand
- Form handling with React Hook Form
- API integration with Axios
- Comprehensive testing setup
- Docker containerization
- Performance optimizations

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker (optional)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp env.example .env.local
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker

Run with Docker:

```bash
# Development
npm run docker:dev

# Production
npm run docker:prod
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run Jest tests
- `npm run test:vitest` - Run Vitest tests
- `npm run test:cypress` - Run Cypress tests
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── app/                 # Next.js App Router
├── components/          # Reusable components
│   └── ui/             # UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── store/              # Zustand stores
├── types/              # TypeScript type definitions
├── api/                # API client and services
├── constants/          # Application constants
└── assets/             # Static assets
```

## Testing

The project includes comprehensive testing setup:

- **Unit Tests**: Jest with React Testing Library
- **Component Tests**: Vitest
- **E2E Tests**: Cypress
- **Type Checking**: TypeScript

Run tests:
```bash
npm run test              # Jest unit tests
npm run test:vitest       # Vitest component tests
npm run test:cypress      # Cypress E2E tests
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

This project is licensed under the MIT License.