//LEGACY IMPORTS
// import gsap from 'gsap'
// import * as THREE from 'three'
import { Vector2 } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'

import { createCamera } from '../components/camera.js'
import { createScene } from '../components/scene.js'
import { Loop } from '../systems/Loop.js'
import { createRenderer } from '../systems/Renderer.js'
import { Resizer } from '../systems/Resizer.js'

// let camera
// let scene
// let renderer
// let loop
function isDesktopOrTablet() {
  return window.innerWidth >= 768
}

// function isntMobile() {
//   return window.innerWidth >= 478
// }

class World {
  // 1. Create an instance of the World app
  constructor(container) {
    this.camera = createCamera()
    this.scene = createScene()
    this.renderer = createRenderer()
    this.loop = new Loop(this.camera, this.scene, this.renderer)
    container.append(this.renderer.domElement)

    this.initPostprocessing()

    // INITS!!!!!
    // this.initGradientPlane()
    this.initPetal()
    // this.initStarfield(5000)
    this.initLights(-2, 2, 3, 20, 0xfffbf6, false)
    // console.log('mobile 3d is running!')

    // BLOOM RESIZER
    const resizer = new Resizer(container, this.camera, this.renderer)
    resizer.onResize = () => {
      this.composer.setSize(container.clientWidth, container.clientHeight)
      this.render()
    }
  }

  // BLOOM POST PROCESSING INIT
  initPostprocessing() {
    let pixelRatioForBloom = window.devicePixelRatio || 1 // Not for renderer

    this.composer = new EffectComposer(this.renderer)

    const renderPass = new RenderPass(this.scene, this.camera)

    let bloomPass
    let bloomStrength = 0
    if (isDesktopOrTablet()) {
      bloomStrength = 0.2
    }
    bloomPass = new UnrealBloomPass(
      new Vector2(window.innerWidth, window.innerHeight),
      bloomStrength * pixelRatioForBloom, // strength (ALWAYS DIVIDE BY PIXEL RATIO to AVOID SHIT)
      1.0, // radius
      0.0 // threshold
    )

    const outlinePass = new OutlinePass(
      new Vector2(window.innerWidth, window.innerHeight),
      this.scene,
      this.camera
    )
    outlinePass.edgeStrength = 2.5
    outlinePass.edgeGlow = 0.5
    outlinePass.edgeThickness = 1.0
    outlinePass.visibleEdgeColor.set('#000000')

    const fxaaPass = new ShaderPass(FXAAShader)
    const pixelRatio = this.renderer.getPixelRatio()
    fxaaPass.material.uniforms['resolution'].value.x =
      1 / (window.innerWidth * pixelRatio)
    fxaaPass.material.uniforms['resolution'].value.y =
      1 / (window.innerHeight * pixelRatio)

    this.composer.addPass(renderPass)
    console.log(bloomPass)
    this.composer.addPass(outlinePass)
    this.composer.addPass(fxaaPass)

    // Override loop’s render if needed
    this.loop.renderOverride = () => {
      this.composer.render()
    }
  }

  async initPetal() {
    const { createPetal } = await import('../components/petal.js')
    const petal = await createPetal()
    this.scene.add(petal)
    this.loop.updatables.push(petal)
  }

  async initStarfield(particleCount) {
    const { createStarfield } = await import('../components/starfield.js')
    const starfield = createStarfield(particleCount, this.camera)
    this.scene.add(starfield)
    this.loop.updatables.push(starfield)
  }

  async initGradientPlane() {
    const { createGradPlane } = await import('../components/gradient_plane')
    const plane = createGradPlane()
    this.scene.add(plane)
    this.loop.updatables.push(plane)
  }

  async initLights(x, y, z, int, color, isMove) {
    const { createLight } = await import('../components/point_light.js')
    const light = createLight(x, y, z, int, color, isMove)
    this.scene.add(light)
    if (isMove) this.loop.updatables.push(light)
  }

  async initDirLights(x, y, z) {
    const { createDirLight } = await import(
      '../components/directional_light.js'
    )
    const dirLight = createDirLight(x, y, z)
    this.scene.add(dirLight)
  }

  // 2. Render the scene
  render() {
    // this.renderer.render(this.scene, this.camera)
    this.composer.render()
  }

  start() {
    this.loop.start()
    // console.log('World ' + this.index + ' has resumed ')
  }

  stop() {
    this.loop.stop()
    // console.log('World ' + this.index + ' has stopped ')
  }
}

export { World }
