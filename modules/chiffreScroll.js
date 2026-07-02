export function init() {
  if (typeof gsap === 'undefined') return
  if (window.matchMedia('(min-width: 768px)').matches) return

  const list    = document.querySelector('.chiffres_right-list')
  const wrapper = document.querySelector('.chiffres_right-wrapper')

  if (!list || !wrapper) return

  function setup() {
    const overflow = list.offsetWidth - wrapper.offsetWidth
    if (overflow <= 0) return

    const items = [...list.children]
    const N = items.length
    if (N < 2) return

    // Position 0 = flush gauche, N-1 = flush droite, milieu répartis
    const snapPositions = items.map((_, i) => -overflow * i / (N - 1))

    let currentIndex = 0
    let startX = 0
    let startTime = 0

    function goTo(index) {
      currentIndex = Math.max(0, Math.min(N - 1, index))
      gsap.to(list, { x: snapPositions[currentIndex], duration: 0.4, ease: 'power2.out' })
    }

    wrapper.addEventListener('touchstart', (e) => {
      gsap.killTweensOf(list)
      startX = e.touches[0].clientX
      startTime = Date.now()
    }, { passive: true })

    wrapper.addEventListener('touchmove', (e) => {
      const dx = e.touches[0].clientX - startX
      const x = Math.max(-overflow, Math.min(0, snapPositions[currentIndex] + dx))
      gsap.set(list, { x })
    }, { passive: true })

    wrapper.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - startX
      const dt = Date.now() - startTime || 1
      const velocity = dx / dt

      if (Math.abs(velocity) > 0.3 || Math.abs(dx) > wrapper.offsetWidth * 0.2) {
        goTo(dx < 0 ? currentIndex + 1 : currentIndex - 1)
      } else {
        goTo(currentIndex)
      }
    }, { passive: true })
  }

  if (document.readyState === 'complete') setup()
  else window.addEventListener('load', setup, { once: true })
}
