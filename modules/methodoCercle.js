export function init() {
  if (typeof gsap === 'undefined') return

  const STEP = 72

  const wheel = document.querySelector('.methodo-slider_wheel')
  const hours = [...document.querySelectorAll('.methodo-slider_number')]
  const wrapper = document.querySelector('.methodo-slider_swiper .swiper-wrapper')
  const prevBtn = document.querySelector('.methodo-slider_arrow.is-prev')
  const nextBtn = document.querySelector('.methodo-slider_arrow.is-next')

  if (!wheel || !hours.length || !wrapper) return

  const slides = [...wrapper.querySelectorAll('.swiper-slide')]
  if (!slides.length) return

  const count = slides.length
  let current = 0

  // Angles + rayon responsive basé sur la taille réelle de la roue
  function updateRadius() {
    const radius = Math.round(wheel.offsetWidth * 0.44)
    hours.forEach((h) => h.style.setProperty('--radius', `${radius}px`))
  }

  hours.forEach((h, i) => h.style.setProperty('--angle', `${i * STEP}deg`))
  updateRadius()

  window.addEventListener('resize', updateRadius)

  // Superposition des slides via grid
  wrapper.style.display = 'grid'
  slides.forEach((slide, i) => {
    slide.style.gridArea = '1/1'
    gsap.set(slide, { opacity: i === 0 ? 1 : 0 })
  })

  function goTo(index) {
    const next = ((index % count) + count) % count
    gsap.to(slides[current], { opacity: 0, duration: 0.5, ease: 'power2.inOut' })
    gsap.to(slides[next], { opacity: 1, duration: 0.5, ease: 'power2.inOut' })
    current = next

    wheel.style.transform = `rotate(${-current * STEP}deg)`
    hours.forEach((h, i) => h.classList.toggle('is-active', i === current))
  }

  hours.forEach((h, i) => h.addEventListener('click', () => goTo(i)))
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1))
  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1))
}
