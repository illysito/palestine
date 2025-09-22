import gsap from 'gsap'
//prettier-ignore
import {
  BufferAttribute,
  ShaderMaterial,
  BufferGeometry,
  // CanvasTexture,
  Points,
  Clock,
} from 'three'

const starfieldFragment = `
precision mediump float;

varying vec3 vPosition;

void main() {
  // Soft edges for circular particles
  float alphaFactor = mix(0.5, 0.8, clamp((vPosition.z + 1.0) * 0.5, 0.0, 1.0));

  vec2 coord = gl_PointCoord - 0.5;
  float dist = length(coord);
  float alpha = smoothstep(0.5, 0.48, dist);

  // Output final color (white particles)
  gl_FragColor = vec4(vec3(1.0), alphaFactor * alpha);
}
`

const starfieldVertex = `
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_strength;

varying vec3 vColor;
varying vec3 vPosition;

void main() {
  vec3 newPosition = position;

  vec2 mousePos = (u_mouse - 0.5) * 2.0;

  // PERSPECTIVE
  float distanceToCamera = length(newPosition);
  float sizeFactor = 20.0 / (1.0 + distanceToCamera * 0.2); 
  gl_PointSize = sizeFactor;

  // Final position
  // gl_PointSize = 50.0;
  vPosition = newPosition;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  // gl_PointSize = 5.0;
}
`

function createStarfield(starCount) {
  const particlesCnt = starCount
  const posArray = new Float32Array(particlesCnt * 3)
  let mouseX = 0
  let mouseY = 0

  for (let i = 0; i < particlesCnt; i++) {
    // Random starfield
    posArray[i * 3] = (Math.random() - 0.5) * 15 * (Math.random() - 2)
    posArray[i * 3 + 1] = (Math.random() - 0.5) * 15 // Y
    posArray[i * 3 + 2] = (Math.random() - 0.5) * 150 // Z
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(posArray, 3))

  const uniforms = {
    u_time: { value: 0 },
    u_mouse: { value: { x: 0.5, y: 0.5 } },
    u_strength: { value: 10.3 },
  }

  const material = new ShaderMaterial({
    uniforms,
    vertexShader: starfieldVertex,
    fragmentShader: starfieldFragment,
    transparent: true,
  })

  const mesh = new Points(geometry, material)
  mesh.position.z = -3

  const clock = new Clock()

  mesh.renderOrder = 10
  let counter = 0
  mesh.tick = (delta) => {
    counter++
    uniforms.u_time.value = clock.getElapsedTime()

    mesh.position.x = 0.075 * Math.sin(0.01 * counter)
    mesh.position.y = 0.075 * Math.cos(0.01 * counter)
    mesh.position.z += 0.0025

    mesh.rotation.y += delta * gsap.utils.mapRange(0, 1, -1, 1, mouseX) * 0.01
    mesh.rotation.x -= delta * gsap.utils.mapRange(0, 1, -1, 1, mouseY) * 0.01
  }

  // MOUSE INTERACTION
  let lastMouseMove = 0
  window.addEventListener('mousemove', (event) => {
    const now = performance.now()
    if (now - lastMouseMove < 16) return // Limit to ~60fps updates
    lastMouseMove = now
    //prettier-ignore
    mouseX = event.clientX / window.innerWidth
    mouseY = 1 - event.clientY / window.innerHeight // Flip Y axis
    uniforms.u_mouse.value.x = mouseX
    uniforms.u_mouse.value.y = mouseY
  })
  return mesh
}

export { createStarfield }
