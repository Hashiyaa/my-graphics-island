/*jshint esversion: 6 */
// @ts-check

import * as THREE from './node_modules/three/src/Three.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { GrObject } from './object.js';

export class GrWorld {

    constructor() {
        this.windowW = 1000;
        this.windowH = 600;

        this.camera = new THREE.PerspectiveCamera(70, this.windowW / this.windowH, 0.01, 10);
        this.camera.position.z = 1;

        this.scene = new THREE.Scene();

        /** @type {GrObject[]} */
        this.objects = [];

        // TODO: look into how renderer exactly works
        this.renderer = new THREE.WebGLRenderer({
            // antialias: true
        });
        this.renderer.setSize(this.windowW, this.windowH);
        document.body.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
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