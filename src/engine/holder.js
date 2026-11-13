import * as THREE from 'three';
import { sfx } from './audio.js';
const HOLD = new THREE.Vector3(.2, -.17, -.46), INSP = new THREE.Vector3(0, -.03, -.42);
const HOLD_Q = new THREE.Quaternion().setFromEuler(new THREE.Euler(.12, -.45, 0));
const AX_Y = new THREE.Vector3(0, 1, 0), AX_X = new THREE.Vector3(1, 0, 0);
// Picks items off shelves, holds them in the right hand, lets you inspect / use / put back.
export class Holder {
  constructor(scene, camera, hands, hooks) {
    Object.assign(this, { scene, camera, hands, hooks });
    this.item = null; this.inspecting = false; this.user = new THREE.Quaternion(); this.ret = []; this.pending = null; this.active = new Set();
  }
  pick(item) {
    if (this.pending || this.ret.some(r => r.it === item)) return;
    if (this.item) this.putBack();
    this.hands.mode = 'reach'; this.pending = { item, t: .16 }; sfx.pick();
  }
  attach(it) {
    const g = it.g;
    if (!it.home) it.home = { parent: g.parent, pos: g.position.clone(), quat: g.quaternion.clone(), scale: g.scale.clone() };
    this.scene.updateMatrixWorld(true); this.camera.attach(g);
    if (it.obj.ensure) it.obj.ensure();
    this.item = it; this.inspecting = false; this.user.identity(); this.hands.mode = 'hold';
    this.hooks.say(`${it.def.name} — ${it.def.blurb || ''}`);
  }
  toggleInspect() {
    if (!this.item) return false;
    this.inspecting = !this.inspecting; this.user.identity(); this.hands.mode = this.inspecting ? 'inspect' : 'hold'; sfx.tick(); return this.inspecting;
  }
  rotate(dx, dy) {
    if (!this.inspecting) return;
    const qy = new THREE.Quaternion().setFromAxisAngle(AX_Y, dx * .01), qx = new THREE.Quaternion().setFromAxisAngle(AX_X, dy * .01);
    this.user.premultiply(qy).premultiply(qx);
  }
  action(i) {
    const a = this.item && this.item.obj.actions[i]; if (!a) return;
    const msg = a.fn(); if (msg) this.hooks.say(msg);
    if (this.item.obj.update) this.active.add(this.item);
  }
  putBack() {
    const it = this.item; if (!it) return;
    this.item = null; this.inspecting = false; this.hands.mode = 'idle'; sfx.put();
    const h = it.home; h.parent.updateWorldMatrix(true, false);
    const m = new THREE.Matrix4().compose(h.pos, h.quat, h.scale).premultiply(h.parent.matrixWorld);
    const p = new THREE.Vector3(), q = new THREE.Quaternion(), s = new THREE.Vector3(); m.decompose(p, q, s);
    this.camera.updateMatrixWorld(true); this.scene.attach(it.g); this.ret.push({ it, p, q, s });
  }
  update(dt) {
    if (this.pending && (this.pending.t -= dt) <= 0) { this.attach(this.pending.item); this.pending = null; }
    const it = this.item, k = Math.min(1, dt * 10);
    if (it) {
      const g = it.g, dim = it.dim, sc = (this.inspecting ? .36 : .26) / dim;
      g.position.lerp(this.inspecting ? INSP : HOLD, k);
      g.quaternion.slerp(this.inspecting ? this.user.clone().multiply(HOLD_Q) : HOLD_Q, k);
      g.scale.lerp(new THREE.Vector3(sc, sc, sc), k);
    }
    for (let i = this.ret.length - 1; i >= 0; i--) {
      const r = this.ret[i], g = r.it.g, kk = Math.min(1, dt * 9);
      g.position.lerp(r.p, kk); g.quaternion.slerp(r.q, kk); g.scale.lerp(r.s, kk);
      if (g.position.distanceTo(r.p) < .004) {
        const h = r.it.home; h.parent.add(g); g.position.copy(h.pos); g.quaternion.copy(h.quat); g.scale.copy(h.scale); this.ret.splice(i, 1);
      }
    }
    for (const a of this.active) if (!a.obj.update(dt)) this.active.delete(a);
  }
}
