const warp_particles_frag = `
precision highp float;

#define NUM_OCTAVES 5

uniform sampler2D u_texture;
uniform float u_mouseX;
uniform float u_mouseY;
uniform float u_prevMouseX;
uniform float u_prevMouseY;
uniform float u_velocityX;
uniform float u_velocityY;
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
  vec4 sampledTexture = texture2D(u_texture,vUv);

  if (sampledTexture.a < 0.5) discard;

  vec2 pos = vUv;
  vec2 mouse = vec2(u_mouseX, u_mouseY);
  float dist = distance(mouse, pos);
  float force = smoothstep(0.5, 0.0, dist);
  vec2 direction = normalize(vUv - mouse);

  // Displace away from mouse
  vec2 displacedUv = vUv + direction * force * 0.05;
  float alpha = texture2D(u_texture, displacedUv).a;

  vec4 color = texture2D(u_texture, pos);
  gl_FragColor = color;
  gl_FragColor = vec4(vec3(1.0,1.0,1.0),alpha);
}
`

// const warp_type_frag = `
// #ifdef GL_ES
// precision highp float;
// #endif

// uniform float u_time;
// uniform sampler2D u_texture;

// varying vec2 v_texcoord;

// void main() {
//   vec4 color = texture2D(u_texture, vUv);
//   gl_FragColor = color;
// }
// `

const warp_particles_vertex = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export { warp_particles_frag, warp_particles_vertex }
