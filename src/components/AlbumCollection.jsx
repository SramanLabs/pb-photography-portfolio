import React, { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AlbumBook from './AlbumBook'
import Reveal from './Reveal'

/* ─────────────────────────────────────
   Album data
───────────────────────────────────── */
const albums = [
  {
    id: 1,
    title: "Wedding Stories",
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop",
    description: "Elegant wedding photography capturing love stories",
    photos: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1519741347686-c1e0adad242d?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&h=1000&fit=crop",
    ],
  },
  {
    id: 2,
    title: "Portrait Sessions",
    coverImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=800&fit=crop",
    description: "Artistic portraits that reveal personality",
    photos: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=800&h=1000&fit=crop",
    ],
  },
  {
    id: 3,
    title: "Nature & Landscape",
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop",
    description: "Breathtaking landscapes and natural beauty",
    photos: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=1000&fit=crop",
    ],
  },
  {
    id: 4,
    title: "Events & Celebrations",
    coverImage: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&h=800&fit=crop",
    description: "Capturing special moments and celebrations",
    photos: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=1000&fit=crop",
    ],
  },
  {
    id: 5,
    title: "Fashion & Editorial",
    coverImage: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=800&fit=crop",
    description: "High-end fashion photography",
    photos: [
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop",
    ],
  },
  {
    id: 6,
    title: "Street & Urban",
    coverImage: "https://images.unsplash.com/photo-1493605335038-f9cb907293a9?w=600&h=800&fit=crop",
    description: "Candid life and striking architecture in the metropolis",
    photos: [
      "https://images.unsplash.com/photo-1493605335038-f9cb907293a9?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=1000&fit=crop",
    ],
  },
]

/* ─────────────────────────────────────────────────────────────────
   ViewCursor — Cinematic Autofocus Crosshair
───────────────────────────────────────────────────────────────── */
function ViewCursor({ isHovering }) {
  const innerRef = useRef(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const innerPos = useRef({ x: -1000, y: -1000 })

  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove)

    let raf
    const tick = () => {
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // Smooth tracking
      innerPos.current.x += (mx - innerPos.current.x) * 0.28
      innerPos.current.y += (my - innerPos.current.y) * 0.28

      if (innerRef.current) {
        innerRef.current.style.transform =
          `translate(${innerPos.current.x}px, ${innerPos.current.y}px) translate(-50%, -50%)`
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  const cursor = (
    <div
      ref={innerRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        pointerEvents: 'none',
        zIndex: 999999,
        opacity: isHovering ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }}
    >
      {/* ── Cinematic Crosshair Container ── */}
      <div 
         style={{ 
           width: 22, height: 22, 
           position: 'relative',
           display: 'flex', alignItems: 'center', justifyContent: 'center',
           transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
           transform: `scale(${isHovering ? 1 : 0.3})`
         }}
      >
        {/* Outer subtle guide ring */}
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(245,158,11,0.3)' }} />
        
        {/* Top/Bottom Crosshairs */}
        <div style={{ position: 'absolute', top: -3, left: '50%', transform: 'translateX(-50%)', width: 1, height: 6, background: 'rgba(245,158,11,0.95)' }} />
        <div style={{ position: 'absolute', bottom: -3, left: '50%', transform: 'translateX(-50%)', width: 1, height: 6, background: 'rgba(245,158,11,0.95)' }} />
        
        {/* Left/Right Crosshairs */}
        <div style={{ position: 'absolute', left: -3, top: '50%', transform: 'translateY(-50%)', width: 6, height: 1, background: 'rgba(245,158,11,0.95)' }} />
        <div style={{ position: 'absolute', right: -3, top: '50%', transform: 'translateY(-50%)', width: 6, height: 1, background: 'rgba(245,158,11,0.95)' }} />
        
        {/* Glowing Center Focus Dot */}
        <div style={{ 
            width: 2.5, height: 2.5, 
            borderRadius: '50%', 
            background: '#f59e0b', 
            boxShadow: '0 0 10px #f59e0b'
        }} />

        {/* View Text */}
        <div style={{
           position: 'absolute',
           bottom: -15,
           fontFamily: 'Poppins, sans-serif', 
           fontWeight: 600, 
           fontSize: '6px',
           letterSpacing: '0.2em',
           color: '#f59e0b',
           opacity: isHovering ? 1 : 0,
           transition: 'opacity 0.4s ease 0.1s'
        }}>
          VIEW
        </div>
      </div>
    </div>
  )

  return typeof document !== 'undefined' ? createPortal(cursor, document.body) : null
}

/* ─────────────────────────────────────
   AlbumCollection Section
───────────────────────────────────── */
const AlbumCollection = () => {
  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const [isHovering, setIsHovering] = useState(false)

  return (
    <>
      {/* Keyframes for lens ring rotation — injected once */}
      <style>{`
        @keyframes lens-spin-cw  { from { transform: rotate(0deg);    } to { transform: rotate(360deg);  } }
        @keyframes lens-spin-ccw { from { transform: rotate(0deg);    } to { transform: rotate(-360deg); } }
      `}</style>

      <ViewCursor isHovering={isHovering} />

      <section
        id="albums"
        className="py-24 bg-gradient-to-b from-black to-gray-900"
        style={{ cursor: isHovering ? 'none' : 'auto' }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="container-custom">
          <Reveal dir="up">
            <div className="text-center mb-16">
              <span className="text-amber-500 font-semibold tracking-[0.3em] uppercase text-xs font-poppins">Our Work</span>
              <h2 className="text-4xl md:text-6xl font-playfair font-bold mt-3 mb-4">
                Featured <span className="text-amber-500">Albums</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto font-poppins">
                Explore our curated collection of moments frozen in time, each telling a unique story through our lens.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums.map((album, index) => (
              <Reveal key={album.id} delay={index * 0.07} random>
                <motion.div
                  className="group cursor-none"
                  onClick={() => setSelectedAlbum(album)}
                  whileHover={{ y: -10 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                    <img
                      src={album.coverImage}
                      alt={album.title}
                      className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-95 transition-opacity duration-500" />

                    {/* Content reveals on hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      <h3 className="text-2xl font-playfair font-bold text-white mb-1">{album.title}</h3>
                      <p className="text-gray-300/80 text-sm mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 font-poppins">{album.description}</p>
                      <span className="inline-flex items-center gap-2 text-amber-400 font-poppins font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        View Album
                        <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}>→</motion.span>
                      </span>
                    </div>

                    {/* Amber top accent bar */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                    {/* Corner index */}
                    <div className="absolute top-4 right-4 text-white/25 font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {selectedAlbum && (
            <AlbumBook album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />
          )}
        </AnimatePresence>
      </section>
    </>
  )
}

export default AlbumCollection