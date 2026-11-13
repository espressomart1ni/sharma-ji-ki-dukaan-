export function assetUrl(path) {
  const base = typeof import.meta.env?.BASE_URL === 'string' ? import.meta.env.BASE_URL : './';
  return `${base}assets/${path}`;
}
