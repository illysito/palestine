import { Color, Scene } from 'three'

function createScene() {
  const scene = new Scene()

  scene.background = new Color('#fff6ee')
  // scene.background = new Color('#0000ff')
  scene.background = null

  return scene
}

export { createScene }
