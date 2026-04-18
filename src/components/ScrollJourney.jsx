import React, { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from 'framer-motion'

/**
 * ScrollJourney
 * ──────────────────────────────────────────────────────────
 * Phase 1 (scroll 0 → 0.35):  3-D lens zooms toward the camera.
 *                               Aperture iris opens as the lens
 *                               fills the screen.
 * Phase 2 (scroll 0.35 → 1.0): Content layers emerge one-by-one
 *                               from the lens opening, as though
 *                               shooting through the glass.
 */

/* ── Content that bursts through the lens ──────── */
const CONTENT_LAYERS = [
  { id: 'midcopy',    focalAt: 0.52, component: MidCopy    },
  { id: 'filmstrip',  focalAt: 0.65, component: FilmStrip  },
  { id: 'photoframe', focalAt: 0.78, component: FloatingFrame },
  { id: 'titlecard',  focalAt: 0.90, component: TitleCard  },
]

/* ── Map [0→1] progress to per-layer transform ───── */
function useContentLayer(scrollProgress, focalAt) {
  const HALF_WIN = 0.11

  const opacity = useTransform(scrollProgress, (v) => {
    const dist = Math.abs(v - focalAt)
    return Math.max(0, 1 - dist * 8.5)
  })

  const scale = useTransform(scrollProgress, (v) => {
    if (v < focalAt - HALF_WIN) return 0.1   // tiny, inside the lens
    if (v > focalAt + HALF_WIN) return 1.45  // blown past
    const t = (v - (focalAt - HALF_WIN)) / (HALF_WIN * 2)
    return 0.1 + t * (1 - 0.1)
  })

  const z = useTransform(scrollProgress, (v) => {
    if (v < focalAt - HALF_WIN) return 900
    if (v > focalAt + HALF_WIN) return -450
    const t = (v - (focalAt - HALF_WIN)) / (HALF_WIN * 2)
    return 900 - t * 1350
  })

  return { opacity, scale, z }
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════ */
const ScrollJourney = () => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  /*
   * Phase 1 (0 → 0.42): Lens zooms in from small → fills screen
   *   • Iris opens during 0.14 → 0.42
   * Phase 2 (0.42 → 1.0): Content bursts through the open aperture
   */
  const lensScale   = useTransform(scrollYProgress, [0, 0.42], [0.45, 5.2])
  const lensOpacity = useTransform(scrollYProgress, [0, 0.05, 0.36, 0.46], [0, 1, 1, 0])

  /* Iris opens as the lens zooms in — 0 = fully closed, 1 = wide open */
  const irisProgress = useTransform(scrollYProgress, [0.12, 0.42], [0, 1])

  /* End section teaser — shows after last content card (0.90) fades */
  const endOpacity = useTransform(scrollYProgress, [0.94, 0.99], [0, 1])
  const endY       = useTransform(scrollYProgress, [0.94, 0.99], [60, 0])

  return (
    <section
      id="journey"
      ref={containerRef}
      style={{ height: '380vh', position: 'relative' }}
      aria-label="Cinematic scroll journey"
    >
      {/* ── Sticky stage ──────────────────── */}
      <div className="journey-stage flex items-center justify-center bg-[#0a0a0a]">

        {/* Dark vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              'radial-gradient(ellipse 75% 75% at 50% 50%, transparent 35%, rgba(0,0,0,0.55) 100%)',
          }}
        />

        {/* Film-grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-[0.04]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'300\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'300\' height=\'300\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          }}
        />

        {/* ── LENS (phase 1) ─────────────────────── */}
        <motion.div
          style={{
            scale: lensScale,
            opacity: lensOpacity,
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            margin: 'auto',
            width: 420,
            height: 420,
            willChange: 'transform, opacity',
            zIndex: 20,
          }}
        >
          <LensElement size={420} irisProgress={irisProgress} />
        </motion.div>

        {/* ── CONTENT (phase 2) ─────────────────── */}
        {CONTENT_LAYERS.map((layer) => (
          <ContentLayer
            key={layer.id}
            focalAt={layer.focalAt}
            scrollProgress={scrollYProgress}
          >
            <layer.component />
          </ContentLayer>
        ))}

        {/* ── End-section teaser ───────────── */}
        <motion.div
          style={{ opacity: endOpacity, y: endY }}
          className="absolute bottom-12 z-30 text-center pointer-events-none"
        >
          <p className="text-white/40 text-xs tracking-[0.3em] uppercase font-poppins">
            Scroll to connect with us ↓
          </p>
        </motion.div>

        {/* Scroll progress pip */}
        <ScrollProgressPip progress={scrollYProgress} />
      </div>
    </section>
  )
}

/* ── Content layer — pops out of the lens iris ── */
const ContentLayer = ({ focalAt, scrollProgress, children }) => {
  const { opacity, scale, z } = useContentLayer(scrollProgress, focalAt)

  return (
    <motion.div
      style={{
        opacity,
        scale,
        z,
        position: 'absolute',
        left: '50%',
        top: '50%',
        x: '-50%',
        y: '-50%',
        willChange: 'transform, opacity',
        zIndex: 25,
      }}
    >
      {children}
    </motion.div>
  )
}

/* ── Scroll progress side pip ─────────────────── */
const ScrollProgressPip = ({ progress }) => {
  const height = useTransform(progress, [0, 1], ['0%', '100%'])
  return (
    <div className="absolute right-6 top-8 bottom-8 w-0.5 bg-white/10 rounded-full z-30">
      <motion.div
        style={{ height }}
        className="w-full bg-amber-400 rounded-full origin-top"
      />
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-400" />
    </div>
  )
}

/* ════════════════════════════════════════════
   LENS ELEMENT — 3-D barrel + scroll-driven iris
   ════════════════════════════════════════════ */
function LensElement({ size = 420, irisProgress }) {
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)

  const rotateX = useTransform(useSpring(y, { stiffness: 80, damping: 25 }), [0, 1], [28, -28])
  const rotateY = useTransform(useSpring(x, { stiffness: 80, damping: 25 }), [0, 1], [-28, 28])

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width)
    y.set((e.clientY - rect.top) / rect.height)
  }
  const handleMouseLeave = () => { x.set(0.5); y.set(0.5) }

  const RINGS = 14

  return (
    <div
      style={{ width: size, height: size, perspective: 1800 }}
      className="relative flex items-center justify-center pointer-events-auto group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative flex items-center justify-center cursor-crosshair"
      >
        {/* Barrel rings */}
        {Array.from({ length: RINGS }).map((_, i) => {
          const z   = i * -28
          const isFront = i === 0
          return (
            <div
              key={`barrel-${i}`}
              className="absolute inset-0 rounded-full"
              style={{
                background: isFront ? '#090909' : 'transparent',
                border: isFront ? '18px solid #141414' : '4px solid #1c1c1c',
                boxShadow: isFront ? 'inset 0 0 60px rgba(0,0,0,1)' : 'none',
                transform: `translateZ(${z}px)`,
                transformStyle: 'preserve-3d',
              }}
            >
              {!isFront && i < RINGS - 1 && (
                <div className="absolute inset-0 rounded-full border-[10px] border-[#090909] opacity-80" />
              )}
            </div>
          )
        })}

        {/* Front glass */}
        <div
          className="absolute rounded-full overflow-hidden shadow-[0_0_100px_rgba(245,158,11,0.20)]"
          style={{
            inset: 15,
            background: 'radial-gradient(ellipse at 28% 28%, rgba(245,158,11,0.18) 0%, rgba(0,0,0,0.85) 70%)',
            border: '2px solid rgba(255,255,255,0.05)',
            transform: 'translateZ(-8px)',
          }}
        >
          {/* Glass reflections */}
          <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-gradient-to-br from-white/10 via-transparent to-transparent rotate-[35deg] mix-blend-screen opacity-50 transition-transform duration-700 group-hover:rotate-[65deg]" />
          <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[30px]" />
          <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[50%] bg-amber-500/10 rounded-full blur-[40px]" />

          {/* ── Scroll-driven iris aperture overlay ── */}
          <IrisOverlay progress={irisProgress} />
        </div>

        {/* Deep inner glass */}
        <div
          className="absolute inset-[30%] rounded-full border border-white/5 bg-gradient-to-tr from-transparent to-white/5"
          style={{ transform: 'translateZ(-140px)', boxShadow: '0 0 50px rgba(0,0,0,0.9)' }}
        />
        <div
          className="absolute inset-[40%] rounded-full bg-black/90"
          style={{ transform: 'translateZ(-200px)' }}
        />
      </motion.div>

      {/* Ambient glow */}
      <div className="absolute inset-[-60px] rounded-full bg-amber-500/10 blur-[110px] -z-10 pointer-events-none" />
    </div>
  )
}

