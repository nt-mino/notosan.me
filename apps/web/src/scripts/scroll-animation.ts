// Intersection Observer for scroll animations
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const target = entry.target as HTMLElement
        target.style.opacity = '1'
        target.style.transform = 'translateY(0)'
      }
    }
  },
  { threshold: 0.1 },
)

document.querySelectorAll('section:not([id=""])').forEach((el) => {
  const section = el as HTMLElement
  section.style.opacity = '0'
  section.style.transform = 'translateY(24px)'
  section.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
  observer.observe(el)
})
