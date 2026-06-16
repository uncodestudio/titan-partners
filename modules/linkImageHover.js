export function init() {
  if (typeof gsap === 'undefined') return
  window.Webflow = window.Webflow || []
  window.Webflow.push(() => {
    const links = [...document.querySelectorAll('[data-link-hover]')]
    const images = [...document.querySelectorAll('.navbar_dropdown_image')]

    if (!links.length || !images.length) return

    function setActive(index) {
      images.forEach((img, i) => {
        gsap.to(img, {
          opacity: i === index ? 1 : 0,
          duration: 0.4,
          ease: 'power2.inOut',
        })
        img.classList.toggle('is-active', i === index)
      })
    }

    links.forEach((link, i) => {
      link.addEventListener('mouseenter', () => setActive(i))
    })
  })
}
