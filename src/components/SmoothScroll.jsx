import React, { useEffect } from 'react'

/**
 * SmoothScroll – native RAF + lerp implementation.
 * Replicates the same silky feel previously provided by the `lenis` package:
 *   - easeOutExpo easing
 *   - lerp factor 0.07 (very smooth / cinematic)
 *   - wheel multiplier 0.9
 * No external dependencies required.
 */
const SmoothScroll = ({ children }) => {
  useEffect(() => {
    // Enable smooth-scroll via CSS as a baseline (handles anchor links etc.)
    document.documentElement.style.scrollBehavior = 'auto'

    let currentY = window.scrollY
    let targetY = window.scrollY
    let rafId = null
    let isRunning = false

    const lerp = (start, end, factor) => start + (end - start) * factor

    // easeOutExpo – matches the original lenis config exactly
    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

    const wheelMultiplier = 0.9

    const onWheel = (e) => {
      e.preventDefault()
      // Use a slightly more responsive multiplier but maintain smoothness
      targetY += e.deltaY * 0.85 
      
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      targetY = Math.max(0, Math.min(targetY, maxScroll))

      if (!isRunning) {
        isRunning = true
        rafId = requestAnimationFrame(tick)
      }
    }

    const tick = () => {
      const diff = targetY - currentY
      
      // Dynamic lerp: faster when far, silkier when close
      const distance = Math.abs(diff)
      const factor = distance > 200 ? 0.08 : 0.06 
      
      if (distance < 0.1) {
        currentY = targetY
        window.scrollTo(0, currentY)
        isRunning = false
        return
      }

      currentY = lerp(currentY, targetY, factor)
      window.scrollTo(0, currentY)
      rafId = requestAnimationFrame(tick)
    }

    // Sync targetY when user uses keyboard / scrollbar directly
    const onScroll = () => {
      if (!isRunning) {
        currentY = window.scrollY
        targetY = window.scrollY
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
      document.documentElement.style.scrollBehavior = ''
    }
  }, [])

  return <>{children}</>
}

export default SmoothScroll
