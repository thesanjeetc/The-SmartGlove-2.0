// Set up global variables
let scene, camera, renderer, raycaster, mouse, mesh, uniforms, orbit, stats;
clock = new THREE.Clock()


// Create array to hold sensor data
let dataarr = [];
for (var i = 0; i < 16; i++) {
     dataarr.push(0.0);
}


// Load geometry
let loadPromise = new Promise(function(resolve, reject) {
  let loader = new THREE.OBJLoader();
  loader.load('base_hand.obj', function(gltf) {
      mesh = gltf;
      resolve(mesh);
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
    mesh = response;

    // Initialise the render
    init();
    animate();
  })


function init() {
  // Set up Three.js scene, camera and stats
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x262D47);
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom);

  // Set up raycaster and mouse
  let posarr = [];
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // Set up initial random sensor positions
  var map = {};
  for (var i = 0; i < 16; i++) {
    posarr.push(new THREE.Vector2(Math.random(),Math.random()))
  }

  // Set up variables for key down/up function
  let isListening = false;
  let numbers = [];

 // Called on key down/up, used to select the sensor one wishes to move
 function onKeyDownUp(event) {

     // Checks for for start of keybind
     if (event.key == "a" && event.type == "keydown") {
         console.log("Listening");
         isListening = true;
         return;
     }

     // When keybind complete, computes inputs and resets variables
     if (event.key == "a" && event.type == "keyup") {
         console.log("Stopped listening");
         isListening = false;
         console.log(numbers.join(''))
         sens_num = parseFloat(numbers.join('')) - 1.;
         console.log(sens_num);
         numbers = [];
         return;
     }

     // Collects the user's number input
     if (isListening && event.type == "keydown") {
         numbers.push(event.key);
     }
 }


  // Called on double-click, used for placing sensors
  function onDblMouseClick(event) {

      // Generate mouse coordinates from 0 to 1 (for x and y)
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Calculate objects intersecting the picking ray
      raycaster.setFromCamera(mouse, camera);
      let ray = raycaster.intersectObjects(mesh.children);
      for (var i = 0; i < ray.length; i++) {
        console.log(sens_num, ray[i].uv);
        posarr[sens_num] = ray[i].uv;
        uniforms.positions.value = posarr;
      }

  }

  // Json containing information we send to GLSL
  uniforms = {

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
    data: {value: dataarr
    }
  }

  // GLSL Shader Material
  let pressureMat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: document.getElementById('vertexshader').textContent,
    fragmentShader: document.getElementById('simplefrag').textContent
  })

  // Set up mesh
  mesh.scale.set(10, 10, 10);
  mesh.traverse((o) => {
    console.log(o)
    if (typeof(o.material) !== "undefined") {
      o.material = pressureMat;
      console.log("set Material");
    }
  });

  // Plane geometry, used for testing:
  // var geometry = new THREE.PlaneGeometry( 100, 100, 10,10 );
  // var material = pressureMat;
  // mesh = new THREE.Mesh( geometry, material );

  // Add mesh
  console.log(mesh)
  scene.add(mesh);

  // Set up renderer and orbit camera controls
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  orbit = new THREE.OrbitControls(camera, renderer.domElement);
  camera.position.set(1.25, 26, 0);
  orbit.update();

  // Set up event listening functions
  window.addEventListener("dblclick", onDblMouseClick, false)
  window.addEventListener("keydown", onKeyDownUp, false)
  window.addEventListener("keyup", onKeyDownUp, false)

}

// Animate function (loop?)
function animate() {
  stats.begin();
  orbit.update();
  render();
  stats.end();
  requestAnimationFrame(animate);
}


function render() {

   raycaster.setFromCamera(mouse, camera);

   // This checks if time is a multiple of 5
   // If true, it resets all sensor to random values between 0 and 1
   // This is just an aspect of the prototype
   // We needed it to practice sendind data from js to GLSL
   if (Math.round(clock.getElapsedTime(), 2.) % 5 == 0) {
       for (var i = 0; i < 16; i++) {
           dataarr[i] = Math.random();
       }
   }

   // Update sensor data and render
   uniforms.data.value = dataarr;
   renderer.render(scene, camera);

}


// NOTES
// Working address: 127.0.0.1:9583
// Docs: https://threejs.org/docs/
// Command to start server: python -m http.server 9583
