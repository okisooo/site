---
name: clean-code
description: General guidelines for clean programming: avoiding over-engineering, writing robust error bounds, self-testing, and clean code structure.
---

# Clean Programming Guidelines

Use these guidelines when writing, refactoring, or reviewing code to ensure the codebase remains clean, maintainable, and robust.

## 1. Avoid Over-Engineering (YAGNI)
*   **The YAGNI Rule**: Do not write code for speculative future needs. Implement only what is required for the current user request.
*   **Minimal Abstraction**: Avoid interfaces with only one implementation, factories with only one product, or complex configuration parameters for values that never change.
*   **Use Native Features**: Prefer standard library and native platform features over importing heavy third-party dependencies (e.g. standard browser hooks, native HTML5 APIs).

## 2. Code Structure & Readability
*   **Early Returns**: Use guard clauses and early returns to reduce indentation levels and clarify control flows:
    ```typescript
    if (!data) return null;
    if (error) throw new Error(error);
    // Main logic ...
    ```
*   **Single Responsibility**: Keep functions and components small. A function should do one thing and do it well. Split large visual components into reusable, focused files.
*   **TypeScript Types**: Define precise types, interfaces, or generics. Avoid using `any` unless absolutely necessary, and prefer interfaces over type aliases for objects.

## 3. Robustness & Error Bounds
*   **Graceful Degradation**: Ensure application states fail gracefully. Use React error boundaries, try-catch statements, and default fallbacks (e.g., fallback images if a source fails, static placeholders if a 3D model fails).
*   **Input Sanitization**: Validate all inputs at runtime boundaries (e.g., API requests, local storage reads, query parameters).
*   **Memory Management**: Always clean up event listeners, intervals, timers, and WebGL contexts during React component unmount phases (`useEffect` cleanup functions).

## 4. Verification & Testing
*   **Verifiable Execution**: Every non-trivial change should be verifiable. Ensure there is a manual verification path (e.g., a test script, a specific route, or a command) that proves the feature works.
*   **Clean Diffs**: Prioritize the shortest working diff. Minimize lines of code modified, and avoid unrelated changes in the same commit.