/* ── Iris aperture overlay — 8 blades animate open ── */
function IrisOverlay({ progress }) {
  const BLADES = 8

  /* skewX goes from ~38° (closed) to 0° (wide open) */
  const skewX = useTransform(progress, [0, 1], [38, 0])

  /* The central pupil shrinks to reveal the "through the glass" glow */
  const pupilScale    = useTransform(progress, [0, 1], [1, 0])
  const pupilOpacity  = useTransform(progress, [0, 0.6, 1], [1, 0.5, 0])

  /* An amber burst emenates as the iris opens */
  const burstOpacity = useTransform(progress, [0, 0.4, 0.85, 1], [0, 0, 0.6, 0])
  const burstScale   = useTransform(progress, [0, 0.85, 1], [0.4, 1, 1.6])

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ borderRadius: '50%', overflow: 'hidden' }}>
      {/* Blades */}
      {Array.from({ length: BLADES }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: '120%',
            height: '100%',
            background: 'linear-gradient(to right, rgba(8,8,8,0.97), rgba(18,18,18,0.97))',
            borderLeft: '1px solid rgba(245,158,11,0.35)',
            transformOrigin: '0% 100%',
            left: '50%',
            top: '-50%',
            rotate: i * (360 / BLADES),
            skewX,
          }}
        />
      ))}

      {/* Central pupil (dark disc that shrinks away) */}
      <motion.div
        className="absolute inset-0 m-auto rounded-full bg-black"
        style={{
          width: '55%',
          height: '55%',
          left: '22.5%',
          top: '22.5%',
          scale: pupilScale,
          opacity: pupilOpacity,
        }}
      />

      {/* Amber light burst as iris opens */}
      <motion.div
        className="absolute inset-0 m-auto rounded-full"
        style={{
          width: '60%',
          height: '60%',
          left: '20%',
          top: '20%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.55) 0%, rgba(245,158,11,0.1) 50%, transparent 70%)',
          scale: burstScale,
          opacity: burstOpacity,
          filter: 'blur(8px)',
        }}
      />
    </div>
  )
}

