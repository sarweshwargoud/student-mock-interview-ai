'use client'
import { useEffect, useRef } from 'react'

/**
 * Attach this ref to any element you want revealed on scroll.
 * Options mirror IntersectionObserver options plus:
 *   - threshold (default 0.15)
 *   - rootMargin  (default '-40px')
 */
export function useScrollReveal(options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('scroll-revealed')
          observer.unobserve(el) // fire only once
        }
      },
      {
        threshold: options.threshold ?? 0.15,
        rootMargin: options.rootMargin ?? '-40px',
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}
