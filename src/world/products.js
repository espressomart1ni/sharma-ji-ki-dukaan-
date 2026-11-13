import * as THREE from 'three';
import { std, mapMat, box, cyl, mesh } from './materials.js';
import { to } from '../engine/tween.js';
import { sfx, tone } from '../engine/audio.js';
import { DVD_TEX } from '../config.js';
const rnd = (a, b) => a + Math.random() * (b - a);

function packet(d) {
  const g = new THREE.Group(), w = .17, h = .24, t = .036, sm = std(d.color, { roughness: .8 }), fm = mapMat(`products/${d.id}.png`, { roughness: .5 });
  mesh(g, box(w, h, t), [sm, sm, sm, sm, fm, sm]);
  const foil = std(0xd8d8d8, { roughness: .35, metalness: .4 });
  const top = mesh(g, box(w + .004, .014, t + .012), foil, 0, h / 2, 0); mesh(g, box(w + .004, .014, t + .012), foil, 0, -h / 2, 0);
  const spec = { biscuit: [0xd9a85a, .045, .007], cracker: [0xe8d5a0, .04, .006], chips: [0xf2c744, .05, .004], candy: [new THREE.Color(d.color).getHex(), .024, .02] }[d.content] || [0xd9a85a, .04, .006];
  let pieces = [], open = false;
  const ensure = () => { if (pieces.length) return; pieces = [0, 1, 2].map(() => { const p = mesh(g, cyl(spec[1], spec[1], spec[2], 14), std(spec[0], { roughness: .7 }), 0, 0, 0); p.rotation.x = Math.PI / 2; p.scale.setScalar(.001); return p; }); };
  return { g, base: h / 2, ensure, actions: [{ label: 'Tear it open', fn: () => {
    if (open) return 'Already open. Crumbs everywhere.'; open = true; ensure(); sfx.crinkle();
    to(top.rotation, { x: -.9 }); to(top.position, { y: h / 2 + .02, z: -t / 2 });
    pieces.forEach((p, i) => { to(p.scale, { x: 1, y: 1, z: 1 }, 6); to(p.position, { y: h / 2 + .045 + i * .016, z: .002 * i }, 6); });
    return `Torn open. ${d.content === 'candy' ? 'Sweet.' : d.content === 'chips' ? 'Salty.' : 'Crunch.'}`; } }] };
}

function boxItem(d) {
  const g = new THREE.Group(), w = .15, h = .19, t = .05, wm = std(0xf4f1ea), fm = mapMat(`products/${d.id}.png`);
  mesh(g, box(w, h, t), [wm, wm, wm, wm, fm, wm]);
  const sticks = [];
  const ensure = () => { if (sticks.length) return; for (let r = 0; r < 2; r++) for (let i = 0; i < 8; i++) {
    const s = new THREE.Group(); s.position.set(-.056 + i * .016, h / 2 - .02, -.01 + r * .02);
    mesh(s, cyl(.0065, .0065, .13, 8), std(0xffffff)); mesh(s, cyl(.0072, .0072, .016, 8), std(0xe0405a), 0, .065, 0); g.add(s); sticks.push(s); } };
  const lid = new THREE.Group(); lid.position.set(0, h / 2, -t / 2); g.add(lid);
  mesh(lid, box(w, .07, t), [wm, wm, wm, wm, fm, wm], 0, .035, t / 2);
  let open = false, n = 0; const openLid = () => { ensure(); if (!open) { open = true; to(lid.rotation, { x: -2 }); sfx.put(); } };
  return { g, base: h / 2, ensure, actions: [
    { label: 'Flip the lid', fn: () => { ensure(); open = !open; to(lid.rotation, { x: open ? -2 : 0 }); sfx.put(); } },
    { label: 'Take one', fn: () => { openLid(); const s = sticks[sticks.length - 1 - n]; if (!s) return 'Empty. Obviously.'; n++; to(s.position, { y: s.position.y + .16, z: s.position.z + .08 }); to(s.rotation, { x: .5 }); sfx.crunch(); return 'Tastes like sugar chalk. Looks like trouble.'; } }] };
}

