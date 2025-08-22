# Overview

This is a web application for managing and searching affiliate records for Comfachocó EPS (a Colombian healthcare provider). The system allows users to upload Excel files containing affiliate data and search for specific affiliates by document number. It's built as a full-stack application with a React frontend and Express backend, designed to handle healthcare affiliate database queries efficiently.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: Shadcn/ui component library built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom CSS variables for theming, supporting both light and dark modes
- **State Management**: TanStack Query (React Query) for server state management with custom query client
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod for validation
- **File Processing**: Client-side Excel file processing using SheetJS (XLSX library)

The frontend follows a component-based architecture with clear separation between UI components, business logic hooks, and pages. The application uses a custom design system with predefined color schemes and components optimized for the healthcare domain.

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Session Management**: PostgreSQL-based session storage using connect-pg-simple
- **Development Setup**: Hot module replacement with Vite integration for seamless development experience

The backend currently implements a minimal API structure with placeholder routes, designed to be extended with healthcare-specific endpoints for affiliate management.

## Data Storage
- **Primary Database**: PostgreSQL with Neon Database serverless hosting
- **Schema Management**: Drizzle Kit for database migrations and schema management
- **In-Memory Storage**: Fallback memory storage implementation for development
- **File Processing**: Client-side Excel processing without server-side file storage

The database schema includes user management tables with UUID primary keys and proper indexing for performance.

## Authentication & Authorization
- **Session-based Authentication**: Uses PostgreSQL session storage
- **User Management**: Basic user schema with username/password authentication
- **Security**: CORS configuration and secure session handling

## External Dependencies
- **Database**: Neon Database (PostgreSQL serverless)
- **UI Components**: Radix UI primitives for accessible components
- **File Processing**: SheetJS for Excel file parsing
- **PDF Generation**: jsPDF and html2canvas for report generation
- **Styling**: Tailwind CSS with PostCSS processing
- **Development**: Vite with React plugin and TypeScript support
- **Deployment**: Configured for Node.js production deployment with esbuild bundling

The application integrates with external healthcare provider branding (Comfachocó EPS) and uses their logo and styling guidelines. The system is designed to handle Spanish-language content and Colombian healthcare data formats.