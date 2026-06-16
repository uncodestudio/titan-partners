import mapSvg from '../assets/europe-map.svg?raw'
import { ready } from './utils.js'

const HIGHLIGHT_COLOR = '#f6735c'
const ROTATION_MS = 10000

export function init() {
  ready(() => {
    document.querySelectorAll('[data-map="europe"]').forEach((el) => {
      el.innerHTML = mapSvg
    })
    initCountries()
  })
}

function initCountries() {
  const buttons = [...document.querySelectorAll('.map_countries-item')]
  if (!buttons.length) return

  let currentIndex = 0
  let timer = null

  function selectCountry(index) {
    const btn = buttons[index]
    const country = btn.dataset.country

    buttons.forEach((b) => b.classList.remove('is-select'))
    btn.classList.add('is-select')

    document.querySelectorAll('[data-map="europe"] g[id] path').forEach((path) => {
      path.setAttribute('fill', 'currentColor')
    })

    const group = document.querySelector(`[data-map="europe"] #${country}`)
    if (group) {
      group.querySelectorAll('path').forEach((path) => {
        path.setAttribute('fill', HIGHLIGHT_COLOR)
      })
    }

    currentIndex = index
  }

  function startRotation() {
    clearInterval(timer)
    timer = setInterval(() => {
      selectCountry((currentIndex + 1) % buttons.length)
    }, ROTATION_MS)
  }

  buttons.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      selectCountry(i)
      startRotation()
    })
  })

  selectCountry(0)
  startRotation()
}
