# CineEval Pro - Short Film Rating System

## Overview

CineEval Pro is a full-stack web application designed for evaluating and rating short films across different cinema categories. The application provides a sophisticated interface for film critics and evaluators to systematically rate short films organized into themed rooms (Drama, Documentary, Animation, Fantasy). The system includes comprehensive rating management, statistical analysis, progress tracking, and data export capabilities for film festival or competition scenarios.

## Recent Changes

**August 21, 2025**: Added "Progreso General" section with comprehensive progress tracking:
- New dedicated Progress page accessible via navigation menu
- Real-time statistics dashboard with total shorts, rated/pending counts, and average ratings  
- Room-by-room progress visualization with completion percentages
- Performance insights and evaluation status indicators
- Responsive card-based layout with cinema-themed styling
- Dynamic updates when ratings are added or modified

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern component development
- **Routing**: Wouter for lightweight client-side routing without the overhead of React Router
- **Styling**: Tailwind CSS with a custom cinema-themed design system using CSS variables for consistent theming
- **UI Components**: Radix UI primitives with shadcn/ui for accessible, customizable components
- **State Management**: TanStack Query (React Query) for server state management, eliminating need for Redux
- **Build Tool**: Vite for fast development and optimized production builds

The frontend uses a component-based architecture with clear separation between presentational components (`components/ui/`) and business logic components (`components/`). The application follows a mobile-first responsive design approach.

### Backend Architecture
- **Runtime**: Node.js with Express.js as the web framework
- **Language**: TypeScript for full-stack type safety
- **API Design**: RESTful API architecture with clear endpoint separation
- **File Structure**: Modular organization with separate route handlers and storage abstractions
- **Development**: Hot reload with tsx for fast development iteration

The backend implements a clean architecture pattern with abstracted storage interfaces, making it easy to switch between development (in-memory) and production (database) storage implementations.

### Data Storage Solutions
- **Development**: In-memory storage with pre-populated sample data for rapid development
- **Production**: PostgreSQL database with Drizzle ORM for type-safe database operations
- **Migration Management**: Drizzle Kit for database schema migrations and versioning
- **Connection**: Neon Database serverless PostgreSQL for cloud deployment

The schema includes three main entities: rooms (cinema categories), shorts (individual films), and ratings (evaluation scores), with proper foreign key relationships.

### Authentication and Authorization
Currently implements a session-based approach with basic request logging. The architecture is prepared for future authentication enhancement with session management infrastructure already in place.

### External Service Integrations
- **Database**: Neon Database as the PostgreSQL provider for cloud-hosted database
- **Asset Management**: Unsplash integration for cinema-themed imagery
- **Export Functionality**: ExcelJS for generating downloadable rating reports
- **Development Tools**: Replit-specific integrations for cloud development environment

### Key Architectural Decisions

**Monorepo Structure**: Single repository with `client/`, `server/`, and `shared/` directories for code reuse and type sharing between frontend and backend.

**Type-Safe API Layer**: Shared TypeScript schemas between client and server using Zod for runtime validation and compile-time type checking.

**Progressive Enhancement**: Application works with basic functionality and enhances with JavaScript, ensuring accessibility and performance.

**Optimistic UI Updates**: Client-side state updates with server synchronization for responsive user experience during rating operations.

**Flexible Storage Pattern**: Abstract storage interface allows seamless transition from development (in-memory) to production (PostgreSQL) without changing business logic.

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM for frontend framework
- **Backend Framework**: Express.js for server-side API handling
- **TypeScript**: Full-stack type safety and developer experience
- **Vite**: Modern build tool for fast development and optimized production builds

### Database and ORM
- **PostgreSQL**: Primary database for production use
- **Drizzle ORM**: Type-safe database operations and schema management
- **Neon Database**: Serverless PostgreSQL hosting for cloud deployment
- **Drizzle Kit**: Database migration and schema management tools

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Radix UI**: Accessible component primitives for complex UI interactions
- **Lucide React**: Consistent icon system for the application interface
- **shadcn/ui**: Pre-built component system built on Radix UI primitives

### State Management and Data Fetching
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Form state management with validation
- **Zod**: Schema validation for runtime type checking

### Development and Build Tools
- **tsx**: TypeScript execution for development server
- **esbuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration
- **Autoprefixer**: CSS vendor prefix automation

### Utility Libraries
- **date-fns**: Date manipulation and formatting utilities
- **clsx**: Conditional CSS class name utility
- **ExcelJS**: Excel file generation for data export functionality
- **nanoid**: Unique ID generation for various application needs

### Replit-Specific Integrations
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Development tooling integration