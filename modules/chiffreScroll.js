export function init() {
  if (typeof gsap === 'undefined') return
  if (window.matchMedia('(min-width: 768px)').matches) return

  const list    = document.querySelector('.chiffres_right-list')
  const wrapper = document.querySelector('.chiffres_right-wrapper')

  if (!list || !wrapper) return

  function setup() {
    const overflow = list.offsetWidth - wrapper.offsetWidth
    if (overflow <= 0) return

    let currentX = 0
    let startX = 0
    let startGsapX = 0
    let lastX = 0
    let lastTime = 0
    let velocity = 0

    wrapper.addEventListener('touchstart', (e) => {
      gsap.killTweensOf(list)
      startX = e.touches[0].clientX
      lastX = startX
      lastTime = Date.now()
      startGsapX = gsap.getProperty(list, 'x') || 0
      currentX = startGsapX
    }, { passive: true })

    wrapper.addEventListener('touchmove', (e) => {
      const now = Date.now()
      const dt = now - lastTime || 1
      velocity = (e.touches[0].clientX - lastX) / dt
      lastX = e.touches[0].clientX
      lastTime = now
      currentX = Math.max(-overflow, Math.min(0, startGsapX + (e.touches[0].clientX - startX)))
      gsap.set(list, { x: currentX })
    }, { passive: true })

    wrapper.addEventListener('touchend', () => {
      const target = Math.max(-overflow, Math.min(0, currentX + velocity * 200))
      gsap.to(list, {
        x: target,
        duration: 0.5,
        ease: 'power2.out',
        onUpdate: () => { currentX = gsap.getProperty(list, 'x') },
      })
    }, { passive: true })
  }

  if (document.readyState === 'complete') setup()
  else window.addEventListener('load', setup, { once: true })
}
