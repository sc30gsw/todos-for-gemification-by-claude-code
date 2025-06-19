# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Setup

This is a Next.js 15 project with TypeScript, Tailwind CSS 4, and Biome for linting/formatting.

### Package Manager
Uses Bun as the package manager (bun.lock present).

### Key Commands
- `bun dev` - Start development server with Turbopack
- `bun build` - Build production application
- `bun start` - Start production server
- `bun lint` - Run Next.js ESLint

## Coding Rules
- Always refer to coding.md

### Code Quality Tools
- **Biome**: Primary linter and formatter configured in biome.json
  - Uses single quotes and semicolons only where needed
  - Auto-organizes imports
  - Specific rule overrides for Next.js files and component patterns

## Architecture

### Framework
- **Next.js 15** with App Router (`src/app/` directory structure)
- **React 19** with TypeScript
- **Tailwind CSS v4** for styling

### Project Structure
- `src/app/` - App Router pages and layouts
  - `layout.tsx` - Root layout with Geist fonts
  - `page.tsx` - Home page component
- Uses path alias `~/*` for `./src/*` imports

### Styling
- Tailwind CSS with custom font variables (--font-geist-sans, --font-geist-mono)
- Dark mode support via CSS classes
- Component styling follows Tailwind utility-first approach

### TypeScript Configuration
- Strict mode enabled
- ES2017 target with modern module resolution
- Next.js plugin integration for enhanced TypeScript support

