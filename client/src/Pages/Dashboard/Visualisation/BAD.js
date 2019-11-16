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
