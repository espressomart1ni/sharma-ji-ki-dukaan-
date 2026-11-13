import * as THREE from 'three';
import { assetUrl } from '../engine/assets.js';
const loader = new THREE.TextureLoader(), cache = new Map();
// Loads public/assets/<path>. In Node (smoke test) there is no DOM, so return a blank texture.
export function tex(path, { repeat } = {}) {
  const key = path + (repeat || '');
  if (cache.has(key)) return cache.get(key);
  const t = typeof document === 'undefined' ? new THREE.Texture() : loader.load(assetUrl(path));
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat[0], repeat[1]); }
  cache.set(key, t); return t;
}
export const std = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: .75, metalness: 0, ...o });
export const mapMat = (path, o = {}) => std(0xffffff, { map: tex(path), ...o });
export const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
export const cyl = (a, b, h, s = 16) => new THREE.CylinderGeometry(a, b, h, s);
export function mesh(parent, geo, mat, x = 0, y = 0, z = 0) {
  const o = new THREE.Mesh(geo, mat); o.position.set(x, y, z); parent.add(o); return o;
}
