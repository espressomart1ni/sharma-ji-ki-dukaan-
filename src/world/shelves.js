import * as THREE from 'three';
import { std, mapMat, tex, box } from './materials.js';
import { PRODUCTS, SHELVES, FOOTPRINT } from '../config.js';
import { createItem } from './products.js';
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
// Builds every shelf unit and stocks it with real, pickable items from the catalogue.
export function buildShelves(scene, ctx) {
  const R = rng(1998), wood = std(0xffffff, { map: tex('textures/wood.png'), roughness: .8 }), D = .4;
  for (const sh of SHELVES) {
    const g = new THREE.Group(); g.position.set(sh.pos[0], 0, sh.pos[1]); g.rotation.y = sh.rotY; scene.add(g);
    const add = (geo, x, y, z) => { const m = new THREE.Mesh(geo, wood); m.position.set(x, y, z); g.add(m); };
    add(box(sh.len, 3.2, .04), 0, 1.6, 0);
    for (let i = 0; i <= sh.len + .01; i += 1.2) add(box(.05, 3.2, D), -sh.len / 2 + i, 1.6, D / 2);
    const pool = PRODUCTS.filter(p => p.pool.some(x => sh.pool.includes(x)));
    for (let r = 0; r < 5; r++) {
      const y = .2 + r * .62; add(box(sh.len, .03, D), 0, y, D / 2);
      let u = -sh.len / 2 + .14, first = r === 2 && sh.force;
      while (u < sh.len / 2 - .2) {
        let def = first ? PRODUCTS.find(p => p.id === sh.force) : pool[R() * pool.length | 0];
        if (def.rare && R() < .65) def = pool[R() * pool.length | 0];
        if (!first && R() < .18) { u += .14; continue; }
        first = false; const fp = FOOTPRINT[def.type];
        if (u + fp > sh.len / 2 - .1) break;
        const it = createItem(def), pad = (def.type === 'dvd' ? .004 : .012);
        it.g.position.set(u + fp / 2, y + .015 + it.obj.base, D * .5); it.g.rotation.y = (R() - .5) * .12;
        g.add(it.g); ctx.items.push(it); ctx.targets.push(it.g); u += fp + pad;
      }
    }
  }
}
