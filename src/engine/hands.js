import * as THREE from 'three';

export class Hands {
  constructor(camera) {
    this.camera = camera; this.group = new THREE.Group(); camera.add(this.group);
    const material = new THREE.MeshStandardMaterial({ color: 0xb07a52 });
    for (const x of [-.22, .22]) {
      const hand = new THREE.Mesh(new THREE.SphereGeometry(.08, 12, 8), material);
      hand.position.set(x, -.28, -.45); this.group.add(hand);
    }
  }
  update() {}
}
