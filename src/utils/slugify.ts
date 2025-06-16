// /src/utils/slugify.ts
// Helper to create URL-safe slugs that match the logic previously used in legacyMockData.ts.
// We centralise it so every module imports the same function and avoids divergence.

export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with '-'
    .replace(/[^\w-]+/g, '') // Remove all non-word chars except '-'
    .replace(/--+/g, '-') // Collapse multiple '-'
    .replace(/^-+/, '') // Trim leading '-'
    .replace(/-+$/, ''); // Trim trailing '-'
