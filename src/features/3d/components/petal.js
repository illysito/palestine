//prettier-ignore
import gsap from 'gsap'
import { MeshToonMaterial, Color } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

function createPetal() {
  return new Promise((resolve) => {
    const loader = new GLTFLoader()
    //prettier-ignore
    const url = 'https://cdn.jsdelivr.net/gh/illysito/palestine@main/pink_rose_petals.glb' // PADDLE
    // const url = 'https://raw.githubusercontent.com/illysito/padmi/refs/heads/main/tennisball.obj' // IPHONE

    loader.load(url, (gltf) => {
      const petal = gltf.scene
      petal.traverse((child) => {
        if (child.isMesh) {
          console.log('Mesh:', child.name, child.geometry, child.material)
          child.material = new MeshToonMaterial({
            color: new Color(0xffddcc),
            // emissie: new Color(0x00ff00),
            // emissive: new Color(0x5511f6),
            emissive: new Color(0xff0011),
            emissiveIntensity: 2.5,
            wireframe: false,
          })
        }
      })
      // INITIAL SET UP
      function isMobile() {
        // return window.innerWidth >= 768
        // console.log('isMob!')
        return window.innerWidth <= 478
      }
      // SCALE
      // Should be 0.15 for DESKTOP and 0.10 for TABLET --> 950/9500 = 0.10 ; 1440/9500 = 0.1515 --> 9500 is OK!
      let scale = (1.6 * window.innerWidth) / 200
      if (isMobile()) scale = window.innerWidth / 100
      // if (isMobile()) scale = 0.11
      petal.scale.set(scale, scale, scale)

      // POSITION
      petal.position.z = 2
      if (isMobile()) petal.position.y = -0.12

      // ROTATION
      let toRad = Math.PI / 180
      let lastMouseX = 0
      let scroll = 0
      // These will track the rotational speed in both axes
      let rotationalSpeedX = 0

      // Constants for acceleration, deceleration, and damping
      const maxSpeed = 0.05 // Maximum rotational speed
      const acceleration = 0.25 // How quickly the object accelerates to its maximum speed
      const damping = 0.9 // How quickly it slows down when the mouse stops moving

      let paddleRotationX = 0
      let rotationBias = -60
      if (isMobile()) rotationBias = -45

      // LOOP
      let counter = 0
      petal.tick = (delta) => {
        counter += 0.5 * delta
        petal.rotation.x = -90 * toRad + Math.sin(counter) * 20 * toRad
        petal.rotation.y = rotationBias * toRad + Math.cos(counter) * 20 * toRad
        petal.rotation.z =
          Math.sin(0.5 * counter) * 360 * toRad + paddleRotationX // Apply rotation to X axis
        // Damping effect applied even if mouse is moving
        rotationalSpeedX *= damping
        // Smooth update of rotations with rotational speeds
        paddleRotationX += rotationalSpeedX - scroll * 0.00025
        // console.log(colorCounter)
        petal.position.x = gsap.utils.mapRange(
          0,
          window.innerWidth,
          -0.05,
          0.05,
          lastMouseX
        )
      }

      // ANIMATION
      if (!isMobile()) {
        window.addEventListener('mousemove', (event) => {
          const currentMouseX = event.clientX
          // Calculate mouse movement (velocity)
          const deltaX = currentMouseX - lastMouseX
          // If there is movement, update rotational speed
          if (Math.abs(deltaX) > 6) {
            rotationalSpeedX += deltaX * acceleration
            // Cap the rotational speed to a maximum value
            // prettier-ignore
            rotationalSpeedX = Math.min(Math.max(rotationalSpeedX, -maxSpeed), maxSpeed)
          }
          // Update last mouse position
          lastMouseX = currentMouseX
        })

        window.addEventListener('scroll', () => {
          scroll = window.scrollY
        })
      }

      resolve(petal)
    })
  })
}

export { createPetal }
