# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based astrology consultation application (Jyotish Advisor) that provides free astrology readings and promotes astrology-related products. It uses Server-Sent Events (SSE) for streaming AI-generated astrological insights.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## Architecture

### Core Application Flow
1. **ConsultationForm** (`src/components/ConsultationForm.tsx`) - Collects user birth details and preferences
2. **App.tsx** - Manages state and API communication, handles SSE streaming for real-time responses
3. **ChatForm** (`src/components/ChatForm.tsx`) - Handles follow-up questions after initial consultation

### API Communication
- **SSE Endpoint**: `/api/generate` - Streams astrological readings
- **Chat Endpoint**: `/api/chat` - Handles follow-up questions
- Configuration via URL parameters (astrologer name, product URL, price)

### Key Technical Details
- Markdown responses are sanitized with DOMPurify before rendering
- Countdown timer runs for promotional deadlines (configurable via URL params)
- Form data persists in localStorage for user convenience
- Japanese UI with all text in Japanese

### State Management
The application uses React hooks for state management with these key states in App.tsx:
- `consultationData`: User's birth details and form inputs
- `messages`: Chat history for streaming responses
- `isLoading`: UI loading states
- `countdownConfig`: Dynamic countdown timer configuration