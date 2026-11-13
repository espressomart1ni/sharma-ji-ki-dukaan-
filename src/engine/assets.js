// Every runtime file request goes through here. BASE_URL is './' (see vite.config.js), so the same build works at
// https://user.github.io/ , https://user.github.io/repo-name/ , or any folder, with no hard-coded repo name.
export const assetUrl = p => `${import.meta.env.BASE_URL}assets/${p}`.replace(/^\.\//, './');
