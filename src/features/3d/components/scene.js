import { Color, Scene } from 'three'

function createScene() {
  const scene = new Scene()

  scene.background = new Color('#fffbf6')
  // scene.background = new Color('#0000ff')
  scene.background = null

  return scene
}

export { createScene }
