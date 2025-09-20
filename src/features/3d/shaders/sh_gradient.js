const grad_frag = `
precision highp float;

#define NUM_OCTAVES 5

uniform float u_time;
uniform float u_mouseX;
uniform float u_mouseY;
uniform float u_colorValue;
uniform vec2 u_aspect;

varying vec2 vUv;
varying vec4 vColor;

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

//	Simplex 3D Noise 
//	by Ian McEwan, Stefan Gustavson (https://github.com/stegu/webgl-noise)
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0. + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

// Permutations
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

vec4 rgb(vec4 color){
  color.x /= 255.0;
  color.y /= 255.0;
  color.z /= 255.0;
  color.w /= 255.0;

  return color;
}

void main() {

  // COORDINATES

  vec2 uv = vUv;

  vec4 vertexColor = vColor;

  float noise = snoise(vec3(uv.x * 0.8 * u_time, uv.y * 0.9 * u_time, u_time));
  float grain = rand(uv);

  // DARK MODE

  vec4 color1 = rgb(vec4(255.0, 249.0, 244.0, 255.0));
  vec4 color2 = rgb(vec4(0.0, 0.0, 0.0, 0.5));
  vec4 color3 = rgb(vec4(255.0, 255.0, 1.0, 1.0));
  vec4 color4 = rgb(vec4(255.0, 250.0, 0.0, 1.0));

  // color1 = rgb(vec4(0.0,0.0,255.0,255.0));
  // color1 = rgb(vec4(u_colorValue,u_colorValue,255.0,255.0));
  // color2 = rgb(vec4(u_colorValue,u_colorValue,255.0,255.0));

  // LIGHT MODE

  // vec4 color1 = rgb(vec4(255.0, 249.0, 244.0, 255.0));
  // vec4 color2 = rgb(vec4(255.0, 255.0, 251.0, 255.5));
  // vec4 color3 = rgb(vec4(255.0, 255.0, 251.0, 255.0));
  // vec4 color4 = rgb(vec4(119.0, 100.0, 228.0, 255.0));

  vec4 grad1 = mix(color1, color2, 2.5 * uv.x + 0.0 * noise);
  vec4 grad2 = mix(color3, color4, 2.5 * uv.x + 0.0 * noise);
  vec4 color = mix(grad1, grad2, 2.0 * uv.y + 0.0 * noise);
  // color.w = 0.2;

  // OUTPUT

  vertexColor.w = 0.85;
  vec4 outColor = mix(color, vertexColor, 4.0 * uv.x);
  gl_FragColor = vertexColor;
  gl_FragColor = outColor;
}
`

const grad_vertex = `
uniform float u_time;

varying vec2 vUv;
varying vec4 vColor;

uniform float u_mouseX;
uniform float u_mouseY;
uniform float u_colorValue;

vec4 rgb(vec4 color){
  color.x /= 255.0;
  color.y /= 255.0;
  color.z /= 255.0;
  color.w /= 255.0;

  return color;
}

//	Simplex 3D Noise 
//	by Ian McEwan, Stefan Gustavson (https://github.com/stegu/webgl-noise)
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0. + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

// Permutations
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

void main() {

  vUv = uv;

  // DARK MODE
  vec4 base = vec4(0.0, 0.0, 0.0, 1.0);

  // LIGHT MODE
  // vec4 base = vec4(0.89, 0.9, 0.88, 1.0);

  // vColor = vec4(0.5, 0.5, 0.5, 1.0); // GRIS
  // vColor = rgb(vec4(119.0, 100.0, 228.0, 255.0)); // LILA
  vColor = rgb(vec4(30.0, 250.0, 255.0, 255.0)); // AZUL
  // vColor = rgb(vec4(255.0, 251.0, 248.0, 255.0)); // BLANCO
  vColor.r += 0.15 * u_mouseX * u_mouseY;

  // MOUSE COLOR:
  // vec4 mouseColor = rgb(vec4(255.0,255.0,255.0,255.0));
  // vColor = mix(vColor,mouseColor,u_colorValue);

  vec2 noiseCoord = vUv * vec2(3.0, 4.0);
  float noise = snoise(vec3(vec2(noiseCoord.x * 0.002 * u_time, noiseCoord.y * 0.001 * u_time), 0.85 * u_time));
  // noise = abs(noise);
  // noise = 1.0;

  // vColor = mix(base, vColor, 0.4 * noise);
  vColor *= 0.45 * noise; // original: 0.65
  // vColor = mix(vColor, base, noise);
  // vColor = clamp(vColor, vec4(0.1), vec4(1.0));

  float incline = uv.x * 0.5 * 0.01 * sin(u_time);
  float offset = incline * mix(-0.25, 0.25, uv.y);

  vec3 pos = vec3(position.x + 0.01 * u_mouseX, position.y - 0.005 * u_mouseY, position.z + noise + offset + incline);

  vColor *= noise;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

}
`

export { grad_frag, grad_vertex }
