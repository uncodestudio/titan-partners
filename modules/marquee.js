export function init() {
  if (typeof gsap === 'undefined') return

  document.querySelectorAll('.marquee').forEach((marquee) => {
    const content = marquee.firstElementChild
    if (!content) return

    const original = content.innerHTML
    content.innerHTML = original + original + original

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const isRight = marquee.dataset.direction === 'right'
    const speed = +marquee.dataset.speed || 20
    const unit = 100 / 3

    gsap.set(content, { force3D: true, xPercent: isRight ? -unit : 0 })

    const tl = gsap.to(content, {
      xPercent: isRight ? 0 : -unit,
      duration: speed,
      ease: 'none',
      repeat: -1,
      modifiers: {
        xPercent: gsap.utils.wrap(isRight ? -unit : 0, isRight ? 0 : -unit),
      },
    })

    marquee.onmouseenter = () => tl.pause()
    marquee.onmouseleave = () => tl.play()
  })
}
