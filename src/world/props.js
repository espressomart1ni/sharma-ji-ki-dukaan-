import * as THREE from 'three';
import { std, mapMat, tex, box, cyl, mesh } from './materials.js';
import { sfx } from '../engine/audio.js';
import { to } from '../engine/tween.js';
// Counter, drawer, Sharma uncle, CRT computer, radio, scale, calculator, phone, hanging snack strips.
export function buildProps(scene, ctx) {
  const hot = (o, name, prompt, act) => { o.userData = { name, prompt, act }; ctx.targets.push(o); return o; };
  const wood = std(0xffffff, { map: tex('textures/wood.png', { repeat: [3, 1] }), roughness: .6 });
  mesh(scene, box(4.5, .95, .8), wood, -1.7, .475, -3); mesh(scene, box(4.6, .06, .9), std(0xb98b57, { roughness: .5 }), -1.7, .97, -3);
  const dr = mesh(scene, box(.9, .24, .62), std(0x84552f), -.9, .55, -2.62);
  mesh(dr, cyl(.03, .03, .04), std(0xd8b24a, { metalness: .7, roughness: .3 }), 0, 0, .33).rotation.x = Math.PI / 2;
  hot(dr, 'Counter drawer', 'Open / close', () => { const o = dr.position.z > -2.5; to(dr.position, { z: o ? -2.62 : -2.2 }); sfx.slide(); if (!o) ctx.hooks.found('drawer', 'Inside: a rubber-banded wad of ten-rupee notes, a pencil stub and the udhaar ledger. Some names are crossed out. Most are not.'); });
  // Sharma uncle
  const sk = new THREE.Group(); sk.position.set(-2.1, 0, -3.85); scene.add(sk); const skin = std(0xb07a52);
  mesh(sk, cyl(.2, .2, .45), std(0x6d4a2a), 0, .22, 0); mesh(sk, box(.5, .6, .3), std(0xe6d9b8), 0, 1.0, 0); mesh(sk, box(.52, .42, .32), std(0x7a1f2b), 0, .92, .01);
  const hd = new THREE.Group(); hd.position.y = 1.45; sk.add(hd); mesh(hd, new THREE.SphereGeometry(.14, 16, 12), skin);
  mesh(hd, new THREE.SphereGeometry(.13, 12, 8, 0, 6.28, 0, 1.3), std(0xcfcfcf), 0, .02, -.02).scale.set(1.05, .9, 1.05); mesh(hd, box(.1, .025, .04), std(0x222222), 0, -.04, .13);
  [-.05, .05].forEach(x => mesh(hd, new THREE.TorusGeometry(.04, .007, 6, 14), std(0x222222), x, .02, .13)); mesh(hd, new THREE.SphereGeometry(.025, 8, 6), skin, 0, -.01, .14);
  [-.27, .27].forEach(x => { mesh(sk, cyl(.05, .05, .5), std(0xe6d9b8), x, .98, .2).rotation.x = 1.3; });
  hot(sk, 'Sharma uncle', 'Talk', () => ctx.hooks.talk()); ctx.keeper = sk;
  // CRT computer
  const crt = new THREE.Group(); crt.position.set(-.9, .97, -3.3); scene.add(crt); const bg = std(0xd2cab0, { roughness: .6 });
  mesh(crt, box(.52, .46, .44), bg, 0, .3, 0); mesh(crt, box(.34, .34, .3), bg, 0, .3, -.35);
  mesh(crt, new THREE.PlaneGeometry(.38, .3), new THREE.MeshBasicMaterial({ map: tex('textures/wallpaper.png') }), 0, .32, .222);
  const kb = mesh(scene, box(.46, .025, .16), std(0xcfc7ac), -.9, .99, -2.8); mesh(scene, box(.22, .5, .42), bg, -.3, 1.22, -3.45);
  hot(crt, 'The old computer', 'Use the computer', () => ctx.hooks.computer()); hot(kb, 'Keyboard', 'Use the computer', () => ctx.hooks.computer());
  // decor with a story
  const jarG = [[-3.6, 0xe63946], [-3.15, 0xffd166]];
  jarG.forEach(([x, c]) => { const j = new THREE.Group(); j.position.set(x, .97, -2.8); scene.add(j); mesh(j, cyl(.14, .14, .34, 18), new THREE.MeshStandardMaterial({ color: 0xcfe8e0, transparent: true, opacity: .3, depthWrite: false }), 0, .17, 0); for (let k = 0; k < 26; k++) mesh(j, new THREE.SphereGeometry(.03, 8, 6), std([c, 0xf4a261, 0x2a9d8f, 0xffffff][k % 4]), (Math.random() - .5) * .18, .03 + Math.random() * .2, (Math.random() - .5) * .18); mesh(j, cyl(.15, .15, .04, 18), std(0xe0561f), 0, .36, 0); hot(j, 'Counter toffee jar', 'Look', () => ctx.hooks.say('The big counter jar. Uncle counts the toffees, not the money.')); });
  const nk = mesh(scene, box(.06, .12, .02), std(0x2c3a4a), -1.9, 1.03, -2.55); nk.rotation.x = -1.2;
  hot(nk, 'Candy-bar phone', 'Pick up', () => ctx.hooks.found('nokia', 'Snake II. Everyone’s record was 200-something and nobody believed anyone else’s.'));
  const rad = mesh(scene, box(.3, .18, .09), std(0x5a3722), -1.5, 1.06, -2.75); mesh(rad, box(.12, .1, .01), std(0xe8c36a), .06, 0, .05);
  hot(rad, 'Transistor radio', 'Turn the dial', () => { sfx.radio(); ctx.hooks.found('radio', 'Static, then a song half-tuned in. Always one notch off.'); });
  const calc = mesh(scene, box(.12, .03, .18), std(0xb9bcb5), -1.2, .995, -2.6); hot(calc, 'Calculator', 'Press keys', () => { sfx.tick(); ctx.hooks.say('Type 07734, turn it upside down. Every kid did, once.'); });
  const sc = new THREE.Group(); sc.position.set(-.1, .97, -2.9); scene.add(sc); mesh(sc, box(.34, .06, .2), std(0x2e5d47), 0, .03, 0); mesh(sc, cyl(.02, .02, .4, 8), std(0x999999), 0, .25, 0); mesh(sc, box(.55, .015, .03), std(0xb89b4c, { metalness: .7 }), 0, .45, 0); [-.26, .26].forEach(x => mesh(sc, cyl(.09, .09, .015, 16), std(0xb89b4c, { metalness: .7 }), x, .2, 0));
  hot(sc, 'Weighing scale', 'Touch', () => { sfx.put(); ctx.hooks.say('Brass pans, a stone weight, and “pav kilo” in a newspaper cone. Uncle’s thumb on the pan was legendary.'); });
  const stool = new THREE.Group(); stool.position.set(-3.1, 0, -1.4); scene.add(stool); mesh(stool, cyl(.2, .2, .04), std(0x2a5fc4), 0, .45, 0); mesh(stool, cyl(.15, .19, .43), std(0x2a5fc4), 0, .22, 0);
  hot(stool, 'Plastic stool', 'Look', () => ctx.hooks.say('Someone always sat here and talked for an hour without buying anything.'));
  // hanging snack strips
  const ids = ['parleg', 'monaco', 'unclechipps', 'poppins', 'krackjack', 'hajmola'], sway = [];
  const strip = (x, y, z, n) => { const g = new THREE.Group(); g.position.set(x, y, z); scene.add(g); mesh(g, cyl(.003, .003, n * .26 + .1), std(0x222222), 0, -(n * .26 + .1) / 2, 0); for (let i = 0; i < n; i++) { const id = ids[(Math.random() * 6) | 0], m = std(0xffffff, { map: tex(`products/${id}.png`) }); mesh(g, box(.14, .21, .02), [m, m, m, m, m, m], 0, -.17 - i * .26, 0); } g.userData.ph = Math.random() * 6; sway.push(g); };
  for (let i = 0; i < 9; i++) strip(-1.2 + i * .3, 2.68, .3, 3);
  for (let i = 0; i < 5; i++) strip(-3.4 + i * .55, 3.3, -2.2, 3);
  ctx.tick.push((dt, t) => { sway.forEach(g => { g.rotation.z = Math.sin(t * 1.3 + g.userData.ph) * .05; }); hd.rotation.y = Math.sin(t * .4) * .15; hd.rotation.x = Math.sin(t * .9) * .03; });
}
