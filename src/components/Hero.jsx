import React, { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

const Hero = () => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const smoothScrollYProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  /* ── Parallax transforms ────────────── */
  const bgY      = useTransform(smoothScrollYProgress, [0, 1], ['0%', '40%'])
  const textY    = useTransform(smoothScrollYProgress, [0, 1], ['0%', '25%'])
  // Tie opacity directly to raw scroll so it stays perfectly in sync without spring lag
  const opacity  = useTransform(scrollYProgress, [0, 0.85], [1, 0])

  const socialLinks = [
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/pbphotography0032/',
      path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
    },
    {
      label: 'YouTube',
      href: 'https://www.youtube.com/@PBphotography32',
      path: 'M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z',
    },
  ]

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ── Background image (parallax) ───── */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 scale-110"
      >
        <img
          src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1800&h=1000&fit=crop"
          alt="Cinematic photography background"
          className="w-full h-full object-cover"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </motion.div>

      {/* ── Floating ambient particles ─────── */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { size: 180, top: '15%', left: '60%', delay: 0 },
          { size: 120, top: '70%', left: '55%', delay: 1 },
          { size: 80,  top: '40%', left: '80%', delay: 2 },
        ].map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: p.size, height: p.size,
              top: p.top, left: p.left,
              background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 5 + i * 1.5, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* ── Main Content ─────────────────────── */}
      <motion.div
        style={{ y: textY, opacity }}
        className="container-custom relative z-20"
      >
        <div className="max-w-3xl">
          <div className="overflow-hidden">
            <motion.h1
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-7xl xl:text-8xl font-playfair font-bold leading-[1.08] mb-7"
            >
              Capturing Moments,
              <br />Creating{' '}
              <span
                className="text-amber-400 italic"
                style={{ textShadow: '0 0 60px rgba(245,158,11,0.25)' }}
              >
                Memories
              </span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="text-gray-300/80 text-lg md:text-xl mb-10 max-w-xl font-poppins leading-relaxed font-light"
          >
            Professional photography that tells your unique story. Weddings,
            portraits, and corporate shoots — captured with artistry and heart.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-4 mb-14"
          >
            <a
              href="#contact"
              className="btn-primary inline-flex items-center justify-center gap-2 group"
            >
              Book a Session
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1" style={{ transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)' }} />
            </a>
            <a href="#albums" className="btn-secondary inline-flex items-center justify-center">
              View Portfolio
            </a>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex gap-3"
          >
              {socialLinks.map((s, i) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                whileHover={{ scale: 1.12, borderColor: '#f59e0b' }}
                whileTap={{ scale: 0.93 }}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                  <path d={s.path} />
                </svg>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ── Floating 3D polaroids (right side) ── */}
      <motion.div
        style={{ opacity, perspective: 1800 }}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-5/12 h-[700px] hidden lg:block z-20 pointer-events-none"
      >
        {/* Main frame */}
        <motion.div
          initial={{ opacity: 0, x: 80, rotateY: 25 }}
          animate={{ opacity: 1, x: 0, y: [-12, 12, -12], rotateY: [-20, -10, -20], rotateX: [3, 10, 3] }}
          transition={{ opacity: { duration: 0.8 }, x: { duration: 0.8 }, y: { duration: 7, repeat: Infinity, ease: 'easeInOut' }, rotateY: { duration: 7, repeat: Infinity, ease: 'easeInOut' }, rotateX: { duration: 7, repeat: Infinity, ease: 'easeInOut' } }}
          className="absolute top-16 right-20 w-72 h-72 rounded-2xl overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.6)]"
          style={{ border: '6px solid rgba(255,255,255,0.08)', transformStyle: 'preserve-3d' }}
        >
          <img
            src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop"
            alt="Photography"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Polaroid 1 */}
        <motion.div
          initial={{ opacity: 0, x: 40, rotateZ: 40 }}
          animate={{ opacity: 1, x: 0, y: [0, 18, 0], rotateZ: [10, 18, 10], rotateY: [14, 22, 14] }}
          transition={{ opacity: { duration: 0.7, delay: 0.3 }, x: { duration: 0.7 }, y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }, rotateZ: { duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }, rotateY: { duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 } }}
          className="absolute top-72 right-64 w-48 bg-white p-3 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <img
            src="/flashcard2.png"
            className="w-full h-36 object-cover rounded-sm"
            alt="Wedding"
          />
          <div className="h-9 flex items-center justify-center font-playfair italic text-amber-900/40 text-xs">
            Love Stories
          </div>
        </motion.div>

        {/* Polaroid 2 */}
        <motion.div
          initial={{ opacity: 0, y: 80, rotateZ: -25 }}
          animate={{ opacity: 1, y: [0, -14, 0], rotateZ: [-13, -6, -13], rotateX: [8, 18, 8] }}
          transition={{ opacity: { duration: 0.7, delay: 0.5 }, y: { duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }, rotateZ: { duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }, rotateX: { duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 1 } }}
          className="absolute top-40 right-8 w-44 bg-white p-3 rounded-sm shadow-[0_25px_60px_rgba(0,0,0,0.55)]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <img
            src="/flashcard1.png"
            className="w-full h-36 object-cover rounded-sm"
            alt="Portrait"
          />
          <div className="h-8 flex items-center justify-center font-playfair italic text-amber-900/40 text-xs">
            Portraits
          </div>
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ──────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-white/30 text-[9px] tracking-[0.3em] uppercase font-poppins">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-9 border border-white/20 rounded-full flex justify-center pt-1.5"
        >
          <div className="w-0.5 h-2.5 bg-amber-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero