export function init() {
  if (window.matchMedia('(min-width: 768px)').matches) return

  const wrapper = document.querySelector('.cta-proof_mobile-wrapper')
  const content = document.querySelector('.cta-proof_mobile-content')

  if (!wrapper || !content) return

  function setup() {
    const overflow = content.offsetWidth - wrapper.offsetWidth
    if (overflow <= 0) return

    let scheduled = false

    function update() {
      if (scheduled) return
      scheduled = true
      requestAnimationFrame(() => {
        const rect = wrapper.getBoundingClientRect()
        const vh = window.innerHeight
        // start : wrapper.top = 25% du viewport
        // end   : 75% de la hauteur du wrapper scrollé depuis le start
        const scrollRange = wrapper.offsetHeight * 0.75
        const progress = Math.max(0, Math.min(1, (vh * 0.25 - rect.top) / scrollRange))
        content.style.transform = `translateX(${-overflow * progress}px)`
        scheduled = false
      })
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
  }

  if (document.readyState === 'complete') {
    setup()
  } else {
    window.addEventListener('load', setup, { once: true })
  }
}
