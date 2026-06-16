export function init() {
  if (typeof gsap === 'undefined') return

  const marquees = [...document.querySelectorAll('.marquee-vertical')]

  function setup(marquee) {
    const content = marquee.firstElementChild
    if (!content) return

    // Stocker le HTML original avant la première triplification
    if (!marquee.dataset.originalHtml) {
      marquee.dataset.originalHtml = content.innerHTML
    }

    gsap.killTweensOf(content)
    gsap.set(content, { clearProps: 'all' })
    marquee.style.overflow = ''
    content.innerHTML = marquee.dataset.originalHtml + marquee.dataset.originalHtml + marquee.dataset.originalHtml

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const isMobile = window.matchMedia('(max-width: 767px)').matches
    const isDown = marquee.dataset.direction === 'down'
    const speed = +marquee.dataset.speed || 20
    const unit = 100 / 3

    if (isMobile) {
      marquee.style.overflow = 'hidden'
      gsap.set(content, { display: 'flex', width: 'max-content', force3D: true, xPercent: isDown ? -unit : 0 })

      const tl = gsap.to(content, {
        xPercent: isDown ? 0 : -unit,
        duration: speed,
        ease: 'none',
        repeat: -1,
        modifiers: { xPercent: gsap.utils.wrap(isDown ? -unit : 0, isDown ? 0 : -unit) },
      })

      marquee.onmouseenter = () => tl.pause()
      marquee.onmouseleave = () => tl.play()
    } else {
      gsap.set(content, { force3D: true, yPercent: isDown ? -unit : 0 })

      const tl = gsap.to(content, {
        yPercent: isDown ? 0 : -unit,
        duration: speed,
        ease: 'none',
        repeat: -1,
        modifiers: { yPercent: gsap.utils.wrap(isDown ? -unit : 0, isDown ? 0 : -unit) },
      })

      marquee.onmouseenter = () => tl.pause()
      marquee.onmouseleave = () => tl.play()
    }
  }

  marquees.forEach(setup)

  window.matchMedia('(max-width: 767px)').addEventListener('change', () => {
    marquees.forEach(setup)
  })
}
