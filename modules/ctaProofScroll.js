export function init() {
  if (typeof gsap === 'undefined') return
  if (window.matchMedia('(min-width: 768px)').matches) return

  const wrapper = document.querySelector('.cta-proof_mobile-wrapper')
  const content = document.querySelector('.cta-proof_mobile-content')

  if (!wrapper || !content) return

  function setup() {
    const clone = content.cloneNode(true)
    const contentW = content.offsetWidth

    // Track flex pour mettre original + clone côte à côte
    const track = document.createElement('div')
    track.style.cssText = 'display:flex;flex-wrap:nowrap;will-change:transform;'
    wrapper.insertBefore(track, content)
    track.appendChild(content)
    track.appendChild(clone)

    wrapper.style.overflow = 'hidden'

    const SPEED = 60 // px/s
    const duration = contentW / SPEED

    // On anime le track de 0 à -contentW, le repeat repart à 0 = seamless
    const tween = gsap.to(track, {
      x: -contentW,
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
