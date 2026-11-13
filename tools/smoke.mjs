// Headless sanity test: builds the whole world + hands + holder with no browser and ticks them.
globalThis.addEventListener = () => {};
const THREE = await import('three');
const { buildWorld } = await import('../src/world/index.js');
const { Hands } = await import('../src/engine/hands.js');
const { Holder } = await import('../src/engine/holder.js');
const { Player } = await import('../src/engine/player.js');
const { tick } = await import('../src/engine/tween.js');
const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(); scene.add(cam);
const ctx = buildWorld(scene), hands = new Hands(cam), pl = new Player(cam, ctx.colliders);
const say = []; const hold = new Holder(scene, cam, hands, { say: t => say.push(t) });
console.log('items', ctx.items.length, 'targets', ctx.targets.length, 'meshes', (() => { let n = 0; scene.traverse(o => o.isMesh && n++); return n; })());
const types = {}; ctx.items.forEach(i => types[i.def.type] = (types[i.def.type] || 0) + 1); console.log(types);
for (const type of ['packet', 'box', 'jar', 'pencilbox', 'car', 'dvd', 'cassette', 'top']) {
  const it = ctx.items.find(i => i.def.type === type); if (!it) { console.log('MISSING', type); continue; }
  hold.pick(it); for (let i = 0; i < 30; i++) { hold.update(.02); hands.update(.02, false); tick(.02); }
  if (hold.item !== it) throw new Error('not held ' + type);
  hold.toggleInspect(); hold.rotate(10, 5); it.obj.actions.forEach((a, i) => hold.action(i));
  for (let i = 0; i < 30; i++) { hold.update(.02); tick(.02); ctx.tick.forEach(f => f(.02, i * .02)); }
  hold.putBack(); for (let i = 0; i < 120; i++) { hold.update(.02); tick(.02); }
  if (it.g.parent !== it.home.parent) throw new Error('not returned ' + type);
  console.log('ok', type, it.def.id);
}
pl.enabled = true; pl.keys.KeyW = 1; for (let i = 0; i < 400; i++) pl.update(.016); console.log('player at', pl.pos.x.toFixed(2), pl.pos.z.toFixed(2));
console.log('SMOKE PASS');
