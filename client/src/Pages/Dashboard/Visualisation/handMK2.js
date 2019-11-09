import React, {
  Component
} from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import {
  readStream
} from "../Other/api";
import Config from "../ConfigFile";


import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"; //!!!!!!! LOOK, ORBIT CONTROLS YAYAYAY NICE


class HandVis extends Component {
    componentDidMount(){

        window.addEventListener("dblclick", onDblMouseClick, false);
        window.addEventListener("keydown", onKeyDownUp, false);
        window.addEventListener("keyup", onKeyDownUp, false);

    };

    onKeyDownUp(event) {//this also works pick one i prefer this one, no arrows

      // Checks for for start of keybind
      if (event.key == "a" && event.type == "keydown") {
        console.log("Listening");
        this.state.isListening = true;
        return;
      }

      // When keybind complete, computes inputs and resets variables
      if (event.key == "a" && event.type == "keyup") {
        console.log("Stopped listening");
        this.state.isListening = false;
        console.log(this.state.numbers.join(''))
        this.state.sens_num = parseFloat(this.state.numbers.join('')) - 1.;
        console.log(this.state.sens_num);
        this.state.numbers = [];
        return;
      }

      // Collects the user's number input
      if (this.state.isListening && event.type == "keydown") {
        this.state.numbers.push(event.key);
      }
    }


    // Called on double-click, used for placing sensors
    onDblMouseClick(event) {

      // Generate mouse coordinates from 0 to 1 (for x and y)
      this.state.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.state.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Calculate objects intersecting the picking ray
      this.state.raycaster.setFromCamera(mouse, camera);
      let ray = this.state.raycaster.intersectObjects(mesh.children);
      for (var i = 0; i < ray.length; i++) {
        console.log(this.state.sens_num, ray[i].uv);
        this.state.posarr[this.state.sens_num] = ray[i].uv;
        this.state.uniforms.positions.value = posarr;
      }

    }


    sceneSetup = () => {

      // get container dimensions and use them for scene sizing
      const width = this.el.clientWidth;
      const height = this.el.clientHeight;

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(
          75, // fov = field of view
          width / height, // aspect ratio
          0.1, // near plane
          1000 // far plane
      );

      // set some distance from a cube that is located at z = 0
      this.camera.position.z = 5;


      this.controls = new OrbitControls( this.camera, this.el ); // why aren't the function defining lines light blue
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize( width, height );
      this.el.appendChild( this.renderer.domElement ); // mount using React ref
    };


    addCustomSceneObjects = () => {

        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshPhongMaterial( {
            color: 0x156289,
            emissive: 0x072534,
            side: THREE.DoubleSide,
            flatShading: true
        } );
        this.cube = new THREE.Mesh( geometry, material );
        this.scene.add( this.cube );

        const lights = [];
        lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
        lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
        lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

        lights[ 0 ].position.set( 0, 200, 0 );
        lights[ 1 ].position.set( 100, 200, 100 );
        lights[ 2 ].position.set( - 100, - 200, - 100 );

        this.scene.add( lights[ 0 ] );
        this.scene.add( lights[ 1 ] );
        this.scene.add( lights[ 2 ] );

        };


    startAnimationLoop = () => {

        // this.cube.rotation.x += 0.01;
        // this.cube.rotation.y += 0.01;

        this.renderer.render( this.scene, this.camera );
        this.requestID = window.requestAnimationFrame(this.startAnimationLoop);

    };

    componentWillUnmount() {

        window.removeEventListener("dblclick", onDblMouseClick, false);
        window.removeEventListener("keydown", onKeyDownUp, false);
        window.removeEventListener("keyup", onKeyDownUp, false);
        window.cancelAnimationFrame(this.requestID);
        this.controls.dispose();

    }

}


export {
  HandVis
};
