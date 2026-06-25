import { ready } from './utils.js'

export function init() {
  if (typeof gsap === 'undefined') return

  ready(() => {
    const section = document.querySelector('.section_expertise')
    if (!section) return

    const wrapper = section.querySelector('.expertise_circle-layout')
    if (!wrapper) return

    const c0 = wrapper.querySelector('.expertise_circle:not(.is-green):not(.is-orange):not(.is-dark-green)')
    const c1 = wrapper.querySelector('.expertise_circle.is-green')
    const c2 = wrapper.querySelector('.expertise_circle.is-orange')
    const c3 = wrapper.querySelector('.expertise_circle.is-dark-green')

    const circles = [c0, c1, c2, c3].filter(Boolean)
    if (!circles.length) return

    // Distance de chaque cercle par rapport au centre du wrapper (position flex naturelle)
    function flexOffset(el) {
      const wr = wrapper.getBoundingClientRect()
      const er = el.getBoundingClientRect()
      return (er.left + er.width / 2) - (wr.left + wr.width / 2)
    }

    // x à appliquer pour ramener chaque cercle au centre (superposition)
    const overlapX = circles.map(el => -flexOffset(el))

    // Timeline : étalés → superposés → étalés, en boucle
    const tl = gsap.timeline({ repeat: -1, yoyo: true, paused: true })
    circles.forEach((el, i) => {
      tl.to(el, { x: overlapX[i], duration: 1, ease: 'power2.inOut' }, 0)
    })

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) tl.play()
      else tl.pause()
    }, { threshold: 0.2 })

    observer.observe(section)
  })
}
