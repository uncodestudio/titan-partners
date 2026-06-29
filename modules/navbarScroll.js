export function init() {
  if (typeof gsap === 'undefined') return

  const navbar = document.querySelector('.navbar_container')
  if (!navbar) return

  let lastY = window.scrollY
  let visible = true
  const THRESHOLD = 8 // px minimum pour déclencher

  window.addEventListener('scroll', () => {
    const currentY = window.scrollY
    const delta = currentY - lastY

    if (Math.abs(delta) < THRESHOLD) return

    // Toujours visible en haut de page
    if (currentY <= 0) {
      if (!visible) {
        visible = true
        gsap.to(navbar, { y: 0, duration: 0.35, ease: 'power2.out' })
      }
      lastY = currentY
      return
    }

    if (delta > 0 && visible) {
      // Scroll bas → masquer (hauteur réelle + 8px buffer pour box-shadow)
      visible = false
      gsap.to(navbar, { y: -(navbar.offsetHeight + 8), duration: 0.35, ease: 'power2.inOut' })
    } else if (delta < 0 && !visible) {
      // Scroll haut → afficher
      visible = true
      gsap.to(navbar, { y: 0, duration: 0.35, ease: 'power2.out' })
    }

    lastY = currentY
  }, { passive: true })
}
