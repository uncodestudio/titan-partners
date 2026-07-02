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
]

const MENU_ICON_LINES = [
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
      const isBelowTablet = window.matchMedia('(max-width: 991px)').matches
      const isBelowMobile = window.matchMedia('(max-width: 479px)').matches
      NAV_ELEMENTS.forEach((selector) => {
        const isLinkOrToggle = selector === '.navbar_link' || selector === '.navbar_dropdown-toggle'
        const isLocale = selector === '.nav_locales-dropdown' || selector === '.locale_link'
        document.querySelectorAll(selector).forEach((el) => {
          if (isLinkOrToggle && isBelowTablet) { el.style.color = COLOR_LIGHT; return }
          if (isLocale && isBelowMobile) { el.style.color = COLOR_LIGHT; return }
          el.style.color = color
        })
      })
      MENU_ICON_LINES.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el) => {
          el.style.backgroundColor = color
        })
      })
      document.querySelectorAll('.menu-icon').forEach((el) => { el.style.borderColor = color })
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
