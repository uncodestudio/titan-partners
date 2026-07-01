export function init() {
  if (typeof gsap === 'undefined') return
  if (window.matchMedia('(min-width: 768px)').matches) return

  const wrapper = document.querySelector('.cta-proof_mobile-wrapper')
  const content = document.querySelector('.cta-proof_mobile-content')

  if (!wrapper || !content) return

  function setup() {
    // Clone pour boucle seamless
    const clone = content.cloneNode(true)
    wrapper.appendChild(clone)

    wrapper.style.overflow = 'hidden'
    content.style.flexShrink = '0'
    clone.style.flexShrink = '0'

    const SPEED = 60 // px/s
    const duration = content.offsetWidth / SPEED

    // xPercent -100 sur chaque élément = boucle seamless
    const tween = gsap.to([content, clone], {
      xPercent: -100,
      duration,
      ease: 'none',
      repeat: -1,
    })

    // Pause quand hors écran
    const observer = new IntersectionObserver(entries => {
      entries[0].isIntersecting ? tween.play() : tween.pause()
    }, { threshold: 0 })
    observer.observe(wrapper)
  }

  if (document.readyState === 'complete') {
    setup()
  } else {
    window.addEventListener('load', setup, { once: true })
  }
}
