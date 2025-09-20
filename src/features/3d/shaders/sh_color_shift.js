const color_shift_frag = `
#define NUM_OCTAVES 5

uniform sampler2D u_texture;
uniform float u_mouseX;
uniform float u_mouseY;
uniform float u_time;
uniform vec2 u_aspect;

varying vec2 vUv;

uniform vec2 u_prevMouse;

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);
	
	float res = mix(
		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}

float fbm(vec2 x) {
	float v = 0.0;
	float a = 0.5;
	vec2 shift = vec2(100);
	// Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
	for (int i = 0; i < NUM_OCTAVES; ++i) {
		v += a * noise(x);
		x = rot * x * 2.0 + shift;
		a *= 0.5;
	}
	return v;
}

void main() {
  
  // COORDINATES

  vec2 coords = vUv;
  vec2 normalized_coords = coords;
  float asp = u_aspect.x / u_aspect.y;
  normalized_coords.x *= asp;

  // MOUSE

  vec2 u_mouse = vec2(u_mouseX, u_mouseY);
  u_mouse.y = 1.0 - u_mouse.y;
  u_mouse.x *= asp;
  vec2 prevMouse = u_prevMouse;
  prevMouse.y = 1.0 - u_prevMouse.y;
  prevMouse.x *= asp;

  // DISTANCE

  float dist = distance(prevMouse, normalized_coords);

  // SEPARATE CHANNELS

  u_mouse = 2.0 * u_mouse - 1.0;
  float separation_factor = 0.0005 * smoothstep(1.0, 0.0, dist);

  vec4 redChannel = texture2D(u_texture, vec2(coords.x + separation_factor * u_mouse.x, coords.y + separation_factor * u_mouse.y));
  redChannel.g = 0.0;
  redChannel.b = 0.0;

  vec4 greenChannel = texture2D(u_texture, vec2(coords.x - separation_factor * u_mouse.x, coords.y - separation_factor * u_mouse.y));
  greenChannel.r = 0.0;
  greenChannel.b = 0.0;

  vec4 blueChannel = texture2D(u_texture, vec2(coords.x - separation_factor * u_mouse.x, coords.y - separation_factor * u_mouse.y));
  blueChannel.r = 0.0;
  blueChannel.g = 0.0;

  // OUTPUT

  vec4 color = redChannel + greenChannel + blueChannel;
  gl_FragColor = color;
}
`

const color_shift_vertex = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export { color_shift_frag, color_shift_vertex }
