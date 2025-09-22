import gsap from 'gsap'
// import { Color } from 'three'
import { Group } from 'three'
//prettier-ignore
import {
  AdditiveBlending,
  BufferAttribute,
  PointsMaterial,
  BufferGeometry,
  TextureLoader,
  Raycaster,
  Vector2,
  // CanvasTexture,
  Points,
  // Clock,
} from 'three'

import hideName from '../../scripts/hideName'
import showName from '../../scripts/showName'

function createStarfield(starCount, camera) {
  const particlesCnt = starCount
  let mouseX = 0
  let mouseY = 0

  const posArray1 = []
  const colorsArray1 = []
  const posArray2 = []
  const colorsArray2 = []

  for (let i = 0; i < particlesCnt; i++) {
    // Random starfield
    const x = (Math.random() - 0.5) * 8 * (Math.random() + 4)
    const y = (Math.random() - 0.5) * 15 * (Math.random() + 0) // Y
    const z = (Math.random() - 0.5) * 25 // Z

    if (Math.random() > 0.5) {
      posArray1.push(x, y, z) // circles
      colorsArray1.push(0.9, 0.8, 0.75)
      // colorsArray1.push(0.2, 0.2, 0.2)
    } else {
      posArray2.push(x, y, z) // stars
      colorsArray2.push(0.9, 0.8, 0.75)
      // colorsArray2.push(0.2, 0.2, 0.2)
    }
  }

  // const circleURL =
  //   'https://raw.githubusercontent.com/illysito/palestine/1ba70ff2bd29583e3fbf06e86c9ae87ea5f1ed62/_star-texture.png'

  const tearURL =
    'https://raw.githubusercontent.com/illysito/palestine/391c307d9ab654f34c37f72d59f25d52c1598a85/_tear-3.png'

  // const starURL =
  //   'https://raw.githubusercontent.com/illysito/palestine/03e0e1a3f011331d086be56ac39b1e48e1013bb2/_star-texture-2.png'

  // const pipaUnoURL =
  //   'https://raw.githubusercontent.com/illysito/palestine/11fa3e4c64b1149735b16f55de0fa5a8726d0582/_pipa-1.png'

  // const pipaDosURL =
  //   'https://raw.githubusercontent.com/illysito/palestine/2c715a87ad11a33b8460e7dacf8b002297731c81/_pipa-2.png'

  // const tearURL =
  //   'https://raw.githubusercontent.com/illysito/palestine/e3a39b08ee30d00ea17f868159446a4d496ab71f/_tear-texture.png'

  const circleTexture = new TextureLoader().load(tearURL)
  const starTexture = new TextureLoader().load(tearURL)

  const circle_geometry = new BufferGeometry()
  circle_geometry.setAttribute(
    'position',
    new BufferAttribute(new Float32Array(posArray1), 3)
  )
  circle_geometry.setAttribute(
    'color',
    new BufferAttribute(new Float32Array(colorsArray1), 3)
  )

  const star_geometry = new BufferGeometry()
  star_geometry.setAttribute(
    'position',
    new BufferAttribute(new Float32Array(posArray2), 3)
  )
  star_geometry.setAttribute(
    'color',
    new BufferAttribute(new Float32Array(colorsArray2), 3)
  )

  const circle_material = new PointsMaterial({
    map: circleTexture,
    size: 0.3,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    color: 0xffffff,
    vertexColors: true,
  })

  const star_material = new PointsMaterial({
    map: starTexture,
    size: 0.3,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    color: 0xffffff,
    vertexColors: true,
  })

  const circle_mesh = new Points(circle_geometry, circle_material)
  circle_mesh.position.z = -3

  const star_mesh = new Points(star_geometry, star_material)
  star_mesh.position.z = 0

  const raycaster = new Raycaster()
  const mouse = new Vector2()

  const group = new Group()
  group.add(circle_mesh)
  group.add(star_mesh)

  group.renderOrder = 10

  let counter = 0
  let lastHover = null
  group.tick = (delta) => {
    counter++

    // camera.rotation.x +=
    //   delta *
    //   gsap.utils.mapRange(0, 1, -1, 1, mouseY) *
    //   0.005 *
    //   Math.sin(counter)
    // camera.rotation.y -=
    //   delta *
    //   gsap.utils.mapRange(0, 1, -1, 1, mouseX) *
    //   0.005 *
    //   Math.cos(counter)

    circle_mesh.position.x = 0.028 * Math.sin(0.01 * counter)
    circle_mesh.position.y = 0.032 * Math.cos(0.01 * counter)

    star_mesh.position.x = -0.025 * Math.sin(0.01 * counter)
    star_mesh.position.y = -0.035 * Math.cos(0.01 * counter)
    // circle_mesh.position.z += 0.0025

    //prettier-ignore
    circle_mesh.rotation.y +=delta * gsap.utils.mapRange(0, 1, -1, 1, mouseX) * 0.0011 * Math.sin(counter)
    //prettier-ignore
    circle_mesh.rotation.x -=delta * gsap.utils.mapRange(0, 1, -1, 1, mouseY) * 0.001 * Math.sin(counter)
    //prettier-ignore
    star_mesh.rotation.y += delta * gsap.utils.mapRange(0, 1, -1, 1, mouseX) * 0.0012 * Math.sin(counter)
    //prettier-ignore
    star_mesh.rotation.x -= delta * gsap.utils.mapRange(0, 1, -1, 1, mouseY) * 0.0008 * Math.sin(counter)

    // intersectObjects can take an array — pass your star meshes/group
    raycaster.setFromCamera(mouse, camera)
    raycaster.params.Points.threshold = 0.025
    const intersects = raycaster.intersectObjects([star_mesh, circle_mesh])

    if (intersects.length > 0) {
      const { object: mesh, index } = intersects[0]

      if (!lastHover || lastHover.mesh !== mesh || lastHover.index !== index) {
        // reset old one
        if (lastHover) {
          const prevColors = lastHover.mesh.geometry.getAttribute('color')
          prevColors.setXYZ(lastHover.index, 0.9, 0.8, 0.75) // back to white
          prevColors.needsUpdate = true
        }

        showName()
        // set new one yellow
        const colors = mesh.geometry.getAttribute('color')
        colors.setXYZ(index, 1, 1, 1)
        colors.needsUpdate = true

        lastHover = { mesh, index }
      }
    } else {
      // ✅ Reset when nothing is hovered
      if (lastHover) {
        hideName()
        const prevColors = lastHover.mesh.geometry.getAttribute('color')
        prevColors.setXYZ(lastHover.index, 0.9, 0.8, 0.75)
        prevColors.needsUpdate = true
        lastHover = null
      }
    }
  }

  // MOUSE INTERACTION
  window.addEventListener('mousemove', (event) => {
    // rotation of the stars
    mouseX = event.clientX / window.innerWidth
    mouseY = 1 - event.clientY / window.innerHeight // Flip Y axis

    // raycaster mouse reading
    mouse.x = (event.clientX / innerWidth) * 2 - 1
    mouse.y = -(event.clientY / innerHeight) * 2 + 1
  })
  return group
}

export { createStarfield }
