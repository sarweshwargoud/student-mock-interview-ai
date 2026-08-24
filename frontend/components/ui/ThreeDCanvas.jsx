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
    const particleCount = 120
    const connectionDistance = 140
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, active: false }

    class Particle {
      constructor() {
        this.theta = Math.random() * Math.PI * 2
        this.phi = Math.acos(Math.random() * 2 - 1)
        this.baseRadius = 150 + Math.random() * 160 // Slightly larger radius
        this.currentRadius = this.baseRadius
        this.breatheOffset = Math.random() * Math.PI * 2

        this.x3d = this.baseRadius * Math.sin(this.phi) * Math.cos(this.theta)
        this.y3d = this.baseRadius * Math.sin(this.phi) * Math.sin(this.theta)
        this.z3d = this.baseRadius * Math.cos(this.phi)

        this.x = 0
        this.y = 0
        this.size = Math.random() * 2.5 + 1.8 // Enlarged and visible
        this.color = `rgba(${129 + Math.random() * 30}, 140, 248, ${0.45 + Math.random() * 0.45})`
      }

      update(time) {
        // Gental breathing wave animation
        const breathe = Math.sin(time * 1.5 + this.breatheOffset) * 6
        this.currentRadius = this.baseRadius + breathe

        // Ripple wave displacement based on cursor proximity
        if (mouse.active) {
          const dx = this.x - (mouse.targetX + width / 2)
          const dy = this.y - (mouse.targetY + height / 2)
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 200) {
            const force = (200 - dist) / 200
            // Push radius outward to create a wave distortion on the sphere shell
            this.currentRadius += Math.sin(dist * 0.04 - time * 5) * 25 * force
          }
        }

        // Recompute 3D coordinates
        this.x3d = this.currentRadius * Math.sin(this.phi) * Math.cos(this.theta)
        this.y3d = this.currentRadius * Math.sin(this.phi) * Math.sin(this.theta)
        this.z3d = this.currentRadius * Math.cos(this.phi)
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
        if (this.scale <= 0) return
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
    let targetAngleX = 0
    let targetAngleY = 0

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

    const startTime = Date.now()

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Use elapsed time from page load — avoids the cold-start over-rotation
      // caused by raw Date.now() being a huge Unix timestamp
      const time = (Date.now() - startTime) * 0.001

      // Auto-rotary movement + cursor control
      if (mouse.active) {
        targetAngleY = (mouse.targetX / width) * 0.8 + time * 0.06
        targetAngleX = (-mouse.targetY / height) * 0.8 + time * 0.04
      } else {
        targetAngleY = time * 0.06
        targetAngleX = time * 0.04
      }

      angleX += (targetAngleX - angleX) * 0.05
      angleY += (targetAngleY - angleY) * 0.05

      const fov = 400
      const cx = width / 2
      const cy = height / 2

      particles.forEach((p) => {
        p.update(time)
        p.project(angleX, angleY, fov, cx, cy)
      })

      particles.sort((a, b) => b.depth - a.depth)

      // Connection lines
      ctx.lineWidth = 0.6
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i]
          const p2 = particles[j]

          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.35 * p1.scale * p2.scale
            ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }

      // Draw nodes
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
      style={{ opacity: 0.7 }}
    />
  )
}
