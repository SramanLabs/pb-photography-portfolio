import React, { useState, useRef, useEffect, useCallback } from 'react'
import HTMLFlipBook from 'react-pageflip'
import { X, ChevronLeft, ChevronRight, BookOpen, Camera } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { BASE_URL } from '../api/axios'

// Helper to get image URL
const getImgUrl = (path) => {
  if (!path) return '';
  return path.startsWith('http') ? path : `${BASE_URL}${path}`;
};

/* ══════════════════════════════════════════════
   CSS fix — injected once, prevents mirror/ghost
   during page flip by hiding backfaces on all
   internal react-pageflip page blocks.
══════════════════════════════════════════════ */
const BOOK_CSS = `
  .book-flip .stf__item,
  .book-flip .stf__block {
    backface-visibility: hidden !important;
    -webkit-backface-visibility: hidden !important;
  }
  .book-flip img {
    backface-visibility: hidden !important;
    -webkit-backface-visibility: hidden !important;
    display: block;
  }
`

/* ══════════════════════════════════════════════
   COVER PAGE
══════════════════════════════════════════════ */
const CoverPage = React.forwardRef(({ album, isBack }, ref) => (
  <div
    ref={ref}
    style={{
      position: 'relative', width: '100%', height: '100%',
      overflow: 'hidden',
      background: '#0a0a0a',           // solid dark fallback — no transparency
    }}
  >
    <img
      src={getImgUrl(album.coverImage)}
      alt={album.title}
      draggable={false}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
    />
    {/* Overlay — solid so nothing bleeds through */}
    <div style={{
      position: 'absolute', inset: 0,
      background: isBack
        ? 'linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.55))'
        : 'linear-gradient(to left,  rgba(0,0,0,0.8), rgba(0,0,0,0.45))',
    }} />
    {/* Subtle leather texture */}
    <div style={{
      position: 'absolute', inset: 0, opacity: 0.06,
      backgroundImage: 'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 1px,transparent 8px)',
    }} />

    {/* FRONT COVER content */}
    {!isBack && (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', padding: 32 }}>
        <motion.div
          animate={{ rotateY: [0, 12, 0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(245,158,11,0.2)', border: '2px solid rgba(245,158,11,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 0 32px rgba(245,158,11,0.15)' }}
        >
          <img src="/pbphotography.png" alt="Logo" style={{ width: 28, height: 28, objectFit: 'contain' }} />
        </motion.div>
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 26, fontWeight: 700, textAlign: 'center', textShadow: '0 2px 20px rgba(0,0,0,0.9)', marginBottom: 12 }}>
          {album.title}
        </h1>
        <div style={{ width: 36, height: 1, background: 'rgba(245,158,11,0.85)', marginBottom: 12 }} />
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, textAlign: 'center', fontWeight: 300, letterSpacing: '0.06em', fontFamily: 'Poppins, sans-serif', lineHeight: 1.6, maxWidth: 220 }}>
          {album.description}
        </p>
        <p style={{ position: 'absolute', bottom: 24, fontSize: 8, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.35em', textTransform: 'uppercase', fontFamily: 'Poppins' }}>
          Click corners to flip →
        </p>
      </div>
    )}

    {/* BACK COVER content */}
    {isBack && (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        <BookOpen style={{ width: 36, height: 36, color: 'rgba(245,158,11,0.45)', marginBottom: 16 }} />
        <p style={{ fontSize: 11, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.3)', fontFamily: 'Poppins', textTransform: 'uppercase' }}>PB Photography</p>
        <div style={{ width: 30, height: 1, background: 'rgba(245,158,11,0.25)', marginTop: 12 }} />
      </div>
    )}

    {/* Spine shadow band */}
    <div style={{
      position: 'absolute', top: 0, bottom: 0, width: 24,
      [isBack ? 'right' : 'left']: 0,
      background: `linear-gradient(to ${isBack ? 'left' : 'right'}, rgba(0,0,0,0.55), transparent)`,
    }} />
  </div>
))
CoverPage.displayName = 'CoverPage'

/* ══════════════════════════════════════════════
   PHOTO PAGE — full-bleed dark, no transparency
   (transparent backgrounds = visible ghost artifacts)
══════════════════════════════════════════════ */
const PhotoPage = React.forwardRef(({ photos, pageIndex, side, albumTitle }, ref) => {
  const isLeft = side === 'left'
  const spreadIndex = Math.floor(pageIndex / 2)

  // Correct photo index for each side
  const photoIdx = spreadIndex * 2 + (isLeft ? 0 : 1)
  const photo = photos[Math.min(photoIdx, photos.length - 1)]
  const pageNum = photoIdx + 1

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: '100%', height: '100%',
        overflow: 'hidden',
        background: '#111',             // solid fallback — NO transparency
      }}
    >
      {/* Photo */}
      {photo ? (
        <img
          src={getImgUrl(photo)}
          alt={`${albumTitle} — ${pageNum}`}
          draggable={false}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      ) : (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
          <img src="/pbphotography.png" alt="Logo" style={{ width: 48, height: 48, opacity: 0.3, display: 'block', margin: 'auto', objectFit: 'contain' }} />
        </div>
      )}

      {/* Binding shadow — dark side near spine */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: isLeft
          ? 'linear-gradient(to right, transparent 75%, rgba(0,0,0,0.4))'
          : 'linear-gradient(to left,  transparent 75%, rgba(0,0,0,0.4))',
      }} />

      {/* Bottom caption gradient */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '28px 14px 10px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)',
        pointerEvents: 'none',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            color: 'rgba(245,158,11,0.8)',
            fontSize: 7.5,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
          }}>
            {albumTitle}
          </span>
          <span style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: 8,
            fontFamily: '"Courier New", monospace',
          }}>
            {String(pageNum).padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  )
})
PhotoPage.displayName = 'PhotoPage'


