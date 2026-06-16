export function init() {
  if (typeof gsap === 'undefined') return

  const loader   = document.querySelector('.circle_loader')
  const numberEl = document.querySelector('.equipe_number')
  if (!loader && !numberEl) return

  const target = numberEl ? (parseInt(numberEl.textContent) || 95) : 95

  if (numberEl) numberEl.textContent = '0'

  const obj = { progress: 0 }

  const tl = gsap.timeline({ paused: true })
  tl.to(obj, {
    progress: target,
    duration: 1.5,
    ease: 'power2.out',
    onUpdate() {
      const val = Math.round(obj.progress)
      if (loader)   loader.style.background = `conic-gradient(from 18deg, white ${obj.progress}%, transparent 0%)`
      if (numberEl) numberEl.textContent = val
    }
  })

  const anchor = loader || numberEl
  const observer = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return
    tl.play()
    observer.disconnect()
  }, { threshold: 0.3 })

  observer.observe(anchor)
}
