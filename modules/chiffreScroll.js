export function init() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return
  if (window.matchMedia('(min-width: 768px)').matches) return

  const section = document.querySelector('.section_chiffre')
  const list    = document.querySelector('.chiffre_right-list')
  const wrapper = document.querySelector('.chiffre_right-wrapper')

  if (!section || !list || !wrapper) return

  gsap.registerPlugin(ScrollTrigger)

  // Déplacement nécessaire : bord droit de list → bord droit de wrapper
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
