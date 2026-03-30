# GEMINI Agent Guidelines

This project uses AI-driven tooling and agent patterns. The following principles apply specifically to Gemini-context usage:

- Keep user-facing content formal, direct, and factual.
- Avoid superlative or exaggerated copy in documentation, UI text, and marketing-style language.
- Prefer clear, concise explanations of behavior, edge cases, and failure modes.
- For implementation details, prioritize robust patterns: defensive checks, explicit typing, and predictable state management.
- Use the same touchpoints as existing agent instructions in `AGENTS.md` and `CLAUDE.md`.

## Practical instructions

1. Validate framework assumptions against local docs (`node_modules/next/dist/docs/`).
2. Avoid speculative statements about feature capability beyond the implemented scope.
3. Target accessible and maintainable code.
4. In client-facing content, mention limitations explicitly when relevant (e.g., "Data can be stale up to X minutes").

## Output style

- Use neutral, precise language.
- Keep paragraph length moderate (2-4 sentences).
- Use list formatting for guidance and decision points.
