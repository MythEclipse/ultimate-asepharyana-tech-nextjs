"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

interface ParticleFieldProps {
  sceneRef: React.RefObject<THREE.Scene | null>
  count?: number
  colorHex?: string
  accentHex?: string
}

export function useParticleField({
  sceneRef,
  count = 3000,
  colorHex = "#7c3aed",
  accentHex = "#a855f7",
}: ParticleFieldProps) {
  const particlesRef = useRef<THREE.Points | null>(null)
  const geometryRef = useRef<THREE.BufferGeometry | null>(null)
  const materialRef = useRef<THREE.PointsMaterial | null>(null)

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return
    const geometry = new THREE.BufferGeometry()
    geometryRef.current = geometry

    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    const colorPrimary = new THREE.Color(colorHex)
    const colorAccent = new THREE.Color(accentHex)
    const colorDim = new THREE.Color("#1e0b4a")

    for (let i = 0; i < count; i++) {
      // Spherical distribution with varying density
      const radius = 5 + Math.pow(Math.random(), 0.5) * 25
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)

      // Blend between primary, accent, and dim
      const t = Math.random()
      const blended =
        t < 0.4
          ? colorPrimary.clone().lerp(colorDim, Math.random() * 0.7)
          : t < 0.8
            ? colorAccent.clone().lerp(colorDim, Math.random() * 0.6)
            : colorDim.clone()

      colors[i * 3] = blended.r
      colors[i * 3 + 1] = blended.g
      colors[i * 3 + 2] = blended.b

      sizes[i] = Math.random() * 1.5 + 0.5
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1))

    const material = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    materialRef.current = material

    const particles = new THREE.Points(geometry, material)
    particlesRef.current = particles
    scene.add(particles)

    return () => {
      scene.remove(particles)
      geometry.dispose()
      material.dispose()
    }
  }, [sceneRef, count, colorHex, accentHex])

  return particlesRef
}

export function useWireframeOrbs(sceneRef: React.RefObject<THREE.Scene | null>, colorHex = "#7c3aed") {
  const orbsRef = useRef<THREE.Mesh[]>([])

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return
    const orbs: THREE.Mesh[] = []
    const configs = [
      { radius: 2.5, detail: 1, x: -8, y: 3, z: -10, speed: 0.003, orbitR: 3 },
      { radius: 1.8, detail: 1, x: 10, y: -5, z: -15, speed: 0.005, orbitR: 2 },
      { radius: 3.2, detail: 2, x: 5, y: 8, z: -20, speed: 0.002, orbitR: 4 },
      { radius: 1.2, detail: 1, x: -12, y: -8, z: -8, speed: 0.007, orbitR: 1.5 },
      { radius: 2.0, detail: 2, x: 0, y: -12, z: -18, speed: 0.004, orbitR: 2.5 },
      { radius: 1.5, detail: 1, x: 14, y: 6, z: -12, speed: 0.006, orbitR: 2 },
    ]

    configs.forEach((cfg) => {
      const geometry = new THREE.IcosahedronGeometry(cfg.radius, cfg.detail)
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(colorHex),
        wireframe: true,
        transparent: true,
        opacity: 0.12,
      })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(cfg.x, cfg.y, cfg.z)
      // Store orbit config in userData
      mesh.userData = {
        speed: cfg.speed,
        orbitRadius: cfg.orbitR,
        originX: cfg.x,
        originY: cfg.y,
        phase: Math.random() * Math.PI * 2,
      }
      scene.add(mesh)
      orbs.push(mesh)
    })

    orbsRef.current = orbs

    return () => {
      orbs.forEach((orb) => {
        scene.remove(orb)
        ;(orb.geometry as THREE.BufferGeometry).dispose()
        ;(orb.material as THREE.MeshBasicMaterial).dispose()
      })
    }
  }, [sceneRef, colorHex])

  return orbsRef
}
