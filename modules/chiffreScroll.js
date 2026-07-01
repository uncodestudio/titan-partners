export function init() {
  if (window.matchMedia('(min-width: 768px)').matches) return

  const section = document.querySelector('.section_chiffres')
  const list    = document.querySelector('.chiffres_right-list')
  const wrapper = document.querySelector('.chiffres_right-wrapper')

  if (!section || !list || !wrapper) return

  function setup() {
    const overflow = list.offsetWidth - wrapper.offsetWidth
    if (overflow <= 0) return

    const LERP = 0.08 // snap strength : 0 = très mou, 1 = direct
    let targetX = 0
    let currentX = 0
    let rafId = null
    let scheduled = false

    function tick() {
      currentX += (targetX - currentX) * LERP
      list.style.transform = `translateX(${currentX}px)`
      if (Math.abs(currentX - targetX) > 0.1) {
        rafId = requestAnimationFrame(tick)
      } else {
        list.style.transform = `translateX(${targetX}px)`
        rafId = null
      }
    }

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
        targetX = -overflow * progress
        if (!rafId) rafId = requestAnimationFrame(tick)
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