function jar(d) {
  const g = new THREE.Group(), marble = d.variant === 'marble', R = .075, H = .2, cs = [];
  mesh(g, cyl(R, R, H, 20), new THREE.MeshStandardMaterial({ color: 0xcfe8e0, transparent: true, opacity: .28, roughness: .1, depthWrite: false }));
  const lid = new THREE.Group(); lid.position.y = H / 2 + .01; g.add(lid);
  mesh(lid, cyl(R + .004, R + .004, .02, 20), std(0xe0561f), 0, .01, 0);
  const cols = marble ? [0x2ab7ca, 0xe63946, 0xffd166, 0x06d6a0, 0x9b5de5] : [0xe63946, 0xf4a261, 0xffd166, 0x2a9d8f, 0xe76f51, 0x9b5de5, 0x06d6a0, 0xf15bb5];
  const candy = (i, full) => {
    const c = new THREE.Group();
    if (marble) mesh(c, new THREE.SphereGeometry(.014, 10, 8), std(cols[i % 5], { roughness: .1, metalness: .1 }));
    else { mesh(c, new THREE.SphereGeometry(.016, 8, 6), std(cols[i % 8])).scale.set(1.3, .8, .8); if (full) [1, -1].forEach(s => { const k = mesh(c, new THREE.ConeGeometry(.009, .018, 6), std(0xffffff), s * .026, 0, 0); k.rotation.z = -s * Math.PI / 2; }); }
    c.position.set(rnd(-.05, .05), -H / 2 + .02 + rnd(0, .1), rnd(-.05, .05)); c.rotation.set(rnd(0, 3), rnd(0, 3), 0); g.add(c); cs.push(c);
  };
  for (let i = 0; i < 8; i++) candy(i, false);
  let full = false; const ensure = () => { if (full) return; full = true; for (let i = 8; i < 22; i++) candy(i, true); };
  let open = false, n = 0; const openLid = () => { ensure(); if (!open) { open = true; to(lid.position, { y: H / 2 + .12, x: .06 }); to(lid.rotation, { z: -.5 }); sfx.glass(); } };
  return { g, base: H / 2, ensure, actions: [
    { label: 'Open the lid', fn: () => { ensure(); open = !open; to(lid.position, { y: open ? H / 2 + .12 : H / 2 + .01, x: open ? .06 : 0 }); to(lid.rotation, { z: open ? -.5 : 0 }); sfx.glass(); } },
    { label: marble ? 'Take a marble' : 'Take a toffee', fn: () => { openLid(); const c = cs.filter(x => !x.userData.taken).sort((a, b) => b.position.y - a.position.y)[0]; if (!c) return 'The jar is empty. Uncle will notice.'; c.userData.taken = true; n++; to(c.position, { x: .13, y: .05 + n * .02, z: .06 }); to(c.scale, { x: 1.8, y: 1.8, z: 1.8 }); sfx.crinkle(); return marble ? 'A swirl. You’d trade three plain ones for it.' : ['Strawberry. Good.', 'Orange. Always orange.', 'The one that sticks to your teeth.'][n % 3]; } }] };
}

