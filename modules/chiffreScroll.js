export function init() {
  if (window.matchMedia('(min-width: 768px)').matches) return

  const section = document.querySelector('.section_chiffres')
  const list    = document.querySelector('.chiffres_right-list')
  const wrapper = document.querySelector('.chiffres_right-wrapper')

  if (!section || !list || !wrapper) return

  function setup() {
    const overflow = list.offsetWidth - wrapper.offsetWidth
    if (overflow <= 0) return

    let scheduled = false

    function update() {
      if (scheduled) return
      scheduled = true
      requestAnimationFrame(() => {
        const rect = wrapper.getBoundingClientRect()
        const vh = window.innerHeight
        // start : bas écran touche le haut de wrapper (rect.top = vh)
        // end   : wrapper à 20% du haut de l'écran (rect.top = vh * 0.2)
        const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh * 0.8)))
        list.style.transform = `translateX(${-overflow * progress}px)`
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
