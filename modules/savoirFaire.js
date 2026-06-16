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
  const isMobile = window.matchMedia('(max-width: 479px)').matches
  const VISIBLE = isMobile ? Math.min(count, 3) : Math.min(count, 5)
  let animating = false
  let activeCard = 0

  function opacityForPos(pos) {
    return (VISIBLE - pos) / VISIBLE
  }

  function updateCatStyles(animate = true) {
    catItems.forEach((item, i) => {
      const opacity = i < VISIBLE ? opacityForPos(i) : 0
      animate
        ? gsap.to(item, { opacity, duration: 0.3 })
        : gsap.set(item, { opacity })
    })
  }

  // Setup cards : superposition via grid (identique desktop et mobile)
  rightContent.style.display = 'grid'
  cardItems.forEach((card, i) => {
    card.style.gridArea = '1/1'
    gsap.set(card, { y: i === 0 ? 0 : '100%' })
  })

  let goTo

  if (isMobile) {
    // ── MODE MOBILE : catégories en scroll horizontal ──
    categoriesList.style.display = 'flex'
    categoriesList.style.flexDirection = 'row'
    categoriesList.style.overflow = 'hidden'

    const itemW = count > 1
      ? catItems[1].getBoundingClientRect().left - catItems[0].getBoundingClientRect().left
      : catItems[0].offsetWidth

    categoriesList.style.width = itemW * VISIBLE + 'px'

    goTo = (dir) => {
      if (animating) return
      animating = true

      if (dir === 1) {
        gsap.to(categoriesList, {
          x: -itemW,
          duration: 0.45,
          ease: 'power2.inOut',
          onComplete: () => {
            categoriesList.appendChild(catItems[0])
            catItems.push(catItems.shift())
            gsap.set(categoriesList, { x: 0 })
            updateCatStyles()
            animating = false
          },
        })
      } else {
        const last = catItems[catItems.length - 1]
        categoriesList.insertBefore(last, catItems[0])
        catItems.unshift(catItems.pop())
        gsap.set(categoriesList, { x: -itemW })
        updateCatStyles()
        gsap.to(categoriesList, {
          x: 0,
          duration: 0.45,
          ease: 'power2.inOut',
          onComplete: () => { animating = false },
        })
      }

      // Cards : scroll vertical inchangé
      const outCard = cardItems[activeCard]
      activeCard = (activeCard + dir + count) % count
      const inCard = cardItems[activeCard]

      gsap.set(inCard, { y: dir === 1 ? '100%' : '-100%' })
      gsap.to(outCard, { y: dir === 1 ? '-100%' : '100%', duration: 0.45, ease: 'power2.inOut' })
      gsap.to(inCard, { y: 0, duration: 0.45, ease: 'power2.inOut' })
    }

  } else {
    // ── MODE DESKTOP : catégories en scroll vertical ──
    const itemH = count > 1
      ? catItems[1].getBoundingClientRect().top - catItems[0].getBoundingClientRect().top
      : catItems[0].offsetHeight

    categoriesList.style.overflow = 'hidden'
    categoriesList.style.height = itemH * VISIBLE + 'px'

    goTo = (dir) => {
      if (animating) return
      animating = true

      if (dir === 1) {
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

      const outCard = cardItems[activeCard]
      activeCard = (activeCard + dir + count) % count
      const inCard = cardItems[activeCard]

      gsap.set(inCard, { y: dir === 1 ? '100%' : '-100%' })
      gsap.to(outCard, { y: dir === 1 ? '-100%' : '100%', duration: 0.45, ease: 'power2.inOut' })
      gsap.to(inCard, { y: 0, duration: 0.45, ease: 'power2.inOut' })
    }
  }

  if (nextBtn) nextBtn.addEventListener('click', () => goTo(1))
  if (prevBtn) prevBtn.addEventListener('click', () => goTo(-1))

  updateCatStyles(false)
}
