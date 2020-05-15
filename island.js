/*jshint esversion: 6 */
// @ts-check

// adapt some ideas from CS 559 framwork
import * as THREE from './node_modules/three/src/Three.js';

import { GrWorld } from './world.js';
import { GrObject } from './object.js';

window.onload = grIsland;

function grIsland() {
    let grWorld = new GrWorld();
    let geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    let material = new THREE.MeshNormalMaterial();

    let mesh = new THREE.Mesh(geometry, material);
    let cube = new GrObject(mesh, "cube");
    cube.tick = function() {
        cube.mesh.rotation.x += 0.01;
        cube.mesh.rotation.y += 0.01;
    };
    grWorld.add(cube);

    grWorld.animate();
}