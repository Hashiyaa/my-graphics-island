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
// import {
//     DoubleSide, Vector3
// } from './node_modules/three/src/Three.js';

// let terrainImg = new Image();
// terrainImg.src = "./kauai-heightmap.png";

// let canvas = document.createElement("canvas");

let worldSize = 512;
let terrainH = 70.0;

window.onload = grIsland;

function grIsland() {
    let grWorld = new GrWorld(worldSize);

    // Adapt ideas from https://www.lukaszielinski.de/blog/posts/2014/11/07/webgl-creating-a-landscape-mesh-with-three-dot-js-using-a-png-heightmap/
    // and https://threejs.org/docs/#manual/en/introduction/How-to-update-things
    // Terrain built from a height map
    let terrainGeom = new THREE.PlaneBufferGeometry(worldSize, worldSize, worldSize - 1, worldSize - 1);

    // canvas.width = terrainImg.width;
    // canvas.height = terrainImg.height;
    // canvas.getContext('2d').drawImage(terrainImg, 0, 0, terrainImg.width, terrainImg.height);
    // let terrainData = canvas.getContext('2d').getImageData(0, 0, terrainImg.width, terrainImg.height).data;
    // console.log(terrainData);

    // let normPixels = [];

    // for (let i = 0, n = terrainData.length; i < n; i += 4) {
    //     // get the average value of R, G and B.
    //     normPixels.push((terrainData[i] + terrainData[i + 1] + terrainData[i + 2]) / 3);
    // }
    // console.log(normPixels);

    // let vertices = terrainGeom.attributes.position.array;
    // for (let i = 0, l = terrainGeom.attributes.position.count; i < l; i++) {
    //     let terrainValue = normPixels[i] / 255;
    //     // @ts-ignore
    //     vertices[3 * i + 2] += terrainValue * terrainH;
    // }
    // // terrainGeom.computeFaceNormals();
    // terrainGeom.computeVertexNormals();

    // let terrainMat = new THREE.MeshLambertMaterial({
    //     color: 0xCCFFCC,
    //     wireframe: false,
    //     side: DoubleSide
    // });

    let dirtTexture = new THREE.TextureLoader().load("./images/dirt.jpg");
    dirtTexture.wrapS = dirtTexture.wrapT = THREE.RepeatWrapping;
    let grassTexture = new THREE.TextureLoader().load("./images/grass.jpg");
    grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
    let rockTexture = new THREE.TextureLoader().load("./images/rock.jpg");
    rockTexture.wrapS = rockTexture.wrapT = THREE.RepeatWrapping;
    let sandTexture = new THREE.TextureLoader().load("./images/sand.jpg");
    sandTexture.wrapS = sandTexture.wrapT = THREE.RepeatWrapping;

    let uniforms = THREE.UniformsUtils.merge([
        THREE.UniformsLib[ "ambient" ],
        THREE.UniformsLib[ "lights" ],
    ]);

    uniforms["bumpTexture"] = {value: new THREE.TextureLoader().load("./images/kauai-heightmap.png")};
    uniforms["bumpScale"] = {value: terrainH};
    uniforms["dirtTexture"] = {value: dirtTexture};
    uniforms["grassTexture"] = {value: grassTexture};
    uniforms["rockTexture"] = {value: rockTexture};
    uniforms["sandTexture"] = {value: sandTexture};

    let terrainMat = new THREE.ShaderMaterial({
        uniforms: uniforms,
        lights: true
    });
    loadShaders('./terrain.vs', './terrain.fs', terrainMat);

    let terrainMesh = new THREE.Mesh(terrainGeom, terrainMat);
    terrainMesh.rotateX(-Math.PI / 2);
    let terrain = new GrObject(terrainMesh, "terrain");
    grWorld.add(terrain);

    // Ocean
    // let groundGeom = new THREE.BoxGeometry(worldSize, worldSize, 100);
    // let groundMat = new THREE.MeshLambertMaterial({
    //     color: 0x0077BE,
    //     wireframe: false,
    //     side: DoubleSide
    // });
    // let groundMesh = new THREE.Mesh(groundGeom, groundMat);
    // groundMesh.rotateX(-Math.PI / 2);
    // groundMesh.position.y = -50;
    // let ground = new GrObject(groundMesh, "ground");
    // grWorld.add(ground);

    grWorld.animate();
}

/**
 * @param {string} vs
 * @param {string} fs
 * @param {THREE.ShaderMaterial} material
 */
function loadShaders(vs, fs, material)
{
    let loader = new THREE.FileLoader();
    loader.load(vs,
            /* onload = */ function(data) {
                material.vertexShader = data.toString();
                material.needsUpdate = true;
            },
            /* onprogress = */ function(xhr) {
            },
            /* onerror = */ function(err) {
                console.log(`Failed to Load Vertex Shader (file:${vs})`);
                console.log(`Error: ${err}`);
            }
    );
    loader.load(fs,
        /* onload = */ function(data) {
            material.fragmentShader = data.toString();
            material.needsUpdate = true;
        },
        /* onprogress = */ function(xhr) {
        },
        /* onerror = */ function(err) {
            console.log(`Failed to Load Fragment Shader (file:${fs})`);
            console.log(`Error: ${err}`);
        }
    );
}