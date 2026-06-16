import { ready } from './utils.js'

const NAVBAR_SELECTOR = '.navbar_component'
const LIGHT_SECTIONS_SELECTOR = '[data-bg="light"]'
const DARK_OVERRIDE_SELECTOR = '[data-bg="dark"]'
const NAV_ELEMENTS = [
  '.navbar_logo',
  '.navbar_link',
  '.navbar_dropdown-toggle',
  '.nav_locales-dropdown',
  '.locale_link',
  '.menu-icon-top',
  '.menu-icon-middle',
  '.menu-icon-bottom',
]
const COLOR_LIGHT = '#0e1e1b'
const COLOR_DEFAULT = '#e4e2d6'

export function init() {
  ready(() => {
    const navbar = document.querySelector(NAVBAR_SELECTOR)
    if (!navbar) return

    const lightSections = document.querySelectorAll(LIGHT_SECTIONS_SELECTOR)
    if (!lightSections.length) return

    const navbarHeight = navbar.offsetHeight
    const lightIntersecting = new Set()
    const darkIntersecting = new Set()

    function update() {
      // dark elements (e.g. a CTA inside a light section) take priority
      const isLight = lightIntersecting.size > 0 && darkIntersecting.size === 0
      navbar.classList.toggle('is-light', isLight)
      const color = isLight ? COLOR_LIGHT : COLOR_DEFAULT
      NAV_ELEMENTS.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el) => {
          el.style.color = color
        })
      })
      document.querySelectorAll('.navbar_menu-button').forEach((el) => { el.style.borderColor = color })
    }

    const observerOptions = {
      rootMargin: `-${navbarHeight}px 0px -${window.innerHeight - navbarHeight}px 0px`,
      threshold: 0,
    }

    const lightObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) lightIntersecting.add(entry.target)
        else lightIntersecting.delete(entry.target)
      })
      update()
    }, observerOptions)

    const darkObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) darkIntersecting.add(entry.target)
        else darkIntersecting.delete(entry.target)
      })
      update()
    }, observerOptions)

    lightSections.forEach((section) => lightObserver.observe(section))
    document.querySelectorAll(DARK_OVERRIDE_SELECTOR).forEach((el) => darkObserver.observe(el))
  })
}
