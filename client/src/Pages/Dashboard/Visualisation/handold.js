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
    this.canvasRef = React.createRef();
    this.state = {
      newData: new Array(10).fill(0)
    };
    this.state.mouse = new THREE.Vector2();
    // Set up global variables
    // Set up Three.js scene, camera and
    this.state.scene = new THREE.Scene(); //all in constructor
    // this.state.scene.background = new THREE.Color(0x262D47);
    this.state.scene.background = new THREE.Color(0x5271ff);

    this.state.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Set up raycaster and mouse
    this.state.posarr = [];
    this.state.raycaster = new THREE.Raycaster();
    this.state.mouse = new THREE.Vector2();



    // Set up variables for key down/up function
    this.state.isListening = false;
    this.state.numbers = [];
    this.canvasRef = React.createRef();
    this.labels = [];
    for (let i = 1; i < Config.numSensors + 1; i++) {
      this.labels.push(i);
    }
    // Set up initial random sensor positions
    for (var i = 0; i < 16; i++) {
      this.state.posarr.push(new THREE.Vector2(Math.random(), Math.random()))
    }
    this.state.clock = new THREE.Clock()



    // Load geometry
    let loadPromise = new Promise(function(resolve, reject) {
      let loader = new THREE.OBJLoader();
      loader.load('/base_hand.obj', function(gltf) {
          this.state.mesh = gltf;
          resolve(this.state.mesh);
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
        this.state.mesh = response;

        // Initialise the render
        this.continueLoading();
      }.bind(this))

    this.state.uniforms = {
      // Glove Texture
      text: {
        type: "t",
        value: THREE.ImageUtils.loadTexture("NewHand.png")
      },

      // Positions of sensors
      positions: {
        type: "v2v",
        value: this.state.posarr
      },

      // Sensor data
      data: {
        value: this.state.newData
      }
    }

    // GLSL Shader Material
    // this.state.pressureMat = new THREE.ShaderMaterial({
    //   uniforms: this.state.uniforms,
    //   vertexShader: vertexshader,
    //   fragmentShader: fragshader
    // })

    this.state.pressureMat = new THREE.MeshBasicMaterial({
      color: "#0F0",
      wireframe: false
    });

    // Set up event listening functions
    window.addEventListener("dblclick", this.onDblMouseClick, false)
    window.addEventListener("keydown", this.onKeyDownUp, false)
    window.addEventListener("keyup", this.onKeyDownUp, false)
  }

  continueLoading() {

    // Set up mesh
    this.state.mesh.scale.set(1000, 1000, 1000);
    this.state.mesh.traverse((o) => {
      console.log(o)
      if (typeof(o.material) !== "undefined") {
        o.material = this.state.pressureMat;
        console.log("set Material");
      }
    });

    // Plane geometry, used for testing:
    // var geometry = new THREE.PlaneGeometry( 100, 100, 10,10 );
    // var material = pressureMat;
    // mesh = new THREE.Mesh( geometry, material );

    // Add mesh
    console.log(this.state.mesh)
    this.state.scene.add(this.state.mesh);


  }
  animate = () => {
    this.controls.update();
    this.renderer.render(this.state.scene, this.state.camera);
    requestAnimationFrame(this.animate);
  }
  componentDidMount() {

    // Set up renderer and orbit camera controls
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // this.renderer.setSize(this.props.width, this.props.height);
    document.body.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls(this.state.camera, this.renderer.domElement);
    this.state.camera.position.set(1.25, 26, 0);
    this.controls.update();

    readStream((err, datapoints) =>
      this.setState({
        newData: datapoints
      })
    );

    this.state.raycaster.setFromCamera(this.state.mouse, this.state.camera);

    // This checks if time is a multiple of 5
    // If true, it resets all sensor to random values between 0 and 1
    // This is just an aspect of the prototype
    // We needed it to practice sendind data from js to GLSL
    if (Math.round(this.state.clock.getElapsedTime(), 2.) % 5 == 0) {
      for (var i = 0; i < 16; i++) {
        this.state.newData[i] = Math.random();
      }
    }

    // Update sensor data and render
    this.state.uniforms.data.value = this.state.newData;
    this.renderer.render(this.state.scene, this.state.camera);

    // NOTES
    // Working address: 127.0.0.1:9583
    // Docs: https://threejs.org/docs/
    // Command to start server: python -m http.server 9583

    this.animate();

  };

  onKeyDownUp = (event) => {

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
  onDblMouseClick = (event) => {

    // Generate mouse coordinates from 0 to 1 (for x and y)
    this.state.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.state.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Calculate objects intersecting the picking ray
    this.state.raycaster.setFromCamera(this.state.mouse, this.state.camera);
    let ray = this.state.raycaster.intersectObjects(this.state.mesh.children);
    for (var i = 0; i < ray.length; i++) {
      console.log(this.state.sens_num, ray[i].uv);
      this.state.posarr[this.state.sens_num] = ray[i].uv;
      this.state.uniforms.positions.value = this.state.posarr;
    }

  }


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

    this.renderer.render(this.scene, this.camera);
    this.requestID = window.requestAnimationFrame(this.startAnimationLoop);

  };

  componentWillUnmount() {

    window.removeEventListener("dblclick", this.state.onDblMouseClick, false);
    window.removeEventListener("keydown", this.state.onKeyDownUp, false);
    window.removeEventListener("keyup", this.state.onKeyDownUp, false);
    window.cancelAnimationFrame(this.requestID);

  }
  render() {
    return ( < canvas ref = {
        this.canvasRef
      }
      />)
    }

  }


  export {
    HandVis
  };
