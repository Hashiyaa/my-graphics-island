/*jshint esversion: 6 */
// @ts-check

import * as THREE from './node_modules/three/src/Three.js';
import {
    OrbitControls
} from './node_modules/three/examples/jsm/controls/OrbitControls.js';

// adapt some ideas from CS 559 framwork @UW-Madison
class GrObject {
    /**
     * @param {THREE.Mesh} mesh
     * @param {string} name
     */
    constructor(mesh, name) {
        this.mesh = mesh;
        this.name = name;
    }

    // animate the object
    tick() {}
}

class GrWorld {
    constructor() {
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 10000);
        this.camera.position.set(0, 600, 0);
        this.camera.lookAt(0, 0, 0);

        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({
            // antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        let ambientLight = new THREE.AmbientLight("white", 0.2);
        this.scene.add(ambientLight);

        // let dirLight = new THREE.DirectionalLight("white", 0.8);
        // dirLight.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);
        // dirLight.lookAt(0, 0, 0);
        // this.scene.add(dirLight);

        /** @type {GrObject[]} */
        this.objects = [];
    }

    /**
     * @param {GrObject} obj
     */
    add(obj) {
        this.objects.push(obj);
        this.scene.add(obj.mesh);
    }

    animate() {
        let self = this;

        function loop() {
            self.objects.forEach(obj => {
                obj.tick();
            });
            self.controls.update();
            self.renderer.render(self.scene, self.camera);
            requestAnimationFrame(loop);
        }
        loop();
    }
}

// world related params
let worldSize = [512, 512];
let terrainH = 70.0;

let grWorld = new GrWorld();

// load textures
let dirtTexture = new THREE.TextureLoader().load("./images/dirt.jpg");
dirtTexture.wrapS = dirtTexture.wrapT = THREE.RepeatWrapping;
let grassTexture = new THREE.TextureLoader().load("./images/grass.jpg");
grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
let rockTexture = new THREE.TextureLoader().load("./images/rock.jpg");
rockTexture.wrapS = rockTexture.wrapT = THREE.RepeatWrapping;
let sandTexture = new THREE.TextureLoader().load("./images/sand.jpg");
sandTexture.wrapS = sandTexture.wrapT = THREE.RepeatWrapping;

/**
 * Create a terrain
 * 
 * @param {string} mode rgbamap or hmap
 */
function terrain(mode, position) {
    // Terrain built from a height map
    let terrainGeom = new THREE.PlaneBufferGeometry(worldSize[0], worldSize[1], worldSize[0] - 1, worldSize[1] - 1);

    // For shaders to interact with THREE.js lights
    let uniforms = THREE.UniformsUtils.merge([
        THREE.UniformsLib["ambient"],
        THREE.UniformsLib["lights"],
    ]);

    // assign uniform values
    uniforms["bumpTexture"] = {
        value: new THREE.TextureLoader().load("./images/kauai-heightmap.png")
    };
    if (mode === "rgbamap")
        uniforms["splatMap"] = {
            value: new THREE.TextureLoader().load("./images/rgba_splatmap.jpg")
        };
    uniforms["bumpScale"] = {
        value: terrainH
    };
    uniforms["dirtTexture"] = {
        value: dirtTexture
    };
    uniforms["grassTexture"] = {
        value: grassTexture
    };
    uniforms["rockTexture"] = {
        value: rockTexture
    };
    uniforms["sandTexture"] = {
        value: sandTexture
    };

    let params = {
        uniforms: uniforms,
        lights: true
    }

    let terrainMat = shaderMat("./shaders/terrain_" + mode + ".vs", "./shaders/terrain_" + mode + ".fs", params);

    let terrainMesh = new THREE.Mesh(terrainGeom, terrainMat);
    terrainMesh.rotateX(-Math.PI / 2);
    terrainMesh.position.set(position.x, position.y, position.z);

    let terrain = new GrObject(terrainMesh, "terrain_" + mode);
    grWorld.add(terrain);
}

/**
 * @param {string} vs
 * @param {string} fs
 * @param {THREE.ShaderMaterialParameters} params
 */
function shaderMat(vs, fs, params) {
    let loader = new THREE.FileLoader();

    let terrainMat = new THREE.ShaderMaterial(params);

    loader.load(vs,
        /* onload = */
        function (data) {
            // console.log(vs + " loaded successfully.")
            terrainMat.vertexShader = data.toString();
            terrainMat.needsUpdate = true;
        }
    );
    loader.load(fs,
        /* onload = */
        function (data) {
            // console.log(fs + " loaded successfully.")
            terrainMat.fragmentShader = data.toString();
            terrainMat.needsUpdate = true;
        }
    );

    return terrainMat;
}

window.onresize = function () {
    grWorld.camera.aspect = window.innerWidth / window.innerHeight;
    grWorld.camera.updateProjectionMatrix();
    grWorld.renderer.setSize(window.innerWidth, window.innerHeight);
    // grWorld.controls.handleResize();
}

window.onload = function () {
    // rgbamap or hmap
    terrain("rgbamap", new THREE.Vector3(256, 0, 0));
    terrain("hmap", new THREE.Vector3(-256, 0, 0));

    // Ocean
    // let groundGeom = new THREE.BoxGeometry(worldSize[0], worldSize[1], 100);
    // let groundMat = new THREE.MeshLambertMaterial({
    //     color: 0x0077BE,
    //     wireframe: false,
    //     // side: DoubleSide
    // });
    // let groundMesh = new THREE.Mesh(groundGeom, groundMat);
    // groundMesh.rotateX(-Math.PI / 2);
    // groundMesh.position.y = -50;
    // let ground = new GrObject(groundMesh, "ground");
    // grWorld.add(ground);

    grWorld.animate();
}