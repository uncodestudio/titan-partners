export function init() {
  if (typeof gsap === 'undefined') return

  const preloader = document.getElementById('preloader')
  if (!preloader) return

  const isMobile = matchMedia('(max-width: 767px)').matches
  const navType = performance.getEntriesByType('navigation')[0]?.type
  const isReload = navType === 'reload'
  const isInternal = document.referrer.includes(window.location.hostname)

  if (isMobile || isReload || isInternal) {
    preloader.style.display = 'none'
    return
  }

  preloader.style.display = 'flex'
  document.body.style.overflow = 'hidden'

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

  const video = preloader.querySelector('video')
  if (video) video.removeAttribute('loop')

  let hidden = false
  function hide() {
    if (hidden) return
    hidden = true
    document.body.style.overflow = ''
    if (reducedMotion) {
      preloader.style.display = 'none'
      return
    }
    gsap.to(preloader, {
      yPercent: -100,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => { preloader.style.display = 'none' },
    })
  }

  if (video) {
    video.addEventListener('ended', hide, { once: true })
  }

  setTimeout(hide, 4500)
}
