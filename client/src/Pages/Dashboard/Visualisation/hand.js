import React, {
  Component
} from "react";
import ReactDOM from "react-dom";

import {
  fragshader,
  vertexshader
} from "../material.json"

import {
  readStream
} from "../Other/api";
import Config from "../ConfigFile";

import {
  OrbitControls
} from "three/examples/jsm/controls/OrbitControls";

// Import THREE and ObjLoader
var THREE = require('three');
var OBJLoader = require('three-obj-loader');
OBJLoader(THREE);

class HandVis extends Component {
  constructor(props) {
    super(props);
    this.isListening = false;
    this.loadMesh();
    this.setupScene();
    this.initMaterial();
    this.mouse = new THREE.Vector2();
    this.numbers = [];
    this.posarr = [];
  }
  loadMesh() {
    // Load geometry
    let loadPromise = new Promise(function(resolve, reject) {
      let loader = new THREE.OBJLoader();
      loader.load('/base_hand.obj', function(gltf) {
          this.mesh = gltf;
          resolve(this.mesh);
        }.bind(this),

        // Called while loading is progressing
        function(xhr) {
          console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },

        // Called when loading has errors
        function(error) {
          console.log('An error happened');
        }
      );
    }.bind(this));


    loadPromise.then(
      function(response) {
        this.mesh = response;

        // Initialise the render
        this.onMeshReady();
      }.bind(this))
  }
  setupScene() {
    // Sets up everything THREE needs for the scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x5271ff);

    // this.camera = new THREE.PerspectiveCamera(75, this.props.width / this.props.height, 0.1, 10000);
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000);
    this.clock = new THREE.Clock()

    // Set up renderer and orbit camera controls
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // this.renderer.setSize(this.props.width, this.props.height);
    document.body.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.set(1.25, 26, 0);
    this.controls.update();
    this.raycaster =new THREE.Raycaster();
  }

  initMaterial() {
    // Gets the material ready
    this.uniforms = {
      // Glove Texture
      text: {
        type: "t",
        value: THREE.ImageUtils.loadTexture("NewHand.png")
      },

      // Positions of sensors
      positions: {
        type: "v2v",
        value: this.posarr
      },

      // Sensor data
      data: {
        value: this.newData
      }
    }

    this.pressureMat = new THREE.MeshBasicMaterial({
      color: "#0F0",
      wireframe: false
    });

  }

  onMeshReady() {
    // Called when mesh is loaded
    this.mesh.scale.set(1000, 1000, 1000);
    this.mesh.traverse((o) => {
      console.log(o)
      if (typeof(o.material) !== "undefined") {
        o.material = this.pressureMat;
        console.log("set Material");
      }
    });

    console.log(this.mesh)
    this.scene.add(this.mesh);

  }

  componentDidMount() {

    // Set up event listening functions
    window.addEventListener("dblclick", this.onDblMouseClick, false)
    window.addEventListener("keydown", this.onKeyDownUp, false)
    window.addEventListener("keyup", this.onKeyDownUp, false)
    this.animate();
  }
  animate = () => {
    // Continously animate
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.animate);

  }
  componentWillUnmount() {

    window.removeEventListener("dblclick", this.onDblMouseClick, false);
    window.removeEventListener("keydown", this.onKeyDownUp, false);
    window.removeEventListener("keyup", this.onKeyDownUp, false);
    window.cancelAnimationFrame(this.requestID);

  }
  onKeyDownUp = (event) => {

    // Checks for for start of keybind
    if (event.key == "a" && event.type == "keydown") {
      console.log("Listening");
      this.isListening = true;
      return;
    }

    // When keybind complete, computes inputs and resets variables
    if (event.key == "a" && event.type == "keyup") {
      console.log("Stopped listening");
      this.isListening = false;
      console.log(this.numbers.join(''))
      this.sens_num = parseFloat(this.numbers.join('')) - 1.;
      console.log(this.sens_num);
      this.numbers = [];
      return;
    }

    // Collects the user's number input
    if (this.isListening && event.type == "keydown") {
      this.numbers.push(event.key);
    }
  }
  // Called on double-click, used for placing sensors
  onDblMouseClick = (event) => {

    // Generate mouse coordinates from 0 to 1 (for x and y)
    // this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    // this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY /  window.innerHeight) * 2 + 1;

    // Calculate objects intersecting the picking ray
    this.raycaster.setFromCamera(this.mouse, this.camera);
    let ray = this.raycaster.intersectObjects(this.mesh.children);
    for (var i = 0; i < ray.length; i++) {
      console.log(this.sens_num, ray[i].uv);
      this.posarr[this.sens_num] = ray[i].uv;
      this.uniforms.positions.value = this.posarr;
    }

  }
  render() {
    return (<canvas ref={this.canvasRef}/>);
    }

  }
ReactDOM.render(<HandVis/>, HandVis.renderer.domElement)

  export {
    HandVis
  };
