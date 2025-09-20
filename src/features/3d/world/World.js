//LEGACY IMPORTS
import gsap from 'gsap'
// import * as THREE from 'three'
import { Vector2 } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
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
    // adding canvas element to the webflow container
    container.append(this.renderer.domElement)
    this.initPostprocessing()
    // INITS!!!!!

    this.initPaddle()
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
    // console.log(pixelRatioForBloom)

    let bloomStrength =
      0.5 * gsap.utils.mapRange(0, 1440, 0, 1.2, window.innerWidth)
    if (isDesktopOrTablet()) {
      bloomStrength = 0.2
    }

    this.composer = new EffectComposer(this.renderer)

    const renderPass = new RenderPass(this.scene, this.camera)
    let bloomPass

    bloomPass = new UnrealBloomPass(
      new Vector2(window.innerWidth, window.innerHeight),
      bloomStrength * pixelRatioForBloom, // strength (ALWAYS DIVIDE BY PIXEL RATIO to AVOID SHIT)
      0.2, // radius
      0.5 // threshold
    )

    const fxaaPass = new ShaderPass(FXAAShader)
    const pixelRatio = this.renderer.getPixelRatio()
    fxaaPass.material.uniforms['resolution'].value.x =
      1 / (window.innerWidth * pixelRatio)
    fxaaPass.material.uniforms['resolution'].value.y =
      1 / (window.innerHeight * pixelRatio)

    this.composer.addPass(renderPass)
    if (bloomPass) this.composer.addPass(bloomPass)
    this.composer.addPass(fxaaPass)

    // Override loop’s render if needed
    this.loop.renderOverride = () => {
      this.composer.render()
    }
  }

  async initPaddle() {
    const { createPaddle } = await import('../components/paddle.js')
    const paddle = await createPaddle()
    this.scene.add(paddle)
    this.loop.updatables.push(paddle)
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
