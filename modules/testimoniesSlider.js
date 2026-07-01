export function init() {
  if (typeof gsap === 'undefined') return

  window.Webflow = window.Webflow || []
  window.Webflow.push(() => {
    const origImages = [...document.querySelectorAll('.temoignages_images-item')]
      .filter((el) => el.offsetHeight > 0)
    const avis = [...document.querySelectorAll('.temoignages_avis-item')]
      .filter((el) => el.offsetHeight > 0)
    const infos = [...document.querySelectorAll('.infos_contact-item')]
      .filter((el) => el.offsetHeight > 0)
    const nextBtn = document.querySelector('.testimonies_arrow-next')
    const prevBtn = document.querySelector('.testimonies_arrow-prev')

    if (!origImages.length || !nextBtn || !prevBtn) return

    const count = Math.min(
      origImages.length,
      avis.length || origImages.length,
      infos.length || origImages.length
    )

    if (count < 2) return

    const mobileWrapper = document.querySelector('.temoignage_mobile-wrapper')
    const imageList = document.querySelector('.temoignages_image-list')
    const imageListOriginalParent = imageList?.parentElement
    const imgWrapper = origImages[0].parentElement

    let cleanup = null

    function setup() {
      if (cleanup) cleanup()

      const isMobile = window.matchMedia('(max-width: 767px)').matches && !!mobileWrapper && !!imageList
      cleanup = isMobile ? setupMobile() : setupDesktop()
    }

    function setupMobile() {
      if (mobileWrapper && imageList) mobileWrapper.appendChild(imageList)

      const imgs = origImages.slice(0, count)
      ;[imgs, avis.slice(0, count), infos.slice(0, count)].forEach((items) => {
        if (!items.length) return
        items[0].parentElement.style.display = 'grid'
        items.forEach((el) => {
          el.style.gridArea = '1/1'
          gsap.set(el, { opacity: 0 })
        })
        gsap.set(items[0], { opacity: 1 })
      })

      let current = 0
      let animating = false

      function goTo(nextIdx) {
        if (animating) return
        animating = true
        const prevIdx = current
        current = nextIdx
        const tl = gsap.timeline({ onComplete: () => { animating = false } })
        tl.to(imgs[prevIdx], { opacity: 0, duration: 0.3 }, 0)
        tl.to(imgs[nextIdx], { opacity: 1, duration: 0.4 }, 0.25)
        if (avis[prevIdx]) tl.to(avis[prevIdx], { opacity: 0, duration: 0.3 }, 0)
        if (avis[nextIdx]) tl.to(avis[nextIdx], { opacity: 1, duration: 0.4 }, 0.25)
        if (infos[prevIdx]) tl.to(infos[prevIdx], { opacity: 0, duration: 0.3 }, 0)
        if (infos[nextIdx]) tl.to(infos[nextIdx], { opacity: 1, duration: 0.4 }, 0.25)
      }

      const onNext = () => goTo((current + 1) % count)
      const onPrev = () => goTo((current - 1 + count) % count)
      nextBtn.addEventListener('click', onNext)
      prevBtn.addEventListener('click', onPrev)

      // Swipe mobile
      const swipeTarget = mobileWrapper || imgs[0].closest('section') || document.body
      let touchStartX = 0
      let touchStartY = 0
      const onTouchStart = (e) => {
        touchStartX = e.touches[0].clientX
        touchStartY = e.touches[0].clientY
      }
      const onTouchEnd = (e) => {
        const dx = touchStartX - e.changedTouches[0].clientX
        const dy = touchStartY - e.changedTouches[0].clientY
        if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return
        dx > 0 ? onNext() : onPrev()
      }
      swipeTarget.addEventListener('touchstart', onTouchStart, { passive: true })
      swipeTarget.addEventListener('touchend', onTouchEnd, { passive: true })

      return () => {
        nextBtn.removeEventListener('click', onNext)
        prevBtn.removeEventListener('click', onPrev)
        swipeTarget.removeEventListener('touchstart', onTouchStart)
        swipeTarget.removeEventListener('touchend', onTouchEnd)
        if (imageListOriginalParent && imageList) imageListOriginalParent.appendChild(imageList)
        ;[imgs, avis.slice(0, count), infos.slice(0, count)].forEach((items) => {
          if (!items.length) return
          items[0].parentElement.style.display = ''
          items.forEach((el) => {
            el.style.gridArea = ''
            gsap.killTweensOf(el)
            gsap.set(el, { clearProps: 'opacity' })
          })
        })
      }
    }

    function setupDesktop() {
      const wrapperH = imgWrapper.offsetHeight
      const imgH = origImages[0].offsetHeight
      const wrapperTop = imgWrapper.getBoundingClientRect().top
      const naturalTops = origImages.slice(0, count)
        .map((img) => img.getBoundingClientRect().top - wrapperTop)

      const measuredStep = naturalTops[1] - naturalTops[0]
      const step = measuredStep > 1 ? measuredStep : imgH || wrapperH || 100

      const beforeClones = origImages.slice(0, count).map((el) => el.cloneNode(true))
      const afterClones = origImages.slice(0, count).map((el) => el.cloneNode(true))

      gsap.set([...beforeClones, ...afterClones], { position: 'absolute', top: 0, left: 0, width: '100%' })
      for (let i = count - 1; i >= 0; i--) imgWrapper.prepend(beforeClones[i])
      afterClones.forEach((el) => imgWrapper.append(el))

      imgWrapper.style.position = 'relative'
      if (wrapperH) imgWrapper.style.height = wrapperH + 'px'

      const allItems = [...beforeClones, ...origImages.slice(0, count), ...afterClones]

      function setPositions(activeIdx) {
        allItems.forEach((el, i) => {
          const slot = i - count
          const naturalTop = i >= count && i < 2 * count ? naturalTops[i - count] : 0
          gsap.set(el, { y: (slot - activeIdx) * step - naturalTop })
        })
      }

      setPositions(0)

      ;[avis.slice(0, count), infos.slice(0, count)].forEach((items) => {
        if (!items.length) return
        items[0].parentElement.style.display = 'grid'
        items.forEach((el) => {
          el.style.gridArea = '1/1'
          gsap.set(el, { opacity: 0 })
        })
        gsap.set(items[0], { opacity: 1 })
      })

      let current = 0
      let animating = false

      function goTo(nextIdx, forward) {
        if (animating) return
        animating = true
        const prevIdx = current
        current = nextIdx

        const isForwardWrap = forward && nextIdx === 0 && prevIdx === count - 1
        const isBackwardWrap = !forward && nextIdx === count - 1 && prevIdx === 0
        const delta = isForwardWrap ? -step : isBackwardWrap ? step : -(nextIdx - prevIdx) * step

        const tl = gsap.timeline({
          onComplete: () => {
            if (isForwardWrap || isBackwardWrap) setPositions(nextIdx)
            animating = false
          },
        })

        tl.to(allItems, { y: `+=${delta}`, duration: 0.7, ease: 'power2.inOut' }, 0)
        if (avis[prevIdx]) tl.to(avis[prevIdx], { opacity: 0, duration: 0.3 }, 0)
        if (avis[nextIdx]) tl.to(avis[nextIdx], { opacity: 1, duration: 0.4 }, 0.25)
        if (infos[prevIdx]) tl.to(infos[prevIdx], { opacity: 0, duration: 0.3 }, 0)
        if (infos[nextIdx]) tl.to(infos[nextIdx], { opacity: 1, duration: 0.4 }, 0.25)
      }

      const onNext = () => goTo((current + 1) % count, true)
      const onPrev = () => goTo((current - 1 + count) % count, false)
      nextBtn.addEventListener('click', onNext)
      prevBtn.addEventListener('click', onPrev)

      return () => {
        nextBtn.removeEventListener('click', onNext)
        prevBtn.removeEventListener('click', onPrev)
        ;[...beforeClones, ...afterClones].forEach((el) => el.remove())
        imgWrapper.style.position = ''
        imgWrapper.style.height = ''
        origImages.slice(0, count).forEach((el) => {
          gsap.killTweensOf(el)
          gsap.set(el, { clearProps: 'y' })
        })
        ;[avis.slice(0, count), infos.slice(0, count)].forEach((items) => {
          if (!items.length) return
          items[0].parentElement.style.display = ''
          items.forEach((el) => {
            el.style.gridArea = ''
            gsap.killTweensOf(el)
            gsap.set(el, { clearProps: 'opacity' })
          })
        })
      }
    }

    setup()

    window.matchMedia('(max-width: 767px)').addEventListener('change', setup)
  })
}
