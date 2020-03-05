// {
//
//   "fragshader":"#ifdef GL_ES precision highp float; #endif \n #include <common> \n varying vec2 texcoord; uniform sampler2D text; uniform vec2 positions[16]; uniform float data[16]; const int num = 16; float colormap_red(float x) { if (x < 0.7) { return 4.0 * x - 1.5; } else { return -4.0 * x + 4.5; } } float colormap_green(float x) { if (x < 0.5) { return 4.0 * x - 0.5; } else { return -4.0 * x + 3.5; } } float colormap_blue(float x) { if (x < 0.3) { return 4.0 * x + 0.5; } else { return -4.0 * x + 2.5; } } vec4 colormap(float x) { float r = clamp(colormap_red(x), 0.0, 1.0); float g = clamp(colormap_green(x), 0.0, 1.0); float b = clamp(colormap_blue(x), 0.0, 1.0); return vec4(r, g, b, 1.0); } void main( void ) { float val = texture2D(text, texcoord).r; float finalcol = 0.; for(int i = 0; i < num; i++) { finalcol += data[i]*exp(-1.*pow((distance(positions[i], texcoord) / 0.05), 2.)); } gl_FragColor = colormap(clamp(finalcol * val, 0., 1.));",
//
//   "vertexshader":"#ifdef GL_ES precision highp float; #endif \n varying vec2 texcoord; void main() {gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); texcoord  = uv;}"
//
// }

var vertshader = `

  // switch on high precision floats
  #ifdef GL_ES
  precision highp float;
  #endif
  varying vec2 texcoord;
  void main()
  {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      texcoord  = uv;
  }`;

var fragshader = `
	  // Set up variables
      #ifdef GL_ES
      precision highp float;
      #endif
      #include <common>
      varying vec2 texcoord;
      uniform sampler2D text;
      uniform vec2 positions[8];
  	  uniform float data[8];
      const int num = 8;

	  // Set up colourmap components
      float colormap_red(float x) {
          if (x < 0.7) {
              return 4.0 * x - 1.5;
          } else {
              return -4.0 * x + 4.5;
          }
      }

      float colormap_green(float x) {
          if (x < 0.5) {
              return 4.0 * x - 0.5;
          } else {
              return -4.0 * x + 3.5;
          }
      }

      float colormap_blue(float x) {
          if (x < 0.3) {
             return 4.0 * x + 0.5;
          } else {
             return -4.0 * x + 2.5;
          }
      }

      // Colourmap function
      vec4 colormap(float x) {
          float r = clamp(colormap_red(x), 0.0, 1.0);
          float g = clamp(colormap_green(x), 0.0, 1.0);
          float b = clamp(colormap_blue(x), 0.0, 1.0);
          return vec4(r, g, b, 1.0);
      }

	  // Main function for colouring each pixel according to position and sensors
      void main( void ) {
          float val = texture2D(text, texcoord).r;
          float finalcol = 0.;

		  // Iterates through each sensor, adding value to finalcol
          for(int i = 0; i < num; i++) {
              finalcol += data[i]*0.01*exp(-1.*pow((distance(positions[i], texcoord) / 0.05), 2.));
          }

		  //Creates colour for pixel
		  gl_FragColor = colormap(clamp(finalcol * val, 0., 1.));
      }
`;

export { vertshader, fragshader };
