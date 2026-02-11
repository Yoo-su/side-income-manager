# Backend Project Rules

## 1. General Principles

- **Maintainability & Extensibility**: Code must be written with future growth in mind.
- **Documentation**: Every feature must have a `README.md` and `FLOW.md`.
- **Language**: All code, comments, and documentation must be in **Korean** (unless standard English terminology is required for technical precision).

## 2. Architecture

- **Pattern**: Feature-based Architecture (Not FSD).
- **Structure**:
  - `src/features`: Contains domain-specific features.
  - `src/shared`: Contains shared services, modules, utilities, etc.
- **Layers**: Strict adherence to NestJS layers (Controller -> Service -> Repository).
- **File Size Limit**: Files should be kept around **200 lines**.
  - **Strategy**: Separate concerns within controllers and services. Split large services into smaller, specialized services or use helper classes/functions within the feature folder.

## 3. Testing & Documentation

- **Swagger**: Mandatory for all API endpoints. Use `@nestjs/swagger` decorators to fully document DTOs, responses, and parameters.
- **TDD/Testing**: (Implied: Ensure testability via Swagger).

## 4. Technology Stack

- **Framework**: NestJS + TypeScript.
- **Database**: (Implied: TypeORM or Prisma - verify preference if needed, defaulting to standard NestJS practice or user instruction. Current instruction: NestJS).

## 5. Documentation Requirements

**Every Feature Directory (`src/features/<feature-name>`) must contain:**

### `README.md`

- **Purpose**: Explains the feature's structure, responsibility, usage, and API contracts.
- **Sync**: Must be updated whenever the feature structure or logic changes.

### `FLOW.md`

- **Purpose**: Development log.
- **Content**:
  - What was implemented.
  - Why changes were made (context, requirements).
  - How it was implemented (technical details).
- **Sync**: Must be updated with every significant change or commit.

## 6. Development Workflow

1.  **Plan**: Understand requirements and update `FLOW.md` with the plan.
2.  **Implement**: Write code following architectural rules. Ensure Swagger decorators are added.
3.  **Document**: Update `README.md` and `FLOW.md` with the final implementation details.
