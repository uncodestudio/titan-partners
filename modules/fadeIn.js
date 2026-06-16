export function init() {
  if (typeof gsap === 'undefined') return

  const elements = document.querySelectorAll('[data-fade]')
  if (!elements.length) return

  gsap.set(elements, { opacity: 0, y: 40 })

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      gsap.to(entry.target, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
      observer.unobserve(entry.target)
    })
  }, { threshold: 0.15 })

  elements.forEach(el => observer.observe(el))
}
