// Tiny exponential-smoothing tweener: to(obj,{x:1},speed). Re-targeting the same prop replaces the old tween.
const list = [];
export function to(o, p, s = 8) {
  for (const k in p) {
    const i = list.findIndex(q => q.o === o && q.k === k);
    if (i >= 0) list.splice(i, 1);
    list.push({ o, k, v: p[k], s });
  }
}
export function tick(dt) {
  for (let i = list.length - 1; i >= 0; i--) {
    const q = list[i];
    q.o[q.k] += (q.v - q.o[q.k]) * Math.min(1, dt * q.s);
    if (Math.abs(q.v - q.o[q.k]) < 1e-4) { q.o[q.k] = q.v; list.splice(i, 1); }
  }
}
