const setSize = (container, camera, renderer) => {
  // Set the camera's aspect ratio
  camera.aspect = container.clientWidth / container.clientHeight
  camera.updateProjectionMatrix()
  // update the size of the renderer AND the canvas
  renderer.setSize(container.clientWidth, container.clientHeight)
  // set the pixel ratio (for mobile devices)
  renderer.setPixelRatio(window.devicePixelRatio)
}

function isDesktopOrTablet() {
  return window.innerWidth >= 768
  // return true
}

class Resizer {
  constructor(container, camera, renderer) {
    setSize(container, camera, renderer)
    if (isDesktopOrTablet()) {
      window.addEventListener('resize', () => {
        setSize(container, camera, renderer)
        this.onResize()
      })
    }
  }
  onResize() {
    console.log('resizing!')
  }
}

export { Resizer }
