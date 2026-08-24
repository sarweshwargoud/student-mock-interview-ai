'use client'
import React, { useRef, useState } from 'react'

export default function TiltCard({ children, className = '', glowColor = 'rgba(99, 102, 241, 0.15)' }) {
  const cardRef = useRef(null)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setCoords({ x, y })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setCoords({ x: 0, y: 0 })
  }

  const cardStyle = {
    transform: isHovered
      ? `perspective(1000px) rotateX(${-coords.y / 15}deg) rotateY(${coords.x / 15}deg) scale3d(1.02, 1.02, 1.02)`
      : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: isHovered ? 'none' : 'transform 0.5s ease, box-shadow 0.5s ease',
    boxShadow: isHovered
      ? `0 20px 40px -15px rgba(0, 0, 0, 0.3), 0 0 30px 5px ${glowColor}`
      : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={cardStyle}
      className={`relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-6 transition-all duration-300 ${className}`}
    >
      {/* Dynamic Glow Spot */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px opacity-30 transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${coords.x + (cardRef.current?.offsetWidth || 0) / 2}px ${coords.y + (cardRef.current?.offsetHeight || 0) / 2}px, ${glowColor.replace(/[\d.]+\)$/, '0.4)')}, transparent 60%)`,
          }}
        />
      )}
      {children}
    </div>
  )
}
