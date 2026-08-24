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
    const rows = 18
    const cols = 18
    const spacingX = 70
    const spacingZ = 70
    const amplitude = 45 // Wave height
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, active: false }

    class Particle {
      constructor(r, c) {
        this.r = r
        this.c = c
        // Center the grid in 3D space
        this.x3d = (c - cols / 2) * spacingX
        this.z3d = (r - rows / 2) * spacingZ
        this.y3d = 0

        this.x = 0
        this.y = 0
        this.size = Math.random() * 3 + 2.5 // Enlarged size
        this.color = `rgba(129, 140, 248, ${0.5 + Math.random() * 0.4})`
      }

      update(time) {
        // Base sine wave motion
        const distFromCenter = Math.sqrt(this.x3d * this.x3d + this.z3d * this.z3d)
        this.y3d = Math.sin(distFromCenter * 0.004 - time * 2) * amplitude

        // Interactive mouse distortion wave
        if (mouse.active) {
          const dx = this.x - (mouse.targetX + width / 2)
          const dy = this.y - (mouse.targetY + height / 2)
          const distToMouse = Math.sqrt(dx * dx + dy * dy)
          if (distToMouse < 220) {
            const force = (220 - distToMouse) / 220
            this.y3d += Math.sin(distToMouse * 0.04 - time * 4) * amplitude * force * 1.8
          }
        }
      }

      project(angleX, angleY, fov, cx, cy) {
        // Rotate around Y axis
        let x1 = this.x3d * Math.cos(angleY) - this.z3d * Math.sin(angleY)
        let z1 = this.x3d * Math.sin(angleY) + this.z3d * Math.cos(angleY)

        // Rotate around X axis
        let y2 = this.y3d * Math.cos(angleX) - z1 * Math.sin(angleX)
        let z2 = this.y3d * Math.sin(angleX) + z1 * Math.cos(angleX)

        const scale = fov / (fov + z2)
        this.x = cx + x1 * scale
        this.y = cy + y2 * scale
        this.depth = z2
        this.scale = scale
      }

      draw(ctx) {
        // Fade out nodes far in the background
        if (this.scale <= 0) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size * this.scale, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }
    }

    // Initialize particles in a grid
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        particles.push(new Particle(r, c))
      }
    }

    let angleX = 0.4 // Start with tilted isometric view
    let angleY = 0
    let targetAngleX = 0.4
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

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      const time = Date.now() * 0.001

      if (mouse.active) {
        targetAngleY = (mouse.targetX / width) * 0.6
        targetAngleX = 0.4 + (-mouse.targetY / height) * 0.4
      } else {
        targetAngleY = time * 0.08
        targetAngleX = 0.45 + Math.sin(time * 0.2) * 0.05
      }

      angleX += (targetAngleX - angleX) * 0.05
      angleY += (targetAngleY - angleY) * 0.05

      const fov = 500
      const cx = width / 2
      const cy = height / 2

      // Update positions, wave dynamics, and project
      particles.forEach((p) => {
        p.update(time)
        p.project(angleX, angleY, fov, cx, cy)
      })

      // Sort by depth for correct overlapping draw
      particles.sort((a, b) => b.depth - a.depth)

      // Draw connection lines in a structured grid mesh
      ctx.lineWidth = 0.7
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c
          const p1 = particles[idx]
          if (!p1) continue

          // Connect to right neighbor
          if (c < cols - 1) {
            const p2 = particles[idx + 1]
            if (p2) drawConnection(p1, p2)
          }
          // Connect to bottom neighbor
          if (r < rows - 1) {
            const p2 = particles[idx + cols]
            if (p2) drawConnection(p1, p2)
          }
        }
      }

      function drawConnection(p1, p2) {
        const dx = p1.x - p2.x
        const dy = p1.y - p2.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        // Prevent rendering lines across clipping boundaries
        if (dist < 180 && p1.scale > 0 && p2.scale > 0) {
          const alpha = (1 - dist / 180) * 0.3 * p1.scale * p2.scale
          ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.stroke()
        }
      }

      // Draw particle nodes
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
