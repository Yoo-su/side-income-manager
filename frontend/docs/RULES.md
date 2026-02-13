# Frontend Project Rules

## 1. General Principles

- **Maintainability & Extensibility**: Code must be written with future growth in mind.
- **Documentation**: Every feature must have a `README.md`.
- **Language**: All code, comments, and documentation must be in **Korean** (unless standard English terminology is required for technical precision).
- **Type Safety**: The usage of the `any` type is **strictly prohibited**. Use generic types, `unknown`, or proper interfaces/types instead.

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
- **Styling**: **Tailwind CSS** + **shadcn/ui**.

## 5. Design Guidelines

- **Philosophy**: Clean, intuitive, and unique. Avoid generic "bootstrappy" looks.
- **Restrictions**:
  - **Icons**: Minimize usage of standard `lucide-react` icons. Use alternatives or custom assets where possible for a unique feel.
  - **Shapes**: Avoid excessive rounded corners (no pill-shaped buttons everywhere unless intentional).
  - **Colors**: Avoid overuse of gradients. Stick to solid, sophisticated color palettes.
- **Tools**: Use **shadcn/ui** for rapid component development but customize base styles to avoid the "default shadcn look".

## 5. Documentation Requirements

**Every Feature Directory (`src/features/<feature-name>`) must contain:**

### `README.md`

- **Purpose**: Explains the feature's structure, responsibility, and usage.
- **Sync**: Must be updated whenever the feature structure or logic changes.

## 6. Development Workflow

1.  **Plan**: Understand requirements.
2.  **Implement**: Write code following architectural rules.
3.  **Document**: Update `README.md` with the final implementation details.
