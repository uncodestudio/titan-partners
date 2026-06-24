import { ready } from './utils.js'

export function init() {
  if (typeof gsap === 'undefined') return

  ready(() => {
    const section = document.querySelector('.section_expertise')
    if (!section) return

    const wrapper = section.querySelector('.expertise_circle-layout')
    if (!wrapper) return

    const c0 = wrapper.querySelector('.expertise_circle:not(.is-green):not(.is-orange):not(.is-dark-green)') // cream
    const c1 = wrapper.querySelector('.expertise_circle.is-green')
    const c2 = wrapper.querySelector('.expertise_circle.is-orange')
    const c3 = wrapper.querySelector('.expertise_circle.is-dark-green')

    if (!c0 || !c1 || !c2 || !c3) return

    const R = 44

    // Positions cibles : losange
    const pos = {
      top:    { x:  0, y: -R },
      right:  { x:  R, y:  0 },
      bottom: { x:  0, y:  R },
      left:   { x: -R, y:  0 },
    }

    // Offset flex naturel de chaque cercle par rapport au centre du wrapper
    function flexOffset(el) {
      const wr = wrapper.getBoundingClientRect()
      const er = el.getBoundingClientRect()
      return (er.left + er.width / 2) - (wr.left + wr.width / 2)
    }

    const gp = {
      c0: { x: pos.left.x   - flexOffset(c0), y: pos.left.y   },
      c1: { x: pos.top.x    - flexOffset(c1), y: pos.top.y    },
      c2: { x: pos.right.x  - flexOffset(c2), y: pos.right.y  },
      c3: { x: pos.bottom.x - flexOffset(c3), y: pos.bottom.y },
    }

    function bounceIn(el, gx, gy, delay) {
      const peakY = gy - 80
      return gsap.timeline({ delay })
        .set(el, { x: gx, y: 280, scale: 0, opacity: 0 })
        .to(el,  { scale: 1, opacity: 1, duration: 0.15, ease: 'power2.out' })
        .to(el,  { y: peakY, duration: 0.35, ease: 'power2.out' })
        .to(el,  { y: gy, duration: 0.45, ease: 'bounce.out' })
    }

    function runAnimation() {
      gsap.killTweensOf([c0, c1, c2, c3, wrapper])
      gsap.set(wrapper, { rotation: 0, transformOrigin: '50% 50%' })

      const tl = gsap.timeline()

      tl.add(bounceIn(c0, gp.c0.x, gp.c0.y, 0),    0)
      tl.add(bounceIn(c1, gp.c1.x, gp.c1.y, 0.18), 0)
      tl.add(bounceIn(c2, gp.c2.x, gp.c2.y, 0.36), 0)
      tl.add(bounceIn(c3, gp.c3.x, gp.c3.y, 0.54), 0)

      tl.to({}, { duration: 0.4 })

      tl.to(wrapper, {
        rotation: 215,
        transformOrigin: '50% 50%',
        duration: 1.0,
        ease: 'power2.inOut',
      })

      tl.to({}, { duration: 0.2 })

      tl.to(wrapper, { rotation: 0, duration: 0.6, ease: 'power2.inOut' })
      tl.to([c0, c1, c2, c3], { x: 0, y: 0, duration: 0.6, ease: 'power2.inOut' }, '<')
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          runAnimation()
        } else {
          gsap.killTweensOf([c0, c1, c2, c3, wrapper])
          gsap.set(wrapper, { rotation: 0 })
          gsap.set([c0, c1, c2, c3], { x: 0, y: 280, scale: 0, opacity: 0 })
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(section)
  })
}
