'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'

interface CarouselProps {
  children: React.ReactNode[]
  autoPlay?: boolean
  interval?: number
  showDots?: boolean
  showArrows?: boolean
  infinite?: boolean
  className?: string
  itemsPerView?: number
  gap?: number
}

const Carousel = ({
  children,
  autoPlay = true,
  interval = 4000,
  showDots = true,
  showArrows = true,
  infinite = true,
  className = '',
  itemsPerView = 1,
  gap = 0,
}: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isHovered, setIsHovered] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const totalItems = children.length
  const totalSlides = Math.ceil(totalItems / itemsPerView)
  const isMultipleItems = itemsPerView > 1

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && !isHovered && autoPlay) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          if (infinite) {
            return (prevIndex + 1) % totalSlides
          }
          return prevIndex + 1 >= totalSlides ? 0 : prevIndex + 1
        })
      }, interval)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, isHovered, autoPlay, interval, totalSlides, infinite])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    if (infinite) {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? totalSlides - 1 : prevIndex - 1
      )
    } else {
      setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1))
    }
  }

  const goToNext = () => {
    if (infinite) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides)
    } else {
      setCurrentIndex((prevIndex) => 
        Math.min(totalSlides - 1, prevIndex + 1)
      )
    }
  }

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying)
  }

  const getVisibleItems = () => {
    const startIndex = currentIndex * itemsPerView
    return children.slice(startIndex, startIndex + itemsPerView)
  }

  return (
    <div
      className={`relative w-full ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main carousel container */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`flex ${isMultipleItems ? `gap-${gap}` : ''}`}
          >
            {isMultipleItems ? (
              getVisibleItems().map((child, index) => (
                <div
                  key={currentIndex * itemsPerView + index}
                  className={`flex-shrink-0 w-full ${
                    itemsPerView > 1 ? `lg:w-1/${itemsPerView}` : ''
                  }`}
                >
                  {child}
                </div>
              ))
            ) : (
              <div className="w-full flex-shrink-0">
                {children[currentIndex]}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      {showArrows && (
        <>
          <button
            onClick={goToPrevious}
            disabled={!infinite && currentIndex === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-neutral-800 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            disabled={!infinite && currentIndex === totalSlides - 1}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-neutral-800 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {showDots && (
        <div className="flex justify-center items-center gap-2 mt-6">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-primary-500 scale-125'
                  : 'bg-neutral-300 hover:bg-neutral-400'
              }`}
            />
          ))}
        </div>
      )}

      {/* Play/Pause button */}
      {autoPlay && (
        <button
          onClick={toggleAutoPlay}
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 z-10"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      )}
    </div>
  )
}

export default Carousel
