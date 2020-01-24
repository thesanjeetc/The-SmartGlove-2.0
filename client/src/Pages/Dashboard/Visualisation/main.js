let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let loader = new THREE.GLTFLoader();
let mesh;
let hand;
let dataarr = [];
let posarr = [];
let loaded = false;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function onMouseMove(event) {

  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

}

for (var i = 0; i < 16; i++) {
  posarr.push(new THREE.Vector2(0.5, 0.5));
  dataarr.push(new THREE.Vector3(Math.random() * 10, Math.random() * 100, 1.0));
};
let pressureMat = new THREE.ShaderMaterial({
  uniforms: {

    positions: {
      type: "v2v",
      value: posarr
    },
    data: {
      type: "v3v",
      value: dataarr
    },
    resolution: {
      value: new THREE.Vector2(100, 100)
    }
  },
  fragmentShader: document.getElementById('fragmentShader').textContent
});

loader.load('EESHands.glb', function(gltf) {
    mesh = gltf.scene
    mesh.scale.set(10, 10, 10);
    mesh.traverse((o) => {
      if (o.isMesh) {
        o.material = pressureMat;
      }
    });
    console.log(mesh)
    scene.add(mesh);
    loaded = true;


  },
  // called while loading is progressing
  function(xhr) {

    console.log((xhr.loaded / xhr.total * 100) + '% loaded');

  },
  // called when loading has errors
  function(error) {

    console.log('An error happened');

  }
);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);



camera.position.z = 5;
while (!loaded) {
  console.log("loading")
}

function render() {

  // update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // calculate objects intersecting the picking ray
  var intersects = raycaster.intersectObject(hand);

  for (var i = 0; i < intersects.length; i++) {

    intersects[i].object.material.color.set(0xff0000);

  }

  renderer.render(scene, camera);

}
window.addEventListener('mousemove', onMouseMove, false);

window.requestAnimationFrame(render);
