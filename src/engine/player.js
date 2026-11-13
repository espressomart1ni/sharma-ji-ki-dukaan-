import * as THREE from 'three';

export class Player {
  constructor(camera, colliders = [], onStep = () => {}) {
    this.camera = camera; this.colliders = colliders; this.onStep = onStep;
    this.pos = camera.position; this.pos.set(0, 1.65, 1.7); this.keys = {}; this.joy = { x: 0, y: 0 };
    this.enabled = false; this.yaw = 0; this.pitch = 0; this.moving = false;
    addEventListener('keydown', e => { this.keys[e.code] = 1; });
    addEventListener('keyup', e => { this.keys[e.code] = 0; });
  }
  look(x, y) {
    this.yaw -= x * .002; this.pitch = THREE.MathUtils.clamp(this.pitch - y * .002, -1.45, 1.45);
  }
  update(dt) {
    if (!this.enabled) return;
    const x = (this.keys.KeyD || 0) - (this.keys.KeyA || 0) + this.joy.x;
    const z = (this.keys.KeyS || 0) - (this.keys.KeyW || 0) + this.joy.y;
    const length = Math.hypot(x, z); this.moving = length > .01;
    if (!this.moving) { this.camera.rotation.set(this.pitch, this.yaw, 0, 'YXZ'); return; }
    const speed = this.keys.ShiftLeft || this.keys.ShiftRight ? 4.2 : 2.5;
    const dx = (x / length * Math.cos(this.yaw) - z / length * Math.sin(this.yaw)) * speed * dt;
    const dz = (x / length * Math.sin(this.yaw) + z / length * Math.cos(this.yaw)) * speed * dt;
    const next = this.pos.clone(); next.x += dx; next.z += dz;
    if (!this.colliders.some(([x0, x1, z0, z1]) => next.x > x0 - .2 && next.x < x1 + .2 && next.z > z0 - .2 && next.z < z1 + .2)) this.pos.copy(next);
    this.camera.rotation.set(this.pitch, this.yaw, 0, 'YXZ'); if (Math.random() < dt * 5) this.onStep();
  }
}
