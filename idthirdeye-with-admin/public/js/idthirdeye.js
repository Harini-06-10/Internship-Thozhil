document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('siteHeader')
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 12)
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })

  const revealTargets = document.querySelectorAll(
    '.service-card, .work-card, .value-item, .approach-steps li, .training-card'
  )
  revealTargets.forEach((el) => {
    el.style.opacity = '0'
    el.style.transform = 'translateY(16px)'
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
  })

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) {
    revealTargets.forEach((el) => { el.style.opacity = '1'; el.style.transform = 'none' })
  } else if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1'
          entry.target.style.transform = 'translateY(0)'
          io.unobserve(entry.target)
        }
      })
    }, { threshold: 0.15 })
    revealTargets.forEach((el) => io.observe(el))
  }

  const form = document.getElementById('contactForm')
  const status = document.getElementById('formStatus')
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      status.style.color = '#3FD0C9'
      status.textContent = 'Sending…'
      setTimeout(() => {
        status.textContent = "Thanks — we'll be in touch within one business day."
      }, 700)
    })
  }

  const overlay = document.getElementById('scanOverlay')
  if (overlay) setTimeout(() => { overlay.style.display = 'none' }, 1500)
})
