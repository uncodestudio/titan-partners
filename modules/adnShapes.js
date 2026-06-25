export function init() {
  if (typeof gsap === 'undefined') return
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const shape1 = document.querySelector('.layout-adn_shape1')
  const shape2 = document.querySelector('.layout-adn_shape2')
  const shape3 = document.querySelector('.layout-adn_shape3')

  if (!shape1 && !shape2 && !shape3) return

  const TURNS = 3
  const DURATION = TURNS * 5 // 5s par tour → 15s pour 3 tours

  const tweens = []

  if (shape1) tweens.push(gsap.to(shape1, {
    rotation: -(TURNS * 360), // droite → gauche (CCW)
    duration: DURATION,
    ease: 'none',
    repeat: -1,
    yoyo: true,
  }))

  if (shape2) tweens.push(gsap.to(shape2, {
    rotation: TURNS * 360, // gauche → droite (CW), sens opposé
    duration: DURATION,
    ease: 'none',
    repeat: -1,
    yoyo: true,
  }))

  if (shape3) tweens.push(gsap.to(shape3, {
    rotation: -(TURNS * 360), // même sens que shape1
    duration: DURATION,
    ease: 'none',
    repeat: -1,
    yoyo: true,
  }))

  // Pause quand la section est hors de l'écran
  const anchor = shape1 || shape2 || shape3
  const target = anchor.closest('section') || anchor

  const observer = new IntersectionObserver((entries) => {
    tweens.forEach(t => entries[0].isIntersecting ? t.play() : t.pause())
  }, { threshold: 0 })

  observer.observe(target)
}
