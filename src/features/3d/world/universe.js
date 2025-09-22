import { World } from './World.js'

function world(container) {
  const world = new World(container)
  world.start()
}

export default world
