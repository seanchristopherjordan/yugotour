'use client'

import { useEffect } from 'react'

export function LazyFade() {
  useEffect(() => {
    function reveal(img: HTMLImageElement) {
      img.classList.add('lazy-revealed')
    }

    function watchLoad(img: HTMLImageElement) {
      if (img.complete && img.naturalWidth > 0) {
        reveal(img)
        return
      }
      img.addEventListener('load', () => reveal(img), { once: true })
      // Don't leave broken images permanently invisible
      img.addEventListener('error', () => reveal(img), { once: true })
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            watchLoad(entry.target as HTMLImageElement)
            io.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '120px' },
    )

    function init(img: HTMLImageElement) {
      // Synchronously reveal images already in or near the viewport to avoid a flash
      const rect = img.getBoundingClientRect()
      const nearViewport = rect.top < window.innerHeight + 120 && rect.bottom > -120
      if (nearViewport) {
        reveal(img)
      } else {
        io.observe(img)
      }
    }

    document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach(init)

    // Handle images added to the DOM after mount (modals, sliders, etc.)
    const mo = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLImageElement && node.getAttribute('loading') === 'lazy') {
            io.observe(node)
          } else if (node instanceof HTMLElement) {
            node
              .querySelectorAll<HTMLImageElement>('img[loading="lazy"]')
              .forEach((img) => io.observe(img))
          }
        })
      })
    })

    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])

  return null
}
