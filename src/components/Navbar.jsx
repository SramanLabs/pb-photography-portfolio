import React, { useState, useCallback } from 'react'
import { motion, useScroll, useTransform, useMotionTemplate, useSpring } from 'framer-motion'
import { Camera, Menu, X } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const { scrollY } = useScroll()
  const smoothY = useSpring(scrollY, { stiffness: 60, damping: 20, restDelta: 1 })
  const bgOpacity = useTransform(smoothY, [0, 100], [0, 0.85])
  const bg = useMotionTemplate`rgba(0, 0, 0, ${bgOpacity})`
  const blurValue = useTransform(smoothY, [0, 100], [0, 12])
  const backdropFilter = useMotionTemplate`blur(${blurValue}px)`
  const borderOpacity = useTransform(smoothY, [0, 100], [0, 0.06])
  const borderBottom = useMotionTemplate`1px solid rgba(255, 255, 255, ${borderOpacity})`
  // 1.25rem = 20px (py-5), 0.75rem = 12px (py-3)
  const py = useTransform(smoothY, [0, 100], ['1.25rem', '0.75rem'])

  const closeMenu = useCallback(() => setIsOpen(false), [])

  const navLinks = [
    { name: 'Home',         href: '#home'         },
    { name: 'Albums',       href: '#albums'       },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact',      href: '#contact'      },
  ]

  return (
    <>
      {/* ── Navbar ───────────────────────── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed w-full z-50"
        style={{
          paddingTop: py,
          paddingBottom: py,
          background: bg,
          backdropFilter: backdropFilter,
          WebkitBackdropFilter: backdropFilter,
          borderBottom: borderBottom,
          willChange: 'background, backdrop-filter, padding',
        }}
      >
        <div className="container-custom flex justify-between items-center">
          {/* ── Logo ──────────────────────── */}
          <a
            href="#home"
            className="flex items-center group"
            aria-label="PB Photography — Home"
          >
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
              src="/pbphotography.png" 
              alt="PB Photography"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </a>

          {/* ── Desktop Links ─────────────── */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative text-white/70 hover:text-amber-400 text-sm font-poppins font-medium group transition-all duration-300 hover:wavy-underline"
                style={{ textDecorationColor: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.textDecorationColor = '#f59e0b'}
                onMouseLeave={(e) => e.currentTarget.style.textDecorationColor = 'transparent'}
              >
                {link.name}
              </a>
            ))}

            {/* Book Now CTA */}
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm px-5 py-2.5 rounded-full font-poppins"
              style={{ transition: 'background-color 0.2s ease' }}
            >
              Book Now
            </motion.a>
          </div>

          {/* ── Mobile Hamburger ──────────── */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="md:hidden w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white"
            onClick={() => setIsOpen(v => !v)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>

        {/* ── Mobile Menu ───────────────────────── */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="md:hidden mt-3 mx-4 rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(10,10,10,0.95)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="flex flex-col py-4">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="px-6 py-3 text-white/70 hover:text-amber-400 font-poppins text-sm font-medium"
                  onClick={closeMenu}
                >
                  {link.name}
                </motion.a>
              ))}
              <div className="px-6 pt-2">
                <a
                  href="#contact"
                  className="block w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm px-5 py-3 rounded-full text-center font-poppins"
                  onClick={closeMenu}
                >
                  Book Now
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </motion.nav>
    </>
  )
}

export default Navbar