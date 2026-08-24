'use client'
import React, { useEffect, useRef } from 'react'

export default function ThreeDCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)

    const particles = []
    const particleCount = 100
    const connectionDistance = 110
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, active: false }

    class Particle {
      constructor() {
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(Math.random() * 2 - 1)
        const radius = 100 + Math.random() * 150

        this.x3d = radius * Math.sin(phi) * Math.cos(theta)
        this.y3d = radius * Math.sin(phi) * Math.sin(theta)
        this.z3d = radius * Math.cos(phi)

        this.x = 0
        this.y = 0
        this.size = Math.random() * 2 + 1
        this.color = `rgba(${99 + Math.random() * 50}, ${102 + Math.random() * 50}, 241, ${0.4 + Math.random() * 0.5})`
      }

      project(angleX, angleY, fov, cx, cy) {
        let x1 = this.x3d * Math.cos(angleY) - this.z3d * Math.sin(angleY)
        let z1 = this.x3d * Math.sin(angleY) + this.z3d * Math.cos(angleY)

        let y2 = this.y3d * Math.cos(angleX) - z1 * Math.sin(angleX)
        let z2 = this.y3d * Math.sin(angleX) + z1 * Math.cos(angleX)

        const scale = fov / (fov + z2)
        this.x = cx + x1 * scale
        this.y = cy + y2 * scale
        this.depth = z2
        this.scale = scale
      }

      draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size * this.scale, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    let angleX = 0
    let angleY = 0
    let targetAngleX = 0.002
    let targetAngleY = 0.003

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.targetX = e.clientX - rect.left - width / 2
      mouse.targetY = e.clientY - rect.top - height / 2
      mouse.active = true
    }

    const handleMouseLeave = () => {
      mouse.active = false
    }

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      if (mouse.active) {
        targetAngleY = (mouse.targetX / width) * 0.5
        targetAngleX = (-mouse.targetY / height) * 0.5
      } else {
        targetAngleY += 0.001
        targetAngleX += 0.0005
      }

      angleX += (targetAngleX - angleX) * 0.05
      angleY += (targetAngleY - angleY) * 0.05

      const fov = 400
      const cx = width / 2
      const cy = height / 2

      particles.forEach((p) => p.project(angleX, angleY, fov, cx, cy))
      particles.sort((a, b) => b.depth - a.depth)

      ctx.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i]
          const p2 = particles[j]

          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.25 * p1.scale * p2.scale
            ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }

      particles.forEach((p) => p.draw(ctx))

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      if (canvas) {
        canvas.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    />
  )
}
