export function init() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return
  if (window.matchMedia('(min-width: 768px)').matches) return

  const section = document.querySelector('.section_chiffres')
  const list    = document.querySelector('.chiffres_right-list')
  const wrapper = document.querySelector('.chiffres_right-wrapper')

  if (!section || !list || !wrapper) return

  gsap.registerPlugin(ScrollTrigger)

  function setup() {
    const overflow = list.offsetWidth - wrapper.offsetWidth
    if (overflow <= 0) return

    gsap.fromTo(list,
      { x: 0 },
      {
        x: -overflow,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${overflow}`,
          pin: true,
          scrub: true,
        },
      }
    )
  }

  // Attendre que tout soit chargé pour des mesures correctes
  if (document.readyState === 'complete') {
    setup()
  } else {
    window.addEventListener('load', setup, { once: true })
  }
}
