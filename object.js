/*jshint esversion: 6 */
// @ts-check

import * as THREE from './node_modules/three/src/Three.js';

export class GrObject {

    /**
     * @param {THREE.Mesh} mesh
     * @param {string} name
     */
    constructor(mesh, name) {
        this.mesh = mesh;
        this.name = name;
    }

    tick() {}
}