//prettier-ignore
// import gsap from 'gsap'
import { MeshPhysicalMaterial, TextureLoader, Color } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

function createPaddle() {
  return new Promise((resolve) => {
    const loader = new GLTFLoader()
    const textureLoader = new TextureLoader()
    //prettier-ignore
    // const url = 'https://cdn.jsdelivr.net/gh/illysito/padmi@main/objPaddle.glb' // PADDLE
    // const url = 'https://raw.githubusercontent.com/illysito/illy/a77728eac81f76ebbb08a729e0a9fbc681efd843/old_italian_coffee_maker_moka.glb' // COFFEE
    const url = 'https://raw.githubusercontent.com/illysito/illy/19c1e0bbea612d52c84233eb0261efa6b49f2afa/chinese_teapot.glb' // TEAPOT
    // const url = 'https://raw.githubusercontent.com/illysito/padmi/refs/heads/main/tennisball.obj' // IPHONE
    const textureUrl =
      'https://raw.githubusercontent.com/illysito/illy/ea76c80ead519eb558b189c06bc01e7486481335/metal_color.png'

    textureLoader.load(textureUrl, (texture) => {
      console.log(texture)
      loader.load(url, (gltf) => {
        console.log('texture loaded')
        const paddle = gltf.scene
        paddle.traverse((child) => {
          if (child.isMesh) {
            child.material = new MeshPhysicalMaterial({
              // map: texture,
              color: new Color(0xffffff),
              emissive: new Color(0xee1177),
              // emissive: new Color(0x4400ff), // kinda purple
              emissiveIntensity: 2,
              roughness: 0.1,
              metalness: 0.0,
              reflectivity: 0.1,
              wireframe: true,
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
        let scale = (1.6 * window.innerWidth) / 9600
        if (isMobile()) scale = window.innerWidth / 3400
        scale = 0.2
        // if (isMobile()) scale = 0.11
        paddle.scale.set(scale, scale, scale)

        // POSITION
        paddle.position.z = 2
        paddle.position.y = -1.8
        paddle.position.x = 0

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
        let rotationBias = -0
        if (isMobile()) rotationBias = -45

        // LOOP
        let counter = 0
        paddle.tick = (delta) => {
          counter += 0.5 * delta
          paddle.rotation.x =
            0.2 * (-90 * toRad + Math.sin(counter) * 20 * toRad)
          paddle.rotation.y =
            1 *
            (rotationBias * toRad +
              Math.cos(counter) * 20 * toRad +
              paddleRotationX)
          paddle.rotation.z =
            0.1 * (Math.sin(0.5 * counter) * 360 * toRad + paddleRotationX) // Apply rotation to X axis
          // Damping effect applied even if mouse is moving
          rotationalSpeedX *= damping
          // Smooth update of rotations with rotational speeds
          paddleRotationX += rotationalSpeedX - scroll * 0.00025
          // console.log(colorCounter)
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

          // window.addEventListener('scroll', () => {
          //   scroll = window.scrollY
          // })
        }

        resolve(paddle)
      })
    })
  })
}

export { createPaddle }
