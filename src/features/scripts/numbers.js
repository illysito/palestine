import { $$ } from '../utils/dom'

let killedGaza = 0
let killedWestBank = 0
let childrenKilledGaza = 0
let childrenKilledWestBank = 0
let injuredGaza = 0
let injuredWestBank = 0

let lastReportGaza = ''
let lastReportWestBank = ''

function domElements() {
  return {
    numbers: $$('.numbers-num'),
    reports: $$('.meta-heading-latin'),
  }
}
const DOM = domElements()

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

function formatDate(dateStr) {
  const months = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ]
  // dateStr is in "YYYY-MM-DD"
  const [year, month, day] = dateStr.split('-')
  const monthName = months[parseInt(month, 10) - 1]
  return `${day} de ${monthName} de ${year}`
}

export default async function fetchNumbers() {
  try {
    const response = await fetch(
      'https://data.techforpalestine.org/api/v3/summary.json'
    )

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()

    killedGaza = data.gaza.killed.total
    killedWestBank = data.west_bank.killed.total
    childrenKilledGaza = data.gaza.killed.children
    childrenKilledWestBank = data.west_bank.killed.children
    injuredGaza = data.gaza.injured.total
    injuredWestBank = data.west_bank.injured.total

    lastReportGaza = data.gaza.last_update
    lastReportWestBank = data.west_bank.last_update

    // console.log(data)
    // console.log('killed in gaza: ' + killedGaza)
    // console.log('killed in west bank: ' + killedWestBank)
    // console.log('children killed in gaza: ' + childrenKilledGaza)
    // console.log('children killed in west bank: ' + childrenKilledWestBank)
    // console.log('injured in gaza: ' + injuredGaza)
    // console.log('injured in west bank: ' + injuredWestBank)
  } catch (error) {
    console.error('Fetch failed:', error)
  }
}

export function displayNumbers() {
  DOM.reports[0].textContent = 'Último reporte:\n' + formatDate(lastReportGaza)
  DOM.reports[1].textContent =
    'Último reporte:\n' + formatDate(lastReportWestBank)
  DOM.numbers[0].textContent = formatNumber(killedGaza)
  DOM.numbers[1].textContent = formatNumber(childrenKilledGaza)
  DOM.numbers[2].textContent = formatNumber(injuredGaza)
  DOM.numbers[3].textContent = formatNumber(killedWestBank)
  DOM.numbers[4].textContent = formatNumber(childrenKilledWestBank)
  DOM.numbers[5].textContent = formatNumber(injuredWestBank)
}
