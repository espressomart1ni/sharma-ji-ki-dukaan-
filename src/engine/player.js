import * as THREE from 'three';
// First-person walker: WASD / arrows / joystick, mouse or touch look, circle-vs-rect collision.
export class Player {
  constructor(camera, rects, onStep) {
    this.cam = camera; this.rects = rects; this.onStep = onStep || (() => {});
    this.pos = new THREE.Vector3(0, 1.55, 9); this.yaw = 0; this.pitch = .03;
    this.keys = {}; this.joy = { x: 0, y: 0 }; this.enabled = false; this.moving = false; this.t = 0; this.stepD = 0;
    addEventListener('keydown', e => { this.keys[e.code] = 1; });
    addEventListener('keyup', e => { delete this.keys[e.code]; });
  }
  look(dx, dy) { this.yaw -= dx * .0022; this.pitch = Math.max(-1.35, Math.min(1.35, this.pitch - dy * .0022)); }
  collide(p) {
    const lim = p.z > 0 ? [-6.5, 6.5] : [-3.65, 3.65];
    p.x = Math.max(lim[0], Math.min(lim[1], p.x)); p.z = Math.max(-9.5, Math.min(14, p.z));
    for (const [x0, x1, z0, z1] of this.rects) {
      const cx = Math.max(x0, Math.min(x1, p.x)), cz = Math.max(z0, Math.min(z1, p.z));
      const dx = p.x - cx, dz = p.z - cz, d = Math.hypot(dx, dz);
      if (d < .28) { if (d > 1e-4) { p.x = cx + dx / d * .28; p.z = cz + dz / d * .28; } else p.z = z1 + .28; }
    }
  }
  update(dt) {
    const k = this.keys;
    if (this.enabled) {
      if (k.ArrowLeft) this.yaw += dt * 1.8;
      if (k.ArrowRight) this.yaw -= dt * 1.8;
      let f = (k.KeyW || k.ArrowUp ? 1 : 0) - (k.KeyS || k.ArrowDown ? 1 : 0) - this.joy.y;
      let s = (k.KeyD ? 1 : 0) - (k.KeyA ? 1 : 0) + this.joy.x;
      const m = Math.hypot(f, s); this.moving = m > .05;
      if (this.moving) {
        if (m > 1) { f /= m; s /= m; }
        const sp = (k.ShiftLeft || k.ShiftRight ? 3 : 1.7) * dt, c = Math.cos(this.yaw), sn = Math.sin(this.yaw);
        this.pos.x += (-sn * f + c * s) * sp; this.pos.z += (-c * f - sn * s) * sp;
        this.collide(this.pos); this.stepD += sp;
        if (this.stepD > .8) { this.stepD = 0; this.onStep(); }
      }
    } else this.moving = false;
    this.t += dt * (this.moving ? 9 : 1.6);
    this.cam.position.set(this.pos.x, this.pos.y + Math.sin(this.t) * (this.moving ? .012 : .0025), this.pos.z);
    this.cam.rotation.set(this.pitch, this.yaw, 0, 'YXZ');
  }
}
