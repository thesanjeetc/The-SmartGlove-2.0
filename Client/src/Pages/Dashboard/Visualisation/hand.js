import React, { Component } from "react";
import { fragshader, vertshader } from "./material.js";
import { StateHandler } from "../Other/api";
import Config from "../../ConfigFile";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

var THREE = require("three");
var OBJLoader = require("three-obj-loader");
OBJLoader(THREE);

class HandVis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newData: new Array(10).fill(0),
      x: 0,
      y: 0
    };

    this.onMouseMove = this.onMouseMove.bind(this);

    // Set up global variables
    // Set up Three.js scene, camera and
    this.scene = new THREE.Scene(); //all in constructor
    // this.scene.background = new THREE.Color(0x262d47);
    // this.scene.background = new THREE.Color(0x5271ff);

    this.camera = new THREE.PerspectiveCamera(70, 2, 1, 1000);

    // Set up raycaster and mouse
    this.posarr = [];
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Set up variables for key down/up function
    this.isListening = false;
    this.numbers = [];
    this.labels = [];
    for (let i = 1; i < Config.numSensors + 1; i++) {
      this.labels.push(i);
    }
    // Set up initial random sensor positions
    for (var i = 0; i < 16; i++) {
      this.posarr.push(new THREE.Vector2(Math.random(), Math.random()));
    }
    this.clock = new THREE.Clock();

    // Load geometry
    let loadPromise = new Promise(
      function(resolve, reject) {
        let loader = new THREE.OBJLoader();
        loader.load(
          "/base_hand.obj",
          function(gltf) {
            this.mesh = gltf;
            resolve(this.mesh);
          }.bind(this),

          // Called while loading is progressing
          function(xhr) {
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
          },

          // Called when loading has errors
          function(error) {
            console.log("An error happewned");
          }
        );
      }.bind(this)
    );

    loadPromise.then(
      function(response) {
        this.mesh = response;

        // Initialise the render
        this.continueLoading();
      }.bind(this)
    );

    this.uniforms = {
      // Glove Texture
      text: {
        type: "t",
        value: THREE.ImageUtils.loadTexture("/NewHand.png")
      },

      // Positions of sensors
      positions: {
        type: "v2v",
        value: this.posarr
      },

      // Sensor data
      data: {
        value: this.state.newData
      }
    };

    // GLSL Shader Material
    this.pressureMat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertshader,
      fragmentShader: fragshader
    });

    // this.pressureMat = new THREE.MeshLambertMaterial({
    //   color: "#262d47",
    //   wireframe: false
    // });

    // Set up event listening functions
    window.addEventListener("dblclick", this.onDblMouseClick, false);
    window.addEventListener("keydown", this.onKeyDownUp, false);
    window.addEventListener("keyup", this.onKeyDownUp, false);
  }

  onMouseMove(e) {
    // console.log("hi?")
    this.setState({
      mouse: { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }
    });
    console.log(this.state.mouse);
  }

  resizeCanvasToDisplaySize() {
    const canvas = document.getElementById("visContainer");
    // console.log("hi");
    // look up the size the canvas is being displayed
    const width = canvas.clientWidth;
    // console.log(width);
    const height = canvas.clientHeight;
    console.log(height, width);

    // adjust displayBuffer size to match
    if (canvas.width !== width || canvas.height !== height) {
      // you must pass false here or three.js sadly fights the Bowser
      this.renderer.setSize(width, height, false);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      // update any render target sizes here
    }
  }

  resizeDisplay(width, height) {
    // you must pass false here or three.js sadly fights the Bowser
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    // update any render target sizes here
  }

  continueLoading() {
    // Set up mesh
    this.mesh.scale.set(10, 10, 10);
    this.mesh.traverse(o => {
      console.log(o);
      if (typeof o.material !== "undefined") {
        o.material = this.pressureMat;
        console.log("set Material");
      }
    });

    // Plane geometry, used for testing:
    // Cube000000this..this// var geometry = new THREE.PlaneGeometry( 100, 100, 10,10 );
    // var material = pressureMat;
    // mesh = new THREE.Mesh( geometry, material );

    // Add mesh
    console.log(this.mesh);
    this.scene.add(this.mesh);
  }

  animate = () => {
    try {
      this.resizeCanvasToDisplaySize();
      this.controls.update();
      this.uniforms.data.value = this.state.newData;
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(this.animate);
    } catch {}
  };

  componentDidMount() {
    // Set up renderer and orbit camera controls
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });

    // this.renderer.setSize(400, 300);
    // this.renderer.setSize(this.props.width, this.props.height);
    this.mount.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.set(1.25, 26, 0);
    this.controls.update();
    StateHandler.subscribe("sensorData", dataPoints => {
      if (dataPoints !== null) {
        this.setState({
          newData: dataPoints
        });
      }
    });

    StateHandler.subscribe("videoCall", () => this.resizeDisplay(407, 394));

    this.raycaster.setFromCamera(this.mouse, this.camera);

    // This checks if time is a multiple of 5
    // If true, it resets all sensor to random values between 0 and 1
    // This is just an aspect of the prototype
    // We needed it to practice sendind data from js to GLSL
    if (Math.round(this.clock.getElapsedTime(), 2) % 5 == 0) {
      for (var i = 0; i < 16; i++) {
        this.state.newData[i] = Math.random();
      }
    }

    // Update sensor data and render
    this.renderer.render(this.scene, this.camera);

    // NOTES
    // Working address: 127.0.0.1:9583
    // Docs: https://threejs.org/docs/
    // Command to start server: python -m http.server 9583
    const lights = [];
    lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    lights[1] = new THREE.AmbientLight(0xffffff, 0.4, 0);
    lights[2] = new THREE.AmbientLight(0xffffff, 0.2, 0);

    lights[0].position.set(20, 20, 20);
    lights[1].position.set(10, 20, 10);
    lights[2].position.set(-10, -10, -30);

    this.scene.add(lights[0]);
    this.scene.add(lights[1]);
    this.scene.add(lights[2]);

    this.animate();
  }

  onKeyDownUp = event => {
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
      console.log(this.numbers.join(""));
      this.sens_num = parseFloat(this.numbers.join("")) - 1;
      console.log(this.sens_num);
      this.numbers = [];
      return;
    }

    // Collects the user's number input
    if (this.isListening && event.type == "keydown") {
      this.numbers.push(event.key);
    }
  };

  // Called on double-click, used for placing sensors
  onDblMouseClick = event => {
    // Generate mouse coordinates from 0 to 1 (for x and y)
    const canvas = document.getElementById("visContainer");

    // this.mouse.x = (event.clientX / window.innerWidth); // * 2 - 1
    // this.mouse.y = (event.clientY / window.innerHeight); // -1 * 2 + 1

    // this.mouse.x = (this.state.x / canvas.clientWidth);
    // this.mouse.y = (this.state.y / canvas.clientHeight);

    // // this.mouse.x = (this.state.x / 640);
    // // this.mouse.y = (this.state.y / 520);
    try {
      this.mouse.x = this.state.mouse.x / this.renderer.getSize().x;
      this.mouse.y = this.state.mouse.y / this.renderer.getSize().y;
    } catch {}

    // Calculate objects intersecting the picking ray
    this.raycaster.setFromCamera(this.mouse, this.camera);
    let ray = this.raycaster.intersectObjects(this.mesh.children);
    console.log(this.raycaster.ray.at(1));
    for (var i = 0; i < ray.length; i++) {
      console.log("ijsbfjsbgdi");
      console.log(this.sens_num, ray[i].uv);
      this.posarr[this.sens_num] = ray[i].uv;
      this.uniforms.positions.value = this.posarr;
    }
  };

  // sceneSetup = () => {
  //
  //   // get container dimensions and use them for scene sizing
  //   const width = this.el.clientWidth;
  //   const height = this.el.clientHeight;
  //
  //   this.scene = new THREE.Scene();
  //   this.camera = new THREE.PerspectiveCamera(
  //       75, // fov = field of view
  //       width / height, // aspect ratio
  //       0.1, // near plane
  //       1000 // far plane
  //   );
  //
  //   // set some distance from a cube that is located at z = 0
  //   this.camera.position.z = 5;
  //
  //
  //   this.controls = new OrbitControls( this.camera, this.el ); // why aren't the function defining lines light blue
  //   this.renderer = new THREE.WebGLRenderer();
  //   this.renderer.setSize( width, height );
  //   this.el.appendChild( this.renderer.domElement ); // mount using React ref
  // };

  addCustomSceneObjects = () => {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshPhongMaterial({
      color: 0x156289,
      emissive: 0x072534,
      side: THREE.DoubleSide,
      flatShading: true
    });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    const lights = [];
    lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    lights[1] = new THREE.PointLight(0xffffff, 1, 0);
    lights[2] = new THREE.PointLight(0xffffff, 1, 0);

    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(-100, -200, -100);

    this.scene.add(lights[0]);
    this.scene.add(lights[1]);
    this.scene.add(lights[2]);
  };

  startAnimationLoop = () => {
    // this.cube.rotation.x += 0.01;
    // this.cube.rotation.y += 0.01;
    // this.resizeCanvasToDisplaySize();
    this.renderer.render(this.scene, this.camera);
    this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
  };

  componentWillUnmount() {
    window.removeEventListener("dblclick", this.onDblMouseClick, false);
    window.removeEventListener("keydown", this.onKeyDownUp, false);
    window.removeEventListener("keyup", this.onKeyDownUp, false);
    window.cancelAnimationFrame(this.requestID);
  }
  render() {
    const { x, y } = this.state;
    return (
      <div
        onMouseMove={this.onMouseMove}
        className="w-full h-full"
        id="visContainer"
        ref={ref => (this.mount = ref)}
      />
    );
  }
}

export { HandVis };
