# ADR 0001: Modular Monolith for MVP

## Decision

Use a modular monolith with one frontend app, one backend app, and a separate local print-agent process.

## Rationale

This keeps implementation speed high for the 3-day MVP while preserving clear module boundaries and future extraction paths.
