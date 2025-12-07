# Development Patterns for "My Dashboard" Project

This document outlines the established working patterns and best practices for developing the "My Dashboard" application. These patterns ensure consistency, maintainability, and scalability across all components of the application.

## Table of Contents
1. [Frontend Development Patterns (AnalogJS/Angular)](#frontend-development-patterns-analogjsangular)
2. [Backend Development Patterns (tRPC/Prisma)](#backend-development-patterns-trpcprisma)
3. [Mobile Development Patterns (Ionic/Capacitor)](#mobile-development-patterns-ioniccapacitor)
4. [Data Flow and State Management Patterns](#data-flow-and-state-management-patterns)
5. [Error Handling and User Experience Patterns](#error-handling-and-user-experience-patterns)
6. [Testing and Quality Assurance Patterns](#testing-and-quality-assurance-patterns)

## Frontend Development Patterns (AnalogJS/Angular)

### Component Structure Pattern
- Use standalone components with explicit imports
- Follow the page component pattern with `.page.ts` suffix
- Implement `ChangeDetectionStrategy.OnPush` for performance
- Use template-driven layouts with Tailwind CSS classes
- Leverage Lucide Angular icons for consistent iconography

### Data Management Pattern
- Use services with TRPC clients for API communication
- Implement reactive patterns with RxJS observables
- Use `BehaviorSubject` for state management within components
- Apply `shareReplay(1)` for caching HTTP responses
- Use `first()` operator to complete observables after first emission

### Form Handling Pattern
- Use Formly for dynamic form generation
- Define form fields as constants in services
- Implement form submission with proper error handling
- Use UntypedFormGroup for flexible form structures
- Implement form validation directly in form components
- Use specialized form handling functions for validation and error processing

### Routing Pattern
- Use AnalogJS file-based routing with `routeMeta` for guard configuration
- Implement route guards for authentication checks (ShowNavGuard/HideNavGuard)
- Use param maps for dynamic route parameters
- Apply proper navigation with Angular Router

## Backend Development Patterns (tRPC/Prisma)

### API Design Pattern
- Structure APIs as TRPC routers with clear procedure separation
- Use Zod schemas for input validation and type safety
- Implement proper error handling with TRPCError
- Follow REST-like conventions within TRPC procedures
- Use transactions for operations that need atomicity

### Database Access Pattern
- Use Prisma Client for all database operations
- Implement proper relationship handling with includes
- Use transactions for related data operations
- Apply proper filtering for soft-deleted records
- Use proper indexing strategies for performance

### Business Logic Pattern
- Implement business rules within TRPC procedures
- Use helper functions for complex operations
- Apply proper authorization checks using context
- Implement audit logging for important operations
- Use proper error messages for different failure scenarios

### Security Pattern
- Validate all inputs with Zod schemas
- Implement user context checks for protected operations
- Use soft deletes with deletedAt timestamps
- Apply proper CORS and authentication headers
- Sanitize user data before storing in database

## Mobile Development Patterns (Ionic/Capacitor)

### Device Integration Pattern
- Use Capacitor plugins for native device features
- Implement proper error handling for device operations
- Use localStorage for persistent device identification
- Implement QR code scanning with multiple fallback libraries
- Apply image preprocessing for better recognition rates

### UI/UX Pattern
- Use Ionic components for consistent mobile UI
- Implement proper navigation between tabs/pages
- Use loading states for asynchronous operations
- Implement proper error feedback with alerts/toasts
- Follow platform-specific design guidelines

### Data Synchronization Pattern
- Use TRPC for client-server communication
- Implement proper header management for device identification
- Use reactive patterns for automatic UI updates
- Apply proper error boundaries for network failures

## Data Flow and State Management Patterns

### Authentication Pattern
- Use context-based user identification
- Implement both authenticated and anonymous modes
- Store anonymous identifiers in localStorage
- Handle user session management with proper cleanup

### Data Synchronization Pattern
- Use TRPC for client-server communication
- Implement proper header management for device identification
- Use reactive patterns for automatic UI updates
- Apply proper error boundaries for network failures

### State Management Pattern
- Use services as single source of truth for shared data
- Implement BehaviorSubject for component-level state
- Apply proper subscription management to prevent memory leaks
- Use proper data immutability practices

## Error Handling and User Experience Patterns

### Global Error Handling
- Implement centralized error handling services
- Use toast controllers for user-friendly error messages
- Apply proper logging for debugging purposes
- Implement retry mechanisms for transient failures

### User Feedback Pattern
- Use loading indicators for asynchronous operations
- Provide clear success/error feedback
- Implement undo/redo capabilities where appropriate
- Use progressive disclosure for complex operations

### Responsive Design Pattern
- Use Tailwind CSS responsive utilities
- Implement mobile-first design approach
- Apply proper spacing and typography scales
- Use conditional rendering for platform-specific features

## Testing and Quality Assurance Patterns

### Testing Strategy
- Use unit tests for services and utility functions
- Implement component tests for UI components
- Use integration tests for API endpoints
- Apply proper mocking for external dependencies

### Code Quality Patterns
- Follow consistent naming conventions
- Use proper typing with TypeScript interfaces
- Implement proper documentation for complex logic
- Apply ESLint and Prettier for code formatting
- Use proper folder organization by feature

### Performance Optimization Patterns
- Implement lazy loading for routes and modules
- Use OnPush change detection strategy
- Apply proper memoization techniques
- Optimize database queries with proper indexing
- Implement caching strategies where appropriate

## Continuous Integration and Deployment Patterns

### Version Control Pattern
- Use feature branches for new functionality
- Apply proper commit message conventions
- Implement pull request reviews for code quality
- Use GitHub Actions for automated testing

### Deployment Pattern
- Use Vercel for web application deployment
- Implement GitHub Actions for mobile builds
- Apply proper environment variable management
- Use Docker Compose for local development databases

## Future Development Guidelines

### Extensibility Patterns
- Design components and services for easy extension
- Use abstract classes and interfaces for common functionality
- Implement plugin architectures where appropriate
- Apply proper dependency injection for loose coupling

### Documentation Patterns
- Document all public APIs and services
- Use JSDoc comments for complex functions
- Maintain updated README files for each module
- Include example usage in documentation

This document should be updated as new patterns emerge during development. All team members should follow these patterns to ensure consistency across the codebase.