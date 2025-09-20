import './styles/style.css'

import displayDate from './features/date'
import fetchNumbers, { displayNumbers } from './features/numbers.js'

console.log('Free Palestine!')

async function init() {
  await fetchNumbers()
  displayNumbers()
  displayDate()
  setInterval(displayDate, 1000)
}

init()
