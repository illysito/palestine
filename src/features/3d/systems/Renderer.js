import { WebGLRenderer, ReinhardToneMapping } from 'three'
import * as THREE from 'three'

function createRenderer() {
  const renderer = new WebGLRenderer({
    // antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
  })
  renderer.setClearColor(0xfdfdfd, 1)
  renderer.physicallyCorrectLights = true
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = ReinhardToneMapping // or ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.15
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.physicallyCorrectLights = true

  // renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setSize(window.innerWidth, window.visualViewport.height)

  // renderer.setClearColor(0x000000, 0)

  return renderer
}

export { createRenderer }
