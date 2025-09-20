import { $ } from './utils/dom'

function domElements() {
  return {
    date: $('.nav-heading-latin'),
  }
}
const DOM = domElements()

export default function displayDate() {
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

  const now = new Date()

  // Format parts
  const day = String(now.getDate()).padStart(2, '0')
  const month = String(now.getMonth() + 1).padStart(2, '0') // months are 0-based
  const monthName = months[parseInt(month, 10) - 1]
  const year = now.getFullYear()

  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  // Example: 19 · 09 · 2025 — 14:37
  const formatted = `${day} de ${monthName} de ${year} — ${hours}:${minutes}:${seconds}`
  DOM.date.textContent = formatted
}
