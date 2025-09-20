// import { PointLight, PointLightHelper } from 'three'
import { PointLight } from 'three'
// import { DirectionalLight} from 'three'

function createLight(x, y, z, i, color, isMove) {
  // const light = new DirectionalLight('#fffbf6', 8)
  const light = new PointLight(color, i, 10)
  light.position.set(x, y, z)
  light.castShadow = false
  // const helper = new PointLightHelper(light, 1, 0xff0000)

  if (isMove) {
    let counter = 0
    // let scrollY = 0
    let damp = 0.05
    light.tick = (delta) => {
      counter += delta
      light.position.x = 2.5 * Math.sin(counter * damp)
      // light.position.y = 1.3 * Math.cos(counter * damp)
      // light.position.z = 1 * Math.sin(counter * damp)
    }

    // window.addEventListener('scroll', () => {
    //   scrollY = window.scrollY
    // })
  }
  // return { light, helper }
  return light
}

export { createLight }
