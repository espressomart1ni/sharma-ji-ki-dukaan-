import * as THREE from 'three';
import { std, mapMat, tex, box, cyl, mesh } from './materials.js';
import { LIGHT } from '../config.js';
// Street, facade, signboard, interior shell, lights, ceiling fan, posters, bicycle, pole.
export function buildShell(scene, ctx) {
  const B = (w, h, d, m, x, y, z) => mesh(scene, box(w, h, d), m, x, y, z);
  scene.background = new THREE.Color(0xcfdad6); scene.fog = new THREE.Fog(0xcfdad6, 22, 75);
  const sun = new THREE.DirectionalLight(0xffe0ae, LIGHT.sun); sun.position.set(-6, 9, 14); scene.add(sun);
  const hemi = new THREE.HemisphereLight(0xdfe9f2, 0x6b5a48, 1.0); scene.add(hemi);
  const road = mesh(scene, new THREE.PlaneGeometry(90, 90), mapMat('textures/asphalt.png', { roughness: .95 }), 0, 0, 30); road.rotation.x = -Math.PI / 2; road.material.map = tex('textures/asphalt.png', { repeat: [14, 14] });
  B(24, .14, 2.4, std(0xa59f93), 0, .07, 1.4); B(24, .14, .4, std(0x77736b), 0, .07, 2.8);
  const floor = mesh(scene, new THREE.PlaneGeometry(8, 10), std(0xffffff, { map: tex('textures/floor_tile.png', { repeat: [4, 5] }), roughness: .45 }), 0, .01, -5); floor.rotation.x = -Math.PI / 2;
  const fm = mapMat('textures/facade.png');
  B(2.6, 4.6, .4, fm, -2.7, 2.3, 0); B(2.6, 4.6, .4, fm, 2.7, 2.3, 0); B(2.8, 1.9, .4, fm, 0, 3.65, 0);
  B(9, 6.5, 10, std(0xc98a72), -8.5, 3.25, -5.2); B(9, 5.5, 10, std(0x8e9fb5), 8.5, 2.75, -5.2);
  for (let i = 0; i < 6; i++) B(7, 8, 3, std([0xb59a6a, 0x9eb59a, 0xb07a8a][i % 3]), -18 + i * 7.5, 4, 28);
  B(2.8, .34, .3, std(0x8a8f90, { metalness: .5, roughness: .5 }), 0, 2.52, .2);
  mesh(scene, new THREE.PlaneGeometry(7.6, 1.7), mapMat('textures/sign.png', { roughness: .6 }), 0, 3.85, .21).rotation.z = -.012;
  const board = (file, w, h, x, y, rot) => { const m = mesh(scene, new THREE.PlaneGeometry(w, h), mapMat(`textures/${file}.png`), x, y, .21); m.rotation.z = rot; };
  board('board_std', 1.1, .55, -3.3, 1.9, .03); board('board_gola', .9, 1.2, -2.1, 1.6, -.02); board('board_cold', .8, .8, 3.3, 1.9, .04);
  // electric pole + wires
  mesh(scene, cyl(.09, .12, 7), std(0x6b655d), 5.3, 3.5, 4.4); B(1.8, .1, .1, std(0x4a443d), 5.3, 6.2, 4.4);
  for (let k = 0; k < 3; k++) { const pts = []; for (let i = 0; i <= 16; i++) { const t = i / 16; pts.push(new THREE.Vector3(5.3 - 10 * t, 6.2 - .1 * k - Math.sin(t * Math.PI) * .7, 4.4 - t * (3.8 - k * 1.2))); } scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x222222 }))); }
  // bicycle
  const bi = new THREE.Group(); bi.position.set(-3.2, 0, 3.4); bi.rotation.y = .5; scene.add(bi);
  const bm = std(0x1e3a8a), tm = std(0x1a1a1a), bar = (a, b, r, m) => { const A = new THREE.Vector3(...a), Bv = new THREE.Vector3(...b), d = Bv.clone().sub(A), o = mesh(bi, cyl(r, r, d.length(), 6), m); o.position.copy(A).add(Bv).multiplyScalar(.5); o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); };
  [-.5, .5].forEach(x => mesh(bi, new THREE.TorusGeometry(.34, .025, 8, 28), tm, x, .36, 0));
  bar([-.5, .36, 0], [-.1, .38, 0], .02, bm); bar([-.1, .38, 0], [.2, .72, 0], .02, bm); bar([.2, .72, 0], [.5, .36, 0], .02, bm); bar([-.1, .38, 0], [.1, .15, 0], .02, bm); bar([-.5, .36, 0], [.2, .72, 0], .02, bm); bar([.5, .36, 0], [.46, .85, 0], .02, bm); bar([.46, .88, -.25], [.46, .88, .25], .02, tm); mesh(bi, box(.3, .05, .12), tm, .2, .78, 0);
  // plastic stool outside
  const st = new THREE.Group(); st.position.set(2.8, 0, 2.2); scene.add(st); mesh(st, cyl(.22, .22, .04), std(0xd02a2a), 0, .4, 0); mesh(st, cyl(.16, .2, .38), std(0xd02a2a), 0, .2, 0);
  // interior shell
  const wall = mapMat('textures/wall_paint.png'); wall.map = tex('textures/wall_paint.png', { repeat: [4, 1] });
  B(.3, 3.6, 10, wall, -4.15, 1.8, -5); B(.3, 3.6, 10, wall, 4.15, 1.8, -5); B(8.6, 3.6, .3, wall, 0, 1.8, -10.1); B(8.6, .15, 10, std(0xd9cfaa), 0, 3.55, -5);
  ctx.tubes = [];
  [[0, -2.4, 0xfff0d0], [0, -6.5, 0xe8f0ff]].forEach(([x, z, c]) => {
    B(1.3, .05, .12, new THREE.MeshBasicMaterial({ color: 0xfff6dd }), x, 3.45, z);
    const l = new THREE.PointLight(c, LIGHT.tube, 12, 2); l.position.set(x, 3.2, z); scene.add(l); ctx.tubes.push(l);
  });
  const bulb = new THREE.PointLight(0xffa850, LIGHT.bulb, 8, 2); bulb.position.set(-2, 2.6, -3.3); scene.add(bulb);
  const fan = new THREE.Group(); fan.position.set(0, 3.3, -4.6); scene.add(fan); mesh(fan, cyl(.08, .08, .3), std(0xdddddd), 0, .1, 0);
  for (let i = 0; i < 3; i++) { const a = new THREE.Group(); a.rotation.y = i * 2.094; fan.add(a); mesh(a, box(.7, .015, .14), std(0xe4dcc4), .5, 0, 0); }
  const poster = (file, w, h, x, y, name, say) => { const m = mesh(scene, new THREE.PlaneGeometry(w, h), mapMat(`textures/${file}.png`), x, y, -9.93); m.userData = { name, prompt: 'Look closer', act: () => ctx.hooks.say(say) }; ctx.targets.push(m); };
  poster('poster_calendar', .9, 1.2, -2.2, 2.2, 'Wall calendar', 'Stuck on a month nobody turned. Free with the monthly ration of tea.');
  poster('poster_film', .9, 1.2, -.2, 2.1, 'Film poster', 'Matinee show. Half the neighbourhood bunked tuition for this.');
  poster('poster_scratch', .9, 1.2, 1.9, 2.2, 'Lucky scratch card', '“Better luck next time.” It was always better luck next time.');
  ctx.sun = sun; ctx.hemi = hemi; ctx.shellBg = new THREE.Color(0xcfdad6);
  ctx.tick.push((dt, t) => { fan.rotation.y += dt * 3.5; ctx.tubes[1].intensity = LIGHT.tube * (Math.sin(t * 37) > .97 && Math.random() < .3 ? .45 : 1); });
}