function pencilbox(d) {
  const g = new THREE.Group(), W = .34, H = .085, D = .13, hm = std(0x3d6bc4), fm = mapMat(`products/${d.id}.png`, { roughness: .4 });
  mesh(g, box(W, H, D), [hm, hm, hm, hm, fm, hm]);
  const A = new THREE.Group(), B = new THREE.Group(); A.position.y = H * .22; B.position.y = -H * .22; g.add(A, B);
  let filled = false;
  const ensure = () => { if (filled) return; filled = true;
    mesh(A, box(W - .01, .01, D - .012), std(0xe8e8e8)); mesh(B, box(W - .01, .01, D - .012), std(0xe8e8e8));
    [0xe63946, 0xffd166, 0x2a9d8f, 0x4361ee].forEach((c, i) => { const p = mesh(A, cyl(.006, .006, .12, 6), std(c), .12, .012, -.04 + i * .027); p.rotation.z = Math.PI / 2; });
    mesh(A, box(.035, .014, .024), std(0xf4a0b5), .15, .014, .03); mesh(A, box(.03, .016, .022), std(0xc0c0c0), .12, .014, .035);
    const st = mesh(B, new THREE.PlaneGeometry(.07, .07), new THREE.MeshStandardMaterial({ color: 0xf72585, side: THREE.DoubleSide, metalness: .6, roughness: .25 }), -.13, .008, 0); st.rotation.x = -Math.PI / 2;
    mesh(B, new THREE.SphereGeometry(.013, 12, 10), std(0x2ab7ca, { roughness: .1 }), -.1, .014, .025); };
  let a = false, b = false;
  return { g, base: H / 2, ensure, actions: [
    { label: 'Slide top compartment', fn: () => { ensure(); a = !a; to(A.position, { x: a ? .26 : 0 }); sfx.slide(); return a ? 'Pencils, a scented eraser, a sharpener with half a blade.' : null; } },
    { label: 'Slide bottom compartment', fn: () => { ensure(); b = !b; to(B.position, { x: b ? -.26 : 0 }); sfx.slide(); return b ? 'A shiny sticker and a swirl marble. The good stuff.' : null; } }] };
}

function car(d) {
  const g = new THREE.Group(), c = new THREE.Group(); g.add(c);
  const hood = mapMat(`products/${d.id}.png`, { roughness: .3, metalness: .3 }), red = std(0xd62828, { roughness: .3, metalness: .3 });
  mesh(c, box(.22, .035, .1), [red, red, hood, red, red, red]); mesh(c, box(.11, .03, .085), red, -.015, .03, 0); mesh(c, box(.1, .018, .088), std(0x1a2a3a, { roughness: .1 }), -.015, .032, 0);
  mesh(c, box(.026, .008, .104), std(0x222222), -.1, .045, 0); mesh(c, box(.22, .005, .08), std(0x999999), 0, -.021, 0);
  const ws = [];
  [[-.07, .052], [-.07, -.052], [.07, .052], [.07, -.052]].forEach(([x, z]) => { const p = new THREE.Group(); p.position.set(x, -.018, z); c.add(p); mesh(p, cyl(.024, .024, .016, 16), std(0x222222)).rotation.x = Math.PI / 2; mesh(p, cyl(.012, .012, .018, 8), std(0xcfcfcf, { metalness: .8, roughness: .3 })).rotation.x = Math.PI / 2; ws.push(p); });
  let roll = false, fl = false;
  return { g, base: .03, actions: [
    { label: 'Roll it', fn: () => { roll = !roll; tone(120, .4, 'sawtooth', .04, 300); return null; } },
    { label: 'Flip it over', fn: () => { fl = !fl; to(c.rotation, { x: fl ? Math.PI : 0 }); sfx.put(); return fl ? 'Made-in stamp, a rivet, a tiny axle. The best part.' : null; } }],
    update: dt => { if (roll) ws.forEach(w => { w.rotation.z -= dt * 12; }); return roll; } };
}

