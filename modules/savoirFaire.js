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

  function jumpCards(steps) {
    const outCard = cardItems[activeCard]
    activeCard = (activeCard + steps + count) % count
    const inCard = cardItems[activeCard]
    gsap.set(inCard, { y: '100%' })
    gsap.to(outCard, { y: '-100%', duration: 0.45, ease: 'power2.inOut' })
    gsap.to(inCard, { y: 0, duration: 0.45, ease: 'power2.inOut' })
  }

  let goTo
  let jumpTo

  if (isMobile) {
    // ── MODE MOBILE : slider horizontal simple ──
    categoriesList.style.overflow = 'hidden'

    function getMobileItemW() {
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

    jumpTo = (steps) => {
      if (animating || steps <= 0) return
      animating = true
      const itemW = getMobileItemW()

      gsap.to(categoriesList, {
        x: -steps * itemW,
        duration: 0.45,
        ease: 'power2.inOut',
        onComplete: () => {
          for (let j = 0; j < steps; j++) {
            categoriesList.appendChild(catItems[0])
            catItems.push(catItems.shift())
          }
          gsap.set(categoriesList, { x: 0 })
          updateMobileOpacity()
          animating = false
        },
      })

      jumpCards(steps)
    }

    updateMobileOpacity()

    // Mobile portrait : scroll-driven
    if (
      count > 1 &&
      window.matchMedia('(orientation: portrait)').matches &&
      typeof ScrollTrigger !== 'undefined'
    ) {
      gsap.registerPlugin(ScrollTrigger)
      const section = categoriesList.closest('section')
      if (section) {
        let scrollIndex = 0  // position DOM réelle
        let targetIndex = 0  // position voulue par le scroll
        let polling = false

        function poll() {
          if (targetIndex !== scrollIndex && !animating) {
            const dir = targetIndex > scrollIndex ? 1 : -1
            scrollIndex += dir
            goTo(dir)
          }
          if (targetIndex !== scrollIndex) {
            requestAnimationFrame(poll)
          } else {
            polling = false
          }
        }

        ScrollTrigger.create({
          trigger: section,
          pin: true,
          start: 'top top',
          end: `+=${(count - 1) * 400}`,
          snap: {
            snapTo: 1 / (count - 1),
            duration: { min: 0.3, max: 0.6 },
            delay: 0.05,
          },
          onUpdate(self) {
            const newIndex = Math.round(self.progress * (count - 1))
            if (newIndex === targetIndex) return
            targetIndex = newIndex
            if (!polling) {
              polling = true
              requestAnimationFrame(poll)
            }
          },
        })
      }
    }

  } else {
    // ── MODE DESKTOP : catégories en scroll vertical ──
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
        if (catItems[VISIBLE]) gsap.set(catItems[VISIBLE], { opacity: 1 / VISIBLE })
        gsap.to(categoriesList, {
          y: -itemH,
          duration: 0.45,
          ease: 'power2.inOut',
          onComplete: () => {
            categoriesList.appendChild(catItems[0])
            catItems.push(catItems.shift())
            gsap.set(categoriesList, { y: 0 })
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

    jumpTo = (steps) => {
      if (animating || steps <= 0) return
      animating = true

      // Pré-setter les items qui vont entrer par le bas
      for (let j = VISIBLE; j < VISIBLE + steps && j < count; j++) {
        gsap.set(catItems[j], { opacity: 1 / VISIBLE })
      }

      gsap.to(categoriesList, {
        y: -steps * itemH,
        duration: 0.45,
        ease: 'power2.inOut',
        onComplete: () => {
          for (let j = 0; j < steps; j++) {
            categoriesList.appendChild(catItems[0])
            catItems.push(catItems.shift())
          }
          gsap.set(categoriesList, { y: 0 })
          // Snap les items qui viennent d'atterrir en bas
          for (let j = catItems.length - steps; j < catItems.length; j++) {
            gsap.set(catItems[j], { opacity: j < VISIBLE ? opacityForPos(j) : 0 })
          }
          updateCatStyles()
          animating = false
        },
      })

      jumpCards(steps)
    }

    updateCatStyles(false)
  }

  if (nextBtn) nextBtn.addEventListener('click', () => goTo(1))
  if (prevBtn) prevBtn.addEventListener('click', () => goTo(-1))

  catItems.forEach((item) => {
    item.addEventListener('click', () => {
      const i = catItems.indexOf(item)
      if (i <= 0) return
      jumpTo(i)
    })
  })
}
