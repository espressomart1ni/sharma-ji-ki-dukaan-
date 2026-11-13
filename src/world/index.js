import { COLLIDERS } from '../config.js';
import { buildShell } from './shell.js';
import { buildShelves } from './shelves.js';
import { buildProps } from './props.js';
// ctx is the shared bag: colliders, targets (raycast roots), items (pickables), tick callbacks, hooks (filled by main.js).
export function buildWorld(scene) {
  const ctx = { colliders: COLLIDERS.map(r => r.slice()), targets: [], items: [], tick: [], hooks: { say() {}, found() {}, talk() {}, computer() {} } };
  buildShell(scene, ctx); buildShelves(scene, ctx); buildProps(scene, ctx);
  return ctx;
}