function dvd(d) {
  const g = new THREE.Group(), w = .135, h = .19, dk = std(0x1c1c1e, { roughness: .4 });
  mesh(g, box(w, h, .011), dk, 0, 0, -.002);
  const disc = mesh(g, cyl(.055, .055, .0015, 40), new THREE.MeshStandardMaterial({ color: 0xdcdcf0, metalness: .95, roughness: .2 }), 0, .01, .0045); disc.rotation.x = Math.PI / 2;
  mesh(g, cyl(.012, .012, .002, 16), dk, 0, .01, .0052).rotation.x = Math.PI / 2;
  const piv = new THREE.Group(); piv.position.set(-w / 2, 0, .0075); g.add(piv);
  const cm = mapMat(DVD_TEX(d.id), { roughness: .25 }); mesh(piv, box(w, h, .003), [dk, dk, dk, dk, cm, dk], w / 2, 0, 0);
  let open = false, out = false;
  return { g, base: h / 2, isDVD: true, actions: [
    { label: 'Open the case', fn: () => { open = !open; to(piv.rotation, { y: open ? -2.5 : 0 }); sfx.put(); return null; } },
    { label: 'Take the disc', fn: () => { if (!open) { open = true; to(piv.rotation, { y: -2.5 }); } out = !out; to(disc.position, { y: out ? .09 : .01, z: out ? .05 : .0045 }); sfx.pop(); return out ? 'A little rainbow in the light. Hold it by the edges, always.' : null; } }] };
}

function cassette(d) {
  const g = new THREE.Group(), w = .11, h = .07, t = .014, bm = std(0x2b2a28), fm = mapMat(`products/${d.id}.png`, { roughness: .4 });
  mesh(g, box(w, h, t), [bm, bm, bm, bm, fm, bm]);
  mesh(g, box(.07, .022, .001), std(0x111111), 0, -.012, t / 2 + .0005);
  const reels = [-.02, .02].map(x => { const r = mesh(g, cyl(.01, .01, .0015, 12), std(0xf4f4f0), x, -.012, t / 2 + .0016); r.rotation.x = Math.PI / 2; mesh(r, box(.014, .003, .002), bm); return r; });
  let play = false, tm = 0;
  return { g, base: h / 2, actions: [{ label: 'Play it', fn: () => { play = !play; tm = 0; if (play) sfx.tape(); return play ? 'Hiss, then the song. You pressed Record and Play together.' : null; } }],
    update: dt => { if (play) { reels.forEach(r => { r.rotation.y += dt * 6; }); tm += dt; if (tm > 6) play = false; } return play; } };
}

function top(d) {
  const g = new THREE.Group(), body = new THREE.Group(); g.add(body);
  const pts = [[0, -.045], [.008, -.035], [.04, .0], [.038, .02], [.016, .034], [.006, .05], [0, .052]].map(([x, y]) => new THREE.Vector2(x, y));
  mesh(body, new THREE.LatheGeometry(pts, 20), std(0xd24b2a, { roughness: .4 })); mesh(body, new THREE.TorusGeometry(.039, .004, 6, 24), std(0xffd24a), 0, .008, 0).rotation.x = Math.PI / 2;
  mesh(body, cyl(.003, .001, .02, 6), std(0xb0b0b0, { metalness: .9, roughness: .3 }), 0, -.054, 0);
  let sp = 0;
  return { g, base: .05, actions: [{ label: 'Spin it', fn: () => { sp = 30; tone(180, 1.4, 'sawtooth', .03, 90); return 'Wound the string, wrist flick, and… it dances.'; } }],
    update: dt => { body.rotation.y += sp * dt; body.rotation.z = Math.sin(performance.now() * .01) * Math.min(.25, sp * .008); sp *= Math.exp(-dt * .55); if (sp < .3) { sp = 0; body.rotation.z = 0; } return sp > 0; } };
}

const BUILD = { packet, box: boxItem, jar, pencilbox, car, dvd, cassette, top };
// An "item" wraps a def + its built 3D object and is what the player can pick up.
export function createItem(def) {
  const obj = BUILD[def.type](def), item = { def, obj, g: obj.g, home: null };
  const b = new THREE.Box3().setFromObject(obj.g), s = b.getSize(new THREE.Vector3()); item.dim = Math.max(s.x, s.y, s.z, .05);
  obj.g.userData.item = item; return item;
}
