import './styles/style.css'

// 3D
import world from './features/3d/world/universe'
// SCRIPTS
import displayDate from './features/scripts/date'
import fetchNumbers, { displayNumbers } from './features/scripts/numbers.js'
// UTILS
import { $ } from './features/utils/dom'

console.log('Free Palestine!')

const starfieldContainer = $('.sanctuary-container')

async function init() {
  world(starfieldContainer)
  await fetchNumbers()
  displayNumbers()
  displayDate()
  setInterval(displayDate, 1000)
}

init()
