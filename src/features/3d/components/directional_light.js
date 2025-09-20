import { DirectionalLight } from 'three'

function createDirLight(x, y, z) {
  const light = new DirectionalLight('#fffbf6', 40)
  light.position.set(x, y, z)

  let targetX = x
  let targetZ = z

  light.tick = (delta) => {
    // console.log('light tick & delta = ' + delta)
    light.position.z += (targetX - light.position.x - targetZ) * 0.5 * delta
    // light.position.y += (targetZ - light.position.z) * 0.5 * delta
  }

  window.addEventListener('mousemove', (event) => {
    targetX = (event.clientX / window.innerWidth) * 2 * (20 - 10) // Normalize to -5 to 5
    targetZ = (event.clientY / window.innerHeight) * 2 * (20 - 10) // Normalize to -5 to 5
  })

  return light
}

export { createDirLight }
