import * as THREE from 'three';
import { sfx } from './audio.js';

export class Holder {
  constructor(scene, camera, hands, hooks = {}) {
    this.scene = scene; this.camera = camera; this.hands = hands; this.hooks = hooks;
    this.item = null; this.inspecting = false; this.home = null;
  }
  pick(item) {
    if (this.item) return;
    this.item = item; this.home = { parent: item.g.parent, position: item.g.position.clone(), rotation: item.g.rotation.clone() };
    item.home = this.home;
    item.g.removeFromParent(); this.camera.add(item.g); item.g.position.set(0, 0, -.55); item.g.rotation.set(0, 0, 0); item.obj.ensure?.(); sfx.pop();
  }
  toggleInspect() { if (this.item) this.inspecting = !this.inspecting; }
  rotate(x, y) { if (!this.item) return; this.item.g.rotation.y += x * .01; this.item.g.rotation.x += y * .01; }
  action(index) {
    const action = this.item?.obj.actions?.[index]; if (!action) return;
    const message = action.fn(); if (message && this.hooks.say) this.hooks.say(message);
  }
  putBack() {
    if (!this.item || !this.home) return;
    const item = this.item; item.g.removeFromParent(); this.home.parent.add(item.g);
    item.g.position.copy(this.home.position); item.g.rotation.copy(this.home.rotation);
    this.item = null; this.home = null; this.inspecting = false; sfx.put();
  }
  update(dt) { if (this.item?.obj.update) this.item.obj.update(dt); }
}
