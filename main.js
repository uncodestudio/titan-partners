import { init as initPreloader } from './modules/preloader.js'
import { init as initPageTransition } from './modules/pageTransition.js'
import { init as initNavbarTheme } from './modules/navbarTheme.js'
import { init as initLinkImageHover } from './modules/linkImageHover.js'
import { init as initMarquee } from './modules/marquee.js'
import { init as initExpertiseCircles } from './modules/expertiseCircles.js'
import { init as initMarqueeVertical } from './modules/marqueeVertical.js'
import { init as initTestimoniesSlider } from './modules/testimoniesSlider.js'
import { init as initBlogSlider } from './modules/blogSlider.js'
import { init as initScrollMarquee } from './modules/scrollMarquee.js'
import { init as initSavoirFaire } from './modules/savoirFaire.js'
import { init as initMethodoCercle } from './modules/methodoCercle.js'
import { init as initEuropeMap } from './modules/europeMap.js'
import { init as initFadeIn } from './modules/fadeIn.js'
import { init as initEquipeCircle } from './modules/equipeCircle.js'
import { init as initAdnShapes } from './modules/adnShapes.js'

// Toujours actifs (présents sur toutes les pages)
initPreloader()
initPageTransition()
initNavbarTheme()

// Initialisés seulement si les éléments existent sur la page
const moduleDetectors = {
  linkImageHover:   { selector: '[data-link-hover]',              initFn: initLinkImageHover },
  marquee:          { selector: '.marquee',                       initFn: initMarquee },
  marqueeVertical:  { selector: '.marquee-vertical',              initFn: initMarqueeVertical },
  expertiseCircles: { selector: '.section_expertise',             initFn: initExpertiseCircles },
  testimoniesSlider:{ selector: '.testimonies_arrow-next',        initFn: initTestimoniesSlider },
  blogSlider:       { selector: '.blog_slider',                   initFn: initBlogSlider },
  europeMap:        { selector: '[data-map="europe"]',            initFn: initEuropeMap },
  scrollMarquee:    { selector: '.section_client-horizontal',     initFn: initScrollMarquee },
  savoirFaire:      { selector: '.savoir-faire_categories-list',  initFn: initSavoirFaire },
  methodoCercle:    { selector: '.methodo-slider_swiper',         initFn: initMethodoCercle },
  fadeIn:           { selector: '[data-fade]',                   initFn: initFadeIn },
  equipeCircle:     { selector: '.circle_loader',               initFn: initEquipeCircle },
  adnShapes:        { selector: '.layout-adn_shape1',           initFn: initAdnShapes },
}

Object.entries(moduleDetectors).forEach(([name, { selector, initFn }]) => {
  if (!document.querySelector(selector)) return
  try {
    initFn()
  } catch (e) {
    console.error(`[${name}]`, e)
  }
})
