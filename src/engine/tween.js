const active = [];

export function to(target, values, duration = .25) {
  const from = {};
  for (const key of Object.keys(values)) from[key] = target[key];
  active.push({ target, from, values, elapsed: 0, duration: Math.max(.001, duration) });
  return target;
}

export function tick(dt) {
  for (let i = active.length - 1; i >= 0; i--) {
    const t = active[i], p = Math.min(1, (t.elapsed += dt) / t.duration);
    const ease = 1 - (1 - p) ** 3;
    for (const key of Object.keys(t.values)) t.target[key] = t.from[key] + (t.values[key] - t.from[key]) * ease;
    if (p === 1) active.splice(i, 1);
  }
}
