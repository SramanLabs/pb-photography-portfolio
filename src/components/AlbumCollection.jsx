import React, { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AlbumBook from './AlbumBook'
import Reveal from './Reveal'
import api, { BASE_URL } from '../api/axios'

// Helper to get image URL
const getImgUrl = (path) => {
  if (!path) return '';
  return path.startsWith('http') ? path : `${BASE_URL}${path}`;
};

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
      <div 
         style={{ 
           width: 22, height: 22, 
           position: 'relative',
           display: 'flex', alignItems: 'center', justifyContent: 'center',
           transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
           transform: `scale(${isHovering ? 1 : 0.3})`
         }}
      >
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(245,158,11,0.3)' }} />
        <div style={{ position: 'absolute', top: -3, left: '50%', transform: 'translateX(-50%)', width: 1, height: 6, background: 'rgba(245,158,11,0.95)' }} />
        <div style={{ position: 'absolute', bottom: -3, left: '50%', transform: 'translateX(-50%)', width: 1, height: 6, background: 'rgba(245,158,11,0.95)' }} />
        <div style={{ position: 'absolute', left: -3, top: '50%', transform: 'translateY(-50%)', width: 6, height: 1, background: 'rgba(245,158,11,0.95)' }} />
        <div style={{ position: 'absolute', right: -3, top: '50%', transform: 'translateY(-50%)', width: 6, height: 1, background: 'rgba(245,158,11,0.95)' }} />
        <div style={{ 
            width: 2.5, height: 2.5, 
            borderRadius: '50%', 
            background: '#f59e0b', 
            boxShadow: '0 0 10px #f59e0b'
        }} />
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

const Skeleton = () => (
  <div className="bg-white/5 animate-pulse rounded-2xl h-80 w-full" />
);

/* ─────────────────────────────────────
   AlbumCollection Section
───────────────────────────────────── */
const AlbumCollection = () => {
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const { data } = await api.get('/albums')
        setAlbums(data)
      } catch (error) {
        console.error('Failed to fetch albums:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAlbums()
  }, [])

  return (
    <>
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
            {loading ? (
              [...Array(3)].map((_, i) => <Skeleton key={i} />)
            ) : (
              albums.slice(0, 3).map((album, index) => (
                <Reveal key={album._id} delay={index * 0.07} random>
                  <motion.div
                    className="group cursor-none"
                    onClick={() => setSelectedAlbum(album)}
                    whileHover={{ y: -10 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                  >
                    <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                      <img
                        src={getImgUrl(album.coverImage)}
                        alt={album.title}
                        className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-95 transition-opacity duration-500" />

                      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                        <h3 className="text-2xl font-playfair font-bold text-white mb-1 uppercase tracking-tight">{album.title}</h3>
                        <p className="text-gray-300/80 text-sm mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 font-poppins line-clamp-2 italic">{album.description}</p>
                        <span className="inline-flex items-center gap-2 text-amber-400 font-poppins font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                          View Album
                          <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}>→</motion.span>
                        </span>
                      </div>

                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                      <div className="absolute top-4 right-4 text-white/25 font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                    </div>
                  </motion.div>
                </Reveal>
              ))
            )}
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