/* ════════════════════════════════════════════
   LAYER CONTENT COMPONENTS
   ════════════════════════════════════════════ */

/* ── Mid Copy ─────────────────────────────── */
function MidCopy() {
  return (
    <div className="text-center px-4" style={{ width: 600 }}>
      <p className="text-amber-400/70 text-sm tracking-[0.35em] uppercase mb-3 font-poppins">
        Through the lens
      </p>
      <h2 className="font-playfair text-5xl md:text-7xl font-bold text-white/80 leading-tight drop-shadow-2xl">
        Every Frame<br />
        <span className="text-amber-400">Tells a Story</span>
      </h2>
    </div>
  )
}

/* ── Film Strip ──────────────────────────── */
function FilmStrip() {
  const frames = [
    '/p1.png',
    '/p2.png',
    '/p3.png',
    '/p4.png',
  ]
  return (
    <div
      className="relative flex gap-1 rounded-md overflow-hidden"
      style={{
        background: '#111',
        padding: '10px 8px',
        border: '2px solid #333',
        boxShadow: '0 0 40px rgba(0,0,0,0.8)',
      }}
    >
      {/* Top perforations */}
      <div className="absolute top-1.5 left-0 right-0 flex justify-around items-center px-2">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="w-2 h-1.5 bg-gray-700 rounded-sm" />
        ))}
      </div>
      {/* Bottom perforations */}
      <div className="absolute bottom-1.5 left-0 right-0 flex justify-around items-center px-2">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="w-2 h-1.5 bg-gray-700 rounded-sm" />
        ))}
      </div>
      {/* Photo frames */}
      {frames.map((src, i) => (
        <div
          key={i}
          style={{ width: 90, height: 68, flexShrink: 0 }}
          className="overflow-hidden rounded-sm ring-1 ring-white/10"
        >
          <img
            src={src}
            alt={`frame ${i}`}
            className="w-full h-full object-cover"
            style={{ filter: i === 2 ? 'none' : 'brightness(0.7) saturate(0.8)' }}
          />
        </div>
      ))}
      {/* Frame numbers */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-around px-2">
        {frames.map((_, i) => (
          <span key={i} className="text-[8px] text-amber-500/40 font-mono tabular-nums">
            {(i + 1).toString().padStart(2, '0')}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── Floating Photo Frame ────────────────── */
function FloatingFrame() {
  return (
    <div className="relative" style={{ width: 300 }}>
      {/* Back polaroid */}
      <div
        className="absolute bg-white rounded-sm shadow-2xl"
        style={{ width: 240, padding: 10, bottom: -16, left: 30, transform: 'rotate(6deg)', zIndex: 0 }}
      >
        <div style={{ height: 180, background: '#ddd' }} className="rounded-sm" />
        <div className="h-10" />
      </div>
      {/* Front polaroid */}
      <div className="relative bg-white rounded-sm shadow-2xl z-10" style={{ width: 260, padding: 12 }}>
        <div style={{ height: 200 }} className="overflow-hidden rounded-sm">
          <img
            src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=400&h=280&fit=crop"
            alt="polaroid"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="h-12 flex items-center justify-center font-playfair italic text-amber-900/50 text-sm">
          Wedding Day ♥
        </div>
      </div>
    </div>
  )
}

/* ── Title Card ──────────────────────────── */
function TitleCard() {
  return (
    <div className="text-center px-8" style={{ maxWidth: 600 }}>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-500/50" />
        <div className="w-2 h-2 rounded-full bg-amber-500" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-500/50" />
      </div>
      <p className="text-amber-400/80 text-xs tracking-[0.4em] uppercase mb-4 font-poppins">
        PB Photography
      </p>
      <h3 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
        Let's Create<br />
        <span className="text-amber-400">Something</span> Timeless
      </h3>
      <div className="flex items-center gap-4 mt-6">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-500/50" />
        <div className="w-2 h-2 rounded-full bg-amber-500" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-500/50" />
      </div>
    </div>
  )
}

export default ScrollJourney
