# Frontend Code Style Guide

This document outlines the code style and conventions for the Contacts App frontend. This guide is based on the [Vue Official Recommendation](https://v2.vuejs.org/v2/style-guide/?redirect=true "Style Guide") and [Prettier](https://www.prettier.cn/docs/install.html "Prettier usage") standards.

## 1.**Naming Conventions**

- **Components:** `PascalCase`. Component files should be named `PascalCase.vue` (e.g., `ContactForm.vue`). Root components like `App.vue` are an exception.

- **Variables & Functions:** `camelCase` (e.g., `fetchContacts`, `contactList`).

- Constants: `UPPERCASE_WITH_UNDERSCORES` (e.g., `API_BASE_URL`), though rarely used in Vue components.

## 2.**Formatting (Prettier Default)**

- **Indentation:** Use 2 spaces.

- **Quotes:** Use single quotes (`'`) for strings.

- **Semicolons:** Do not use semicolons at the end of statements.

- **Trailing Commas:** Use trailing commas where valid (e.g., in multi-line objects and arrays).

## 3.**Vue.js Best Practices**
- `<script setup>`**:** Always use the `<script setup>` syntax for Composition API.

- `v-for` **Key:** Always provide a unique `:key` with `v-for`.

- **Props:** Prop names should be `camelCase` in JavaScript but `kebab-case` in templates.

- **File Structure:** Group related files (e.g., API calls) in a dedicated `src/api` or `src/services` directory.