export function init() {
  if (typeof gsap === 'undefined') return

  const categoriesList = document.querySelector('.savoir-faire_categories-list')
  const rightContent = document.querySelector('.savoir-faire_right-content')
  const nextBtn = document.querySelector('.savoir_arrows-next')
  const prevBtn = document.querySelector('.savoir_arrows-prev')

  if (!categoriesList || !rightContent) return

  const catItems = [...categoriesList.querySelectorAll('.savoir-faire_category-item')]
  const cardItems = [...rightContent.querySelectorAll('.savoir-faire_card-item')]

  if (!catItems.length || !cardItems.length) return

  const count = catItems.length
  const VISIBLE = Math.min(count, 5)
  let animating = false
  let activeCard = 0

  // Hauteur réelle d'un item (offsetHeight + gap éventuel)
  const itemH = count > 1
    ? catItems[1].getBoundingClientRect().top - catItems[0].getBoundingClientRect().top
    : catItems[0].offsetHeight

  function opacityForPos(pos) {
    return (VISIBLE - pos) / VISIBLE
  }

  function updateCatStyles(animate = true) {
    catItems.forEach((item, i) => {
      item.style.borderBottom = i === 0 ? '0.4px solid #e4e2d6' : 'none'
      const opacity = i < VISIBLE ? opacityForPos(i) : 0
      animate
        ? gsap.to(item, { opacity, duration: 0.3 })
        : gsap.set(item, { opacity })
    })
  }

  // Setup catégories
  categoriesList.style.overflow = 'hidden'
  categoriesList.style.height = itemH * VISIBLE + 'px'

  // Setup cards : superposition via grid
  rightContent.style.display = 'grid'
  cardItems.forEach((card, i) => {
    card.style.gridArea = '1/1'
    gsap.set(card, { y: i === 0 ? 0 : '100%' })
  })

  function goTo(dir) {
    if (animating) return
    animating = true

    if (dir === 1) {
      // Next : slide liste vers le haut, reorder après
      gsap.to(categoriesList, {
        y: -itemH,
        duration: 0.45,
        ease: 'power2.inOut',
        onComplete: () => {
          categoriesList.appendChild(catItems[0])
          catItems.push(catItems.shift())
          gsap.set(categoriesList, { y: 0 })
          updateCatStyles()
          animating = false
        },
      })
    } else {
      // Prev : reorder d'abord, puis slide vers le bas
      const last = catItems[catItems.length - 1]
      categoriesList.insertBefore(last, catItems[0])
      catItems.unshift(catItems.pop())
      gsap.set(categoriesList, { y: -itemH })
      updateCatStyles()
      gsap.to(categoriesList, {
        y: 0,
        duration: 0.45,
        ease: 'power2.inOut',
        onComplete: () => { animating = false },
      })
    }

    // Cards : slide bas → haut (next) ou haut → bas (prev)
    const outCard = cardItems[activeCard]
    activeCard = (activeCard + dir + count) % count
    const inCard = cardItems[activeCard]

    gsap.set(inCard, { y: dir === 1 ? '100%' : '-100%' })
    gsap.to(outCard, { y: dir === 1 ? '-100%' : '100%', duration: 0.45, ease: 'power2.inOut' })
    gsap.to(inCard, { y: 0, duration: 0.45, ease: 'power2.inOut' })
  }

  if (nextBtn) nextBtn.addEventListener('click', () => goTo(1))
  if (prevBtn) prevBtn.addEventListener('click', () => goTo(-1))

  updateCatStyles(false)
}
