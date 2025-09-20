import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

import { World } from './World.js'

function world(container) {
  // const trigger_mobile = document
  // let hasClaimBeenObserved = false
  // let lastScrollY = window.scrollY
  // let scrollDirection = 'down'
  // function updateScrollDirection() {
  //   const currentScrollY = window.scrollY
  //   scrollDirection = currentScrollY < lastScrollY ? 'up' : 'down'
  //   lastScrollY = currentScrollY
  // }

  // function isDesktopOrTablet() {
  //   return window.innerWidth >= 768
  // }

  const world = new World(container)
  world.start()

  gsap.to(container, {
    opacity: 0,
    scrollTrigger: {
      trigger: container,
      start: 'bottom 80%',
      end: 'bottom 50%',
      scrub: true,
    },
  })

  // // STOP LOOP WHEN UNOBSERVED (INTERSECTION OBSERVER METHOD)

  // if (isDesktopOrTablet()) {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //           if (!hasClaimBeenObserved) {
  //             world.stop()
  //             hasClaimBeenObserved = true
  //           }
  //         } else {
  //           if (window.scrollY < lastScrollY) {
  //             world.start()
  //             hasClaimBeenObserved = false
  //           }
  //         }
  //       })
  //     },

  //     { threshold: 0.5 }
  //   )

  //   observer.observe(trigger)

  //   window.addEventListener('scroll', () => {
  //     lastScrollY = window.scrollY
  //   })
  // } else {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //           if (!hasClaimBeenObserved) {
  //             world.stop()
  //             hasClaimBeenObserved = true
  //           }
  //         } else {
  //           if (scrollDirection === 'up') {
  //             world.start()
  //             hasClaimBeenObserved = false
  //           }
  //         }
  //       })
  //     },

  //     { threshold: 0.85 }
  //   )

  //   observer.observe(trigger)

  //   window.addEventListener('scroll', updateScrollDirection)
  //   window.addEventListener('touchmove', updateScrollDirection)
  // }
}

export default world