/* ══════════════════════════════════════════════
   MAIN AlbumBook Component
══════════════════════════════════════════════ */
const AlbumBook = ({ album, onClose }) => {
  const bookRef = useRef(null)
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  })
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)

  useEffect(() => {
    const handleResize = () => setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = windowSize.width < 768
  const bookWidth = isMobile ? Math.min(windowSize.width * 0.85, 340) : 380
  const bookHeight = isMobile ? Math.min(windowSize.height * 0.6, 480) : 520

  const photos = album.photos || []
  const innerPagePairs = Math.ceil(photos.length / 2)
  const totalPageCount = 2 + innerPagePairs * 2  // cover + pairs + back cover

  useEffect(() => {
    setTotalPages(totalPageCount)
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [totalPageCount])

  const isFirst = currentPage === 0
  const isLast  = currentPage >= totalPageCount - 2

  const flipNext = useCallback(() => {
    if (!isFlipping && !isLast) {
      setIsFlipping(true)
      bookRef.current?.pageFlip().flipNext()
      setTimeout(() => setIsFlipping(false), 550)
    }
  }, [isFlipping, isLast])

  const flipPrev = useCallback(() => {
    if (!isFlipping && !isFirst) {
      setIsFlipping(true)
      bookRef.current?.pageFlip().flipPrev()
      setTimeout(() => setIsFlipping(false), 550)
    }
  }, [isFlipping, isFirst])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') flipNext()
      if (e.key === 'ArrowLeft')  flipPrev()
      if (e.key === 'Escape')     onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [flipNext, flipPrev, onClose])

  const stageLabel = { entering: '··· Loading', closed: '··· Opening', opening: '··· Turning pages' }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #1c1a17 0%, #0a0908 100%)' }}
    >
      {/* Inject backface CSS fix */}
      <style>{BOOK_CSS}</style>

      {/* Bokeh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div key={i} className="absolute rounded-full blur-3xl"
            style={{ opacity: 0.07, background: i % 2 === 0 ? '#f59e0b' : '#d97706', width: `${80 + i * 40}px`, height: `${80 + i * 40}px`, left: `${10 + i * 20}%`, top: `${20 + (i % 3) * 25}%` }}
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between w-full px-6 py-6 sm:px-10 pointer-events-none">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          <span className="text-amber-400 font-playfair font-semibold text-base sm:text-lg truncate max-w-[200px]">{album.title}</span>
        </motion.div>
        <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
          onClick={onClose} className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors group px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 pointer-events-auto shadow-lg cursor-pointer">
          <span className="text-xs tracking-[0.2em] group-hover:text-amber-400 transition-colors font-poppins font-medium uppercase">Close</span>
          <X className="w-4 h-4 sm:w-5 sm:h-5 group-hover:text-amber-400 transition-colors" />
        </motion.button>
      </div>

      {/* Book + Arrows Container */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full">

        {/* Controls - Stacks on bottom for mobile */}
        <div className="flex sm:contents order-last sm:order-none gap-8">
          {/* Prev */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button onClick={flipPrev} disabled={isFirst || isFlipping}
              className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110 active:scale-95 duration-200 ${isFirst ? 'opacity-20 cursor-not-allowed bg-white/5' : 'bg-amber-500/90 hover:bg-amber-400 cursor-pointer'}`}>
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
          </motion.div>

          {/* Next Button for mobile (cloning here for stacked layout) */}
          <div className="sm:hidden">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <button onClick={flipNext} disabled={isLast || isFlipping}
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110 active:scale-95 duration-200 ${isLast ? 'opacity-20 cursor-not-allowed bg-white/5' : 'bg-amber-500/90 hover:bg-amber-400 cursor-pointer'}`}>
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Book */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            style={{ filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.8))' }}
        >
          <HTMLFlipBook
            ref={bookRef}
            width={bookWidth}
            height={bookHeight}
            size="fixed"
            minWidth={isMobile ? 240 : 200}
            maxWidth={500}
            minHeight={300}
            maxHeight={700}
            maxShadowOpacity={0.4}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={(e) => setCurrentPage(e.data)}
            className="book-flip"
            flippingTime={600}
            usePortrait={isMobile}
            startZIndex={0}
            autoSize={false}
            drawShadow={true}
            clickEventForward={true}
            useMouseEvents={true}
            swipeDistance={30}
            showPageCorners={true}
            disableFlipByClick={false}
          >
            <CoverPage album={album} isBack={false} />

            {Array.from({ length: innerPagePairs }, (_, i) => [
              <PhotoPage
                key={`L${i}`}
                photos={photos}
                pageIndex={i * 2}
                side="left"
                albumTitle={album.title}
              />,
              <PhotoPage
                key={`R${i}`}
                photos={photos}
                pageIndex={i * 2}
                side="right"
                albumTitle={album.title}
              />,
            ]).flat()}

            <CoverPage album={album} isBack={true} />
          </HTMLFlipBook>
        </motion.div>

        {/* Next (desktop only) */}
        <div className="hidden sm:block">
          <motion.div
             initial={{ opacity: 0, x: -16 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button onClick={flipNext} disabled={isLast || isFlipping}
              className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110 active:scale-95 duration-200 ${isLast ? 'opacity-20 cursor-not-allowed bg-white/5' : 'bg-amber-500/90 hover:bg-amber-400 cursor-pointer'}`}>
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Progress dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 flex items-center gap-2 mt-6"
      >
        {Array.from({ length: Math.ceil(totalPageCount / 2) }, (_, i) => {
          const spread   = Math.floor(currentPage / 2)
          const isActive = spread === i
          return (
            <button
              key={i}
              onClick={() => {
                const target = i * 2
                const curr   = bookRef.current?.pageFlip().getCurrentPageIndex() || 0
                const diff   = Math.abs(target - curr) / 2
                if (target > curr) {
                  for (let j = 0; j < diff; j++) setTimeout(() => bookRef.current?.pageFlip().flipNext(), j * 600)
                } else {
                  for (let j = 0; j < diff; j++) setTimeout(() => bookRef.current?.pageFlip().flipPrev(), j * 600)
                }
              }}
              className={`transition-all duration-300 rounded-full ${isActive ? 'w-6 h-2 bg-amber-400' : 'w-2 h-2 bg-white/20 hover:bg-white/40'}`}
              aria-label={`Go to spread ${i + 1}`}
            />
          )
        })}
      </motion.div>

      {/* Hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="relative z-10 mt-3 text-white/20 text-[10px] tracking-[0.18em] font-poppins"
      >
        ← →  ·  click corners  ·  swipe  ·  ESC to close
      </motion.p>
    </motion.div>
  )
}

export default AlbumBook