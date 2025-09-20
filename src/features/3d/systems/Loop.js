import { Clock } from 'three'

const clock = new Clock()

class Loop {
  constructor(camera, scene, renderer) {
    this.camera = camera
    this.scene = scene
    this.renderer = renderer
    this.updatables = []
    this.renderOverride = null
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      this.tick()
      // render a frame
      if (this.renderOverride) {
        this.renderOverride()
      } else {
        this.renderer.render(this.scene, this.camera)
      }
    })
  }

  stop() {
    this.renderer.setAnimationLoop(null)
  }

  tick() {
    const delta = clock.getDelta()
    for (const object of this.updatables) {
      object.tick(delta)
    }
  }
}

export { Loop }
