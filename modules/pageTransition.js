const CURTAINS = [
  { color: '#E4E2D6', zIndex: 9991 }, // cream  — entre en premier
  { color: '#0E1E1B', zIndex: 9992 }, // green
  { color: '#F6735C', zIndex: 9993 }, // orange — entre en dernier, sort en premier
]

const DURATION = 0.45
const STAGGER  = 0.08

export function init() {
  if (typeof gsap === 'undefined') return
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

  // Création des 3 rideaux
  const els = CURTAINS.map(({ color, zIndex }) => {
    const el = document.createElement('div')
    el.style.cssText = `position:fixed;inset:0;z-index:${zIndex};background:${color};pointer-events:none;will-change:transform;`
    document.body.appendChild(el)
    return el
  })

  const fromInternal = sessionStorage.getItem('page-transition') === 'true'
  sessionStorage.removeItem('page-transition')

  if (fromInternal) {
    // Rideaux en position basse (couvrent la page) → remontent en ordre inverse
    gsap.set(els, { yPercent: 0 })
    document.documentElement.style.visibility = ''
    const reversed = [...els].reverse() // orange, green, cream
    reversed.forEach((el, i) => {
      gsap.to(el, { yPercent: -100, duration: DURATION, ease: 'power2.inOut', delay: 0.1 + i * STAGGER })
    })
  } else {
    // Visite externe — rideaux cachés au-dessus
    gsap.set(els, { yPercent: -100 })
  }

  // Intercept liens internes
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]')
    if (!link) return

    const href = link.getAttribute('href')
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return
    if (link.target === '_blank') return

    try {
      const url = new URL(link.href)
      if (url.hostname !== window.location.hostname) return
      if (url.pathname === window.location.pathname) return
    } catch {
      return
    }

    e.preventDefault()
    sessionStorage.setItem('page-transition', 'true')

    // Rideaux montent du bas vers le haut — cream, green, orange
    gsap.set(els, { yPercent: 100 })
    els.forEach((el, i) => {
      gsap.to(el, {
        yPercent: 0,
        duration: DURATION,
        ease: 'power2.inOut',
        delay: i * STAGGER,
        onComplete: i === els.length - 1 ? () => { window.location.href = link.href } : undefined,
      })
    })
  })
}
