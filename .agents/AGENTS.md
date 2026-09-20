# OKISO Workspace Rules

All agents working on the OKISO website project must adhere to the following rules:

1. **Leverage Custom Workspace Skills**:
   - Always load and reference the custom workspace skills: [ux-design](file:///d:/GitHub/site/.agents/skills/ux-design/SKILL.md), [performance-engineering](file:///d:/GitHub/site/.agents/skills/performance-engineering/SKILL.md), [clean-code](file:///d:/GitHub/site/.agents/skills/clean-code/SKILL.md), [premium-frontend-ui](file:///d:/GitHub/site/.agents/skills/premium-frontend-ui/SKILL.md), [web-design-reviewer](file:///d:/GitHub/site/.agents/skills/web-design-reviewer/SKILL.md), [webapp-testing](file:///d:/GitHub/site/.agents/skills/webapp-testing/SKILL.md), and [frontend-design](file:///d:/GitHub/site/.agents/skills/frontend-design/SKILL.md).
   - Use these skills as the source of truth for design systems, asset loading, performance constraints, and coding styles.

2. **No Lazy AI Template Generation**:
   - Do not generate generic SaaS landing page layouts or default styling. All designs must match the unique virtual artist and electronic music producer aesthetic of OKISO (vibrant, high contrast, clean typography, interactive audio-visual modules).

3. **Performance First**:
   - Never introduce uncompressed images, uncompressed audio files, or auto-preloading audio elements on mount.
   - Defer 3D and other heavy interactions until the main bundle has rendered and the main thread is idle.
