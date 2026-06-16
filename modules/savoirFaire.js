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
  let animating = false
  let activeCard = 0

  // Setup cards : superposition via grid (identique desktop et mobile)
  rightContent.style.display = 'grid'
  cardItems.forEach((card, i) => {
    card.style.gridArea = '1/1'
    gsap.set(card, { y: i === 0 ? 0 : '100%' })
  })

  function slideCards(dir) {
    const outCard = cardItems[activeCard]
    activeCard = (activeCard + dir + count) % count
    const inCard = cardItems[activeCard]
    gsap.set(inCard, { y: dir === 1 ? '100%' : '-100%' })
    gsap.to(outCard, { y: dir === 1 ? '-100%' : '100%', duration: 0.45, ease: 'power2.inOut' })
    gsap.to(inCard, { y: 0, duration: 0.45, ease: 'power2.inOut' })
  }

  let goTo

  if (isMobile) {
    // ── MODE MOBILE : slider horizontal simple ──
    // Le layout flex-row et les gaps sont gérés par Webflow
    categoriesList.style.overflow = 'hidden'

    function getMobileItemW() {
      // Mesuré avant toute modif DOM, avec les positions réelles courantes
      return count > 1
        ? catItems[1].getBoundingClientRect().left - catItems[0].getBoundingClientRect().left
        : catItems[0].offsetWidth
    }

    function updateMobileOpacity() {
      catItems.forEach((item, i) => {
        gsap.set(item, { opacity: (count - i) / count })
      })
    }

    goTo = (dir) => {
      if (animating) return
      animating = true

      // Mesure dynamique avant toute modification du DOM
      const itemW = getMobileItemW()

      if (dir === 1) {
        gsap.to(categoriesList, {
          x: -itemW,
          duration: 0.45,
          ease: 'power2.inOut',
          onComplete: () => {
            categoriesList.appendChild(catItems[0])
            catItems.push(catItems.shift())
            gsap.set(categoriesList, { x: 0 })
            updateMobileOpacity()
            animating = false
          },
        })
      } else {
        const last = catItems[catItems.length - 1]
        categoriesList.insertBefore(last, catItems[0])
        catItems.unshift(catItems.pop())
        updateMobileOpacity()
        gsap.fromTo(categoriesList,
          { x: -itemW },
          {
            x: 0,
            duration: 0.45,
            ease: 'power2.inOut',
            onComplete: () => { animating = false },
          }
        )
      }

      slideCards(dir)
    }

    updateMobileOpacity()

  } else {
    // ── MODE DESKTOP : catégories en scroll vertical (comportement original) ──
    const VISIBLE = Math.min(count, 5)

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

    categoriesList.style.overflow = 'hidden'
    categoriesList.style.height = itemH * VISIBLE + 'px'

    goTo = (dir) => {
      if (animating) return
      animating = true

      if (dir === 1) {
        // Pré-setter l'opacité de l'item entrant par le bas avant le slide
        if (catItems[VISIBLE]) gsap.set(catItems[VISIBLE], { opacity: 1 / VISIBLE })
        gsap.to(categoriesList, {
          y: -itemH,
          duration: 0.45,
          ease: 'power2.inOut',
          onComplete: () => {
            categoriesList.appendChild(catItems[0])
            catItems.push(catItems.shift())
            gsap.set(categoriesList, { y: 0 })
            // Snap instantané de l'item qui vient d'atterrir en bas
            const lastIdx = catItems.length - 1
            gsap.set(catItems[lastIdx], { opacity: lastIdx < VISIBLE ? opacityForPos(lastIdx) : 0 })
            updateCatStyles()
            animating = false
          },
        })
      } else {
        const last = catItems[catItems.length - 1]
        categoriesList.insertBefore(last, catItems[0])
        catItems.unshift(catItems.pop())
        updateCatStyles(false)
        gsap.fromTo(categoriesList,
          { y: -itemH },
          {
            y: 0,
            duration: 0.45,
            ease: 'power2.inOut',
            onComplete: () => { animating = false },
          }
        )
      }

      slideCards(dir)
    }

    updateCatStyles(false)
  }

  if (nextBtn) nextBtn.addEventListener('click', () => goTo(1))
  if (prevBtn) prevBtn.addEventListener('click', () => goTo(-1))
}
