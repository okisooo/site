---
name: ux-design
description: Advanced guidelines for human-centric UX design, visual hierarchy, typography systems, color harmony, and micro-copy for interactive sites.
---

# Advanced UX Design Guidelines

Apply these rules when designing, modifying, or critiquing user interfaces. Reject generic template patterns (cream backgrounds with serifs, dark themes with neon accents) unless explicitly requested.

## 1. Grid, Spacing & Visual Hierarchy
*   **8px Spacing System**: Derive all margins, paddings, and sizing from a base of 8px (8, 16, 24, 32, 48, 64, 96, 128). This maintains visual consistency across layout densities.
*   **Content-Driven Layouts**: The layout structure must mirror the natural reading flow of the information. Do not force content into pre-existing grid boxes.
*   **Visual Dominance**: Ensure each page has a single clear focal point (e.g., a signature element, interactive moment, or key CTA). Secondary information should be visibly distinct via scale, weight, or color opacity.

## 2. Typography & Editorial Design
*   **Intentional Type Pairing**: Limit typefaces to 2–3 families. Ensure high contrast between display (characterful, styled) and body (highly readable, clean).
*   **Scale and Weight**: Establish a clear type scale. Use weight (`font-weight`) and case (`uppercase` with tracking) to establish hierarchy rather than just shifting font sizes.
*   **Readability Constraints**: Limit body paragraphs to a maximum width of `65ch` (characters) and set line-height to `1.5` or `1.625` for comfortable reading.

## 3. Colors & Theme Systems
*   **Palette Discipline**: Restrict palettes to 1 dominant color, 1–2 supporting colors, and 1 highlight/accent color. Use color sparingly to guide focus.
*   **Contrast Bounds**: Maintain a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text (WCAG AA standard) across light and dark modes.
*   **Semantic Consistency**: Colors used for interactive states, successes, alerts, and errors must remain consistent across all components.

## 4. Animations & Micro-interactions
*   **Orchestration**: Animations must be deliberate. Use stagger effects for list reveals, and limit transitions to 200ms–350ms with custom easing curves (e.g., `cubic-bezier(0.16, 1, 0.3, 1)`).
*   **Atmosphere**: Ambient animations (such as floating background glows) should use GPU-accelerated CSS properties (`transform`, `opacity`) and run at low speeds.
*   **Performance & Control**: Always check user preferences for reduced motion. Disable heavy animations if `prefers-reduced-motion: reduce` is active.

## 5. Web Accessibility (A11y)
*   **Keyboard Navigation**: Every interactive element must be focusable using the `Tab` key, have a visible focus outline, and support standard execution (e.g., `Enter`/`Space` for buttons, `Escape` to close modals).
*   **Semantic Landmarks**: Use standard HTML5 tags (`<header>`, `<main>`, `<nav>`, `<footer>`, `<section>`) rather than nested generic `<div>` wrappers.
*   **ARIA Labels**: Elements without readable text (such as icon buttons) must have `aria-label` attributes.

## 6. Micro-copy & Tone
*   **Actionable Labeling**: Buttons must describe their outcome (e.g., "Save changes", "Download track") rather than generic terms like "Submit" or "Click here".
*   **Helpful Error States**: Error messages must state what failed and how the user can resolve it, avoiding jargon.
