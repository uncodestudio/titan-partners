export function init() {
  if (typeof gsap === 'undefined') return

  const preloader = document.getElementById('preloader')
  if (!preloader) return

  const isInternal = document.referrer.includes(window.location.hostname)

  if (isInternal) {
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
      duration: 0.7,
      ease: 'power2.inOut',
      onComplete: () => { preloader.style.display = 'none' },
    })
  }

  if (video) {
    video.addEventListener('ended', hide, { once: true })
  }

  setTimeout(hide, 5000)
}
