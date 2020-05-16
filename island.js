/*jshint esversion: 6 */
// @ts-check

// adapt some ideas from CS 559 framwork
import * as THREE from './node_modules/three/src/Three.js';

import {
    GrWorld
} from './world.js';
import {
    GrObject
} from './object.js';
import {
    DoubleSide
} from './node_modules/three/src/Three.js';

let terrainImg = new Image();
terrainImg.src = "./kauai-heightmap.png";

let canvas = document.createElement("canvas");

window.onload = grIsland;

function grIsland() {
    let grWorld = new GrWorld();

    let worldW = 1500;
    let worldH = 1500;

    let terrainGeom = new THREE.PlaneGeometry(terrainImg.width, terrainImg.height, terrainImg.width - 1, terrainImg.height - 1);

    canvas.width = terrainImg.width;
    canvas.height = terrainImg.height;
    canvas.getContext('2d').drawImage(terrainImg, 0, 0, terrainImg.width, terrainImg.height);
    let terrainData = canvas.getContext('2d').getImageData(0, 0, terrainImg.width, terrainImg.height).data;
    console.log(terrainData);

    let normPixels = [];

    for (let i = 0, n = terrainData.length; i < n; i += 4) {
        // get the average value of R, G and B.
        normPixels.push((terrainData[i] + terrainData[i + 1] + terrainData[i + 2]) / 3);
    }
    console.log(normPixels);

    for (let i = 0, l = terrainGeom.vertices.length; i < l; i++) {
        let terrainValue = normPixels[i] / 255;
        terrainGeom.vertices[i].z += terrainValue * 200;
    }
    terrainGeom.computeFaceNormals();
    terrainGeom.computeVertexNormals();

    let terrainMat = new THREE.MeshLambertMaterial({
        color: 0xCCFFCC,
        wireframe: false,
        side: DoubleSide
    });

    let terrainMesh = new THREE.Mesh(terrainGeom, terrainMat);
    terrainMesh.rotateX(-Math.PI / 2);
    let terrain = new GrObject(terrainMesh, "terrain");
    grWorld.add(terrain);

    let groundGeom = new THREE.BoxGeometry(worldW, worldH, 200);
    let groundMat = new THREE.MeshLambertMaterial({
        color: 0xCCFFCC,
        wireframe: false,
        side: DoubleSide
    });
    let groundMesh = new THREE.Mesh(groundGeom, groundMat);
    groundMesh.rotateX(-Math.PI / 2);
    groundMesh.position.y = -100;
    let ground = new GrObject(groundMesh, "ground");
    grWorld.add(ground);

    grWorld.animate();
}