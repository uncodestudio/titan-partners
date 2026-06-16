export function init() {
  if (typeof gsap === 'undefined') return
  if (typeof ScrollTrigger === 'undefined') return

  const section = document.querySelector('.section_client-horizontal')
  if (!section) return

  gsap.registerPlugin(ScrollTrigger)

  document.querySelectorAll('.scroll_marquee').forEach((marquee) => {
    const layout = marquee.querySelector('.scroll_marquee-layout')
    if (!layout) return

    const isRight = marquee.dataset.direction === 'right'
    const offset = 6

    gsap.fromTo(
      layout,
      { xPercent: isRight ? -offset : offset },
      {
        xPercent: isRight ? offset : -offset,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      }
    )
  })
}
