# Frontend Project Rules

## 1. General Principles

- **Maintainability & Extensibility**: Code must be written with future growth in mind.
- **Documentation**: Every feature must have a `README.md` and `FLOW.md`.
- **Language**: All code, comments, and documentation must be in **Korean** (unless standard English terminology is required for technical precision).

## 2. Architecture

- **Pattern**: Feature-based Architecture (Not FSD).
- **Structure**:
  - `src/features`: Contains domain-specific features.
  - `src/shared`: Contains shared components, hooks, utilities, etc.
- **Separation of Concerns**: Use **Container-Presentational Pattern**.
  - **Container**: Handles logic, state, and API calls.
  - **Presentational**: Pure UI components, receives data via props.
- **File Size Limit**: Files should be kept around **200 lines**.
  - **Strategy**: Split components, extract logic into custom hooks, or break down complex features into smaller sub-components.

## 3. State Management

- **Server State**: `TanStack Query` (React Query).
- **Client State**: `Zustand`.

## 4. Technology Stack

- **Framework**: React + Vite + TypeScript.
- **Styling**: (To be determined, likely Tailwind or CSS Modules based on project setup - currently standard CSS/Modules or User preference). _Agent Note: Verify styling preference if not set._

## 5. Documentation Requirements

**Every Feature Directory (`src/features/<feature-name>`) must contain:**

### `README.md`

- **Purpose**: Explains the feature's structure, responsibility, and usage.
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
2.  **Implement**: Write code following architectural rules.
3.  **Document**: Update `README.md` and `FLOW.md` with the final implementation details.
