import { ready } from './utils.js'

export function init() {
  if (typeof gsap === 'undefined') return

  ready(() => {
    const section = document.querySelector('.section_expertise')
    if (!section) return

    const wrapper = section.querySelector('.expertise_circle-layout')
    if (!wrapper) return

    const c0 = wrapper.querySelector('.expertise_circle:not(.is-green):not(.is-orange)') // cream
    const c1 = wrapper.querySelector('.expertise_circle.is-green')                        // green
    const c2 = wrapper.querySelector('.expertise_circle.is-orange')                       // orange

    if (!c0 || !c1 || !c2) return

    const R = 44

    const pos = {
      top:         { x: 0,                                        y: -R },
      bottomLeft:  { x: -R * Math.sin(60 * Math.PI/180),         y:  R * Math.cos(60 * Math.PI/180) },
      bottomRight: { x:  R * Math.sin(60 * Math.PI/180),         y:  R * Math.cos(60 * Math.PI/180) },
    }

    // cream  (flexOffset=-76) → bas gauche
    // green  (flexOffset=0)   → haut
    // orange (flexOffset=+76) → bas droite
    const gp = {
      c0: { x: pos.bottomLeft.x  + 76, y: pos.bottomLeft.y  },
      c1: { x: pos.top.x,              y: pos.top.y         },
      c2: { x: pos.bottomRight.x - 76, y: pos.bottomRight.y },
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
      gsap.killTweensOf([c0, c1, c2, wrapper])
      gsap.set(wrapper, { rotation: 0, transformOrigin: '50% 50%' })

      const tl = gsap.timeline()

      tl.add(bounceIn(c0, gp.c0.x, gp.c0.y, 0),    0)
      tl.add(bounceIn(c1, gp.c1.x, gp.c1.y, 0.18), 0)
      tl.add(bounceIn(c2, gp.c2.x, gp.c2.y, 0.36), 0)

      tl.to({}, { duration: 0.4 })

      tl.to(wrapper, {
        rotation: 215,
        transformOrigin: '50% 50%',
        duration: 1.0,
        ease: 'power2.inOut'
      })

      tl.to({}, { duration: 0.2 })

      tl.to(wrapper, { rotation: 0, duration: 0.6, ease: 'power2.inOut' })
      tl.to([c0, c1, c2], { x: 0, y: 0, duration: 0.6, ease: 'power2.inOut' }, '<')
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          runAnimation()
        } else {
          gsap.killTweensOf([c0, c1, c2, wrapper])
          gsap.set(wrapper, { rotation: 0 })
          gsap.set([c0, c1, c2], { x: 0, y: 280, scale: 0, opacity: 0 })
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(section)
  })
}