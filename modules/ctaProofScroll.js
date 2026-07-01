export function init() {
  if (typeof gsap === 'undefined') return
  if (window.matchMedia('(min-width: 768px)').matches) return

  const unit = 100 / 3
  const SPEED = 20

  document.querySelectorAll('.cta-proof_mobile-wrapper').forEach(wrapper => {
    const content = wrapper.querySelector('.cta-proof_mobile-content')
    if (!content) return

    const original = content.innerHTML
    content.innerHTML = original + original + original

    wrapper.style.overflow = 'hidden'

    gsap.set(content, { force3D: true, xPercent: 0 })

    const tween = gsap.to(content, {
      xPercent: -unit,
      duration: SPEED,
      ease: 'none',
      repeat: -1,
      modifiers: {
        xPercent: gsap.utils.wrap(-unit, 0),
      },
    })

    const observer = new IntersectionObserver(entries => {
      entries[0].isIntersecting ? tween.play() : tween.pause()
    }, { threshold: 0 })
    observer.observe(wrapper)
  })
}
