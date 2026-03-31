"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { useParticleField } from "./particle-field"

function getPrimaryColor(): string {
  if (typeof window === "undefined") return "#7c3aed"
  const style = getComputedStyle(document.documentElement)
  const hslStr = style.getPropertyValue("--primary").trim()
  if (!hslStr) return "#7c3aed"
  return `hsl(${hslStr})`
}

function getAccentColor(): string {
  if (typeof window === "undefined") return "#a855f7"
  const style = getComputedStyle(document.documentElement)
  const hslStr = style.getPropertyValue("--accent").trim()
  if (!hslStr) return "#a855f7"
  return `hsl(${hslStr})`
}

function shouldReduceMotion(): boolean {
  if (typeof window === "undefined") return true
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency < 4)
  )
}

function getParticleCount(): number {
  if (typeof window === "undefined") return 800
  const w = window.innerWidth
  if (w < 768) return 600
  if (w < 1280) return 1800
  return 3000
}

export function WebGLBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<THREE.Scene>(new THREE.Scene())
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const frameRef = useRef<number>(0)
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  const particleCount = typeof window !== "undefined" ? getParticleCount() : 800
  const primaryColor = typeof window !== "undefined" ? getPrimaryColor() : "#7c3aed"
  const accentColor = typeof window !== "undefined" ? getAccentColor() : "#a855f7"

  const particlesRef = useParticleField({
    sceneRef: sceneRef,
    count: particleCount,
    colorHex: primaryColor,
    accentHex: accentColor,
  })

  useEffect(() => {
    if (!canvasRef.current) return
    if (shouldReduceMotion()) return

    const canvas = canvasRef.current
    const scene = sceneRef.current

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "default",
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    rendererRef.current = renderer

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(0, 0, 15)
    cameraRef.current = camera

    // Mouse parallax
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener("mousemove", onMouseMove, { passive: true })

    // Resize
    const onResize = () => {
      if (!rendererRef.current || !cameraRef.current) return
      cameraRef.current.aspect = window.innerWidth / window.innerHeight
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", onResize, { passive: true })

    const startTime = performance.now()
    
    // Animate loop
    const animate = (time: number) => {
      frameRef.current = requestAnimationFrame(animate)
      const elapsed = (time - startTime) * 0.001

      // Rotate entire particle system slowly
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsed * 0.025
        particlesRef.current.rotation.x = elapsed * 0.01
      }

      // Camera parallax from mouse
      if (cameraRef.current) {
        cameraRef.current.position.x += (mouseRef.current.x * 1.5 - cameraRef.current.position.x) * 0.03
        cameraRef.current.position.y += (mouseRef.current.y * 1.0 - cameraRef.current.position.y) * 0.03
        cameraRef.current.lookAt(scene.position)
      }

      renderer.render(scene, camera)
    }

    animate(performance.now())

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("resize", onResize)
      renderer.dispose()
    }
  }, [particlesRef])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: -2 }}
      aria-hidden
    />
  )
}
