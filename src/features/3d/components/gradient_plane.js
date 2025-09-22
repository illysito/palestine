import gsap from 'gsap'
import { DoubleSide, ShaderMaterial, PlaneGeometry, Mesh } from 'three'

//prettier-ignore
import { grad_frag, grad_vertex } from '../shaders/sh_gradient.js'

function createGradPlane() {
  //prettier-ignore
  const size = 16
  const planeH = size * 10
  const planeW = size * 10

  const uniforms = {
    u_time: { value: 1600.0 + 100.0 * Math.random() },
    u_mouseX: { value: 0.0 },
    u_mouseY: { value: 0.0 },
    u_colorValue: { value: 0.0 },
  }

  const fragmentShader = grad_frag

  const vertexShader = grad_vertex

  const material = new ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    wireframe: false,
    side: DoubleSide,
    opacity: 0.2,
  })

  //prettier-ignore
  const geometry = new PlaneGeometry(planeW, planeH, 250, 250) /* UPDATE LATER */
  const mesh = new Mesh(geometry, material)

  mesh.rotation.x = 114 * (Math.PI / 180)
  mesh.position.z = 8.5
  mesh.position.z = 6.5
  mesh.position.z = 0
  mesh.position.y = 0.1

  mesh.tick = (delta) => {
    uniforms.u_time.value = (uniforms.u_time.value + 0.05 * delta) % 10000
    // console.log('ticking' + uniforms.u_time)
  }

  window.addEventListener('mousemove', (event) => {
    //prettier-ignore
    const mouseX = gsap.utils.mapRange(0, window.innerWidth, 0.0, 1.0, event.clientX)
    //prettier-ignore
    const mouseY = gsap.utils.mapRange(0, window.innerHeight, 0.0, 1.0, event.clientY)

    uniforms.u_mouseX.value = mouseX
    uniforms.u_mouseY.value = mouseY
  })

  // COLOR PICKER (REMOVE FINALLY)
  // const slider = document.querySelector('.slider')
  // const handle = document.querySelector('.handle')
  // let isDragging = false
  // let MAX_VALUE = 1.0
  // handle.addEventListener('mousedown', () => {
  //   isDragging = true
  // })
  // window.addEventListener('mouseup', () => {
  //   isDragging = false
  // })
  // window.addEventListener('mousemove', (e) => {
  //   if (isDragging) {
  //     let sliderRect = slider.getBoundingClientRect()
  //     let handleRect = handle.getBoundingClientRect()
  //     // determino la x inicial (0) como la posición de mi ratón menos el borde del rectángulo
  //     let x = e.clientX - sliderRect.left
  //     x = Math.max(0, Math.min(x, sliderRect.width - handleRect.width))
  //     handle.style.left = x + 'px'

  //     uniforms.u_colorValue.value = gsap.utils.mapRange(
  //       0,
  //       sliderRect.width,
  //       0,
  //       MAX_VALUE,
  //       x
  //     )
  //     console.log(uniforms.u_colorValue.value)
  //   }
  // })

  return mesh
}

export { createGradPlane }
