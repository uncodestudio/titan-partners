export function init() {
  if (typeof gsap === 'undefined') return
  if (window.matchMedia('(min-width: 768px)').matches) return

  const wrapper = document.querySelector('.cta-proof_mobile-wrapper')
  const content = document.querySelector('.cta-proof_mobile-content')

  if (!wrapper || !content) return

  // Triple le contenu pour la boucle seamless (même technique que marquee.js)
  const original = content.innerHTML
  content.innerHTML = original + original + original

  wrapper.style.overflow = 'hidden'

  const unit = 100 / 3
  const SPEED = 20 // secondes pour 1 cycle (ajustable)

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
}
