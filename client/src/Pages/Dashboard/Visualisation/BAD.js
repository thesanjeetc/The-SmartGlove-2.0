import React, {
  Component
} from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import {
  readStream
} from "../Other/api";
import Config from "../ConfigFile";

class HandVis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newData: new Array(10).fill(0)
    };
    // Set up global variables
    // Set up Three.js scene, camera and stats
    this.state.scene = new THREE.Scene(); //all in constructor
    this.state.scene.background = new THREE.Color(0x262D47);
    this.state.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.state.stats = new Stats();
    this.state.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.state.stats.dom);

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
      this.state.posarr.push(new THREE.Vector2(Math.random(), Math.random())) //xurely a lot of this can go in constructor
    }
    this.state.clock = new THREE.Clock() //this is fucking chaos



    //isn't this what you want, for the first bith,, hmm nnice? I think so, do we keep all these lets


    // Create array to hold sensor data


    // Load geometry
    let loadPromise = new Promise(function(resolve, reject) {
      let loader = new THREE.OBJLoader();
      loader.load('base_hand.obj', function(gltf) {
          this.state.mesh = gltf;
          resolve(this.state.mesh);
        },

        // Called while loading is progressing
        function(xhr) {
          console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },

        // Called when loading has errors
        function(error) {
          console.log('An error happened');
        }

      );
    });


    loadPromise.then(
      function(response) {
        this.state.mesh = response;

        // Initialise the render
        init();
        animate();
      })

    this.state.uniforms = {
      // Glove Texture
      text: {
        type: "t",
        value: THREE.ImageUtils.loadTexture("NewHand.png")
      },

      // Positions of sensors
      positions: {
        type: "v2v",
        value: posarr
      },

      // Sensor data
      data: {
        value: this.state.newData
      }
    }

    // GLSL Shader Material
    this.state.pressureMat = new THREE.ShaderMaterial({
      uniforms: this.state.uniforms,
      vertexShader: document.getElementById('vertexshader').textContent,
      fragmentShader: document.getElementById('simplefrag').textContent
    })

    // Set up mesh
    this.state.mesh.scale.set(10, 10, 10);
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
    scene.add(this.state.mesh);

    // Set up renderer and orbit camera controls
    this.state.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    this.state.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.state.renderer.domElement);
    this.state.orbit = new THREE.OrbitControls(this.state.camera, renderer.domElement);
    this.state.camera.position.set(1.25, 26, 0);
    this.state.orbit.update();

    // Set up event listening functions
    window.addEventListener("dblclick", onDblMouseClick, false)
    window.addEventListener("keydown", onKeyDownUp, false)
    window.addEventListener("keyup", onKeyDownUp, false)
  }
  componentDidMount() {




    // Json containing information we send to GLSL


    // Animate function (loop?)
    function animate() {
      this.state.stats.begin();
      this.state.orbit.update();
      render();
      this.state.stats.end();
      requestAnimationFrame(animate); //is it literally just a case of adding this I don't actually know tbh
    }


    function render() {

      this.state.raycaster.setFromCamera(mouse, camera);

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
      this.state.renderer.render(this.state.scene, this.state.camera);

    }


    // NOTES
    // Working address: 127.0.0.1:9583
    // Docs: https://threejs.org/docs/
    // Command to start server: python -m http.server 9583


  animate();
}

// Called on key down/up, used to select the sensor one wishes to move
function onKeyDownUp(event) {

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
function onDblMouseClick(event) {

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


render() {
  return ( <
    div ref = {ref => (this.mount = ref)}/>
  )
}
}

export {
  HandVis
};
