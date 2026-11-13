import * as THREE from 'three';
// Two procedural hands parented to the camera: the "smart-glasses POV" body.
const SKIN = new THREE.MeshStandardMaterial({ color: 0xc08560, roughness: .55 });
const CUFF = new THREE.MeshStandardMaterial({ color: 0xe9e2d0, roughness: .9 });
function seg(len, r) {
  const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 4, 8), SKIN);
  m.rotation.x = Math.PI / 2; m.position.z = -(len / 2 + r); return m;
}
function finger(x, l1, l2, r, z = -.095) {
  const p1 = new THREE.Group(); p1.position.set(x, 0, z); p1.add(seg(l1, r));
  const p2 = new THREE.Group(); p2.position.z = -(l1 + 2 * r) + r * .6; p2.add(seg(l2, r * .9)); p1.add(p2);
  return { p1, p2 };
}
function makeHand() {
  const g = new THREE.Group(), fingers = [];
  const palm = new THREE.Mesh(new THREE.BoxGeometry(.085, .024, .097), SKIN); palm.position.z = -.048; g.add(palm);
  [[-.03, .026], [-.01, .032], [.01, .029], [.03, .022]].forEach(([x, l]) => { const f = finger(x, l, l * .85, .0085); g.add(f.p1); fingers.push(f); });
  const th = finger(0, .026, .022, .0095, 0); th.p1.position.set(.047, -.002, -.03); th.p1.rotation.y = -.75; g.add(th.p1);
  const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(.04, .05, .3, 14), CUFF); sleeve.rotation.x = Math.PI / 2; sleeve.position.z = .15; g.add(sleeve);
  return { g, fingers, thumb: th, curl: .2 };
}
const POSES = {
  idle:    { r: [.22, -.27, -.34, -.35, .22, -.12, .22], l: [-.22, -.27, -.34, -.35, -.22, .12, .22] },
  reach:   { r: [.1, -.13, -.62, -.05, .08, -.08, 0], l: [-.22, -.27, -.34, -.35, -.22, .12, .22] },
  hold:    { r: [.18, -.29, -.40, -.12, .2, -.2, .9], l: [-.22, -.27, -.34, -.35, -.22, .12, .25] },
  inspect: { r: [.13, -.2, -.36, -.1, .15, -.1, 1], l: [-.13, -.2, -.36, -.1, -.15, .1, 1] },
};
export class Hands {
  constructor(camera) {
    this.R = makeHand(); this.L = makeHand(); this.L.g.scale.x = -1;
    this.mode = 'idle'; this.t = 0; this.moving = false;
    this.root = new THREE.Group(); this.root.add(this.R.g, this.L.g); camera.add(this.root);
    this.apply(this.R, POSES.idle.r, 1); this.apply(this.L, POSES.idle.l, 1);
  }
  apply(h, p, k, sway = 0) {
    h.g.position.x += (p[0] - h.g.position.x) * k; h.g.position.y += (p[1] + sway - h.g.position.y) * k; h.g.position.z += (p[2] - h.g.position.z) * k;
    h.g.rotation.x += (p[3] - h.g.rotation.x) * k; h.g.rotation.y += (p[4] - h.g.rotation.y) * k; h.g.rotation.z += (p[5] - h.g.rotation.z) * k;
    h.curl += (p[6] - h.curl) * k;
    h.fingers.forEach((f, i) => { f.p1.rotation.x = h.curl * (1.0 - i * .05); f.p2.rotation.x = h.curl * 1.1; });
    h.thumb.p1.rotation.x = h.curl * .6; h.thumb.p2.rotation.x = h.curl * .7;
  }
  update(dt, moving) {
    this.t += dt * (moving ? 9 : 1.6);
    const k = Math.min(1, dt * 12), sway = Math.sin(this.t) * (moving ? .006 : .0015);
    const P = POSES[this.mode] || POSES.idle;
    this.apply(this.R, P.r, k, sway); this.apply(this.L, P.l, k, -sway);
  }
}
