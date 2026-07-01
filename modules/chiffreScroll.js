export function init() {
  if (typeof gsap === 'undefined') return
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
        const rect = section.getBoundingClientRect()
        const vh = window.innerHeight
        const scrollRange = rect.height - vh
        const progress = scrollRange > 0
          ? Math.max(0, Math.min(1, -rect.top / scrollRange))
          : 1
        gsap.to(list, {
          x: -overflow * progress,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: true,
        })
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
