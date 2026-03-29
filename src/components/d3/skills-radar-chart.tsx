"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { gsap, ScrollTrigger } from "@/lib/gsap/gsap-init"
import { type SkillMetric } from "@/lib/data/skill-metrics"

gsap.registerPlugin(ScrollTrigger)

const NUM_LEVELS = 5

function polarToCartesian(angle: number, r: number): [number, number] {
  return [r * Math.cos(angle - Math.PI / 2), r * Math.sin(angle - Math.PI / 2)]
}

function buildPolygonPath(metrics: SkillMetric[], radius: number): string {
  const n = metrics.length
  if (n === 0) return "M0,0Z"
  const points = metrics.map((m, i) => {
    const angle = (i / n) * 2 * Math.PI
    const [x, y] = polarToCartesian(angle, m.value * radius)
    return `${x},${y}`
  })
  return `M${points.join("L")}Z`
}

export function SkillsRadarChart({ data = [] }: { data?: SkillMetric[] }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current || data.length === 0) return

    const wrapper = wrapperRef.current
    const svg = d3.select(svgRef.current)

    const renderChart = (size: number) => {
      svg.selectAll("*").remove()

      const margin = size * 0.18
      const radius = (size - margin * 2) / 2
      const cx = size / 2
      const cy = size / 2
      const n = data.length

      if (n === 0) return

      const g = svg.append("g").attr("transform", `translate(${cx},${cy})`)

      // ── Grid circles ────────────────────────────────────────────────
      for (let lvl = 1; lvl <= NUM_LEVELS; lvl++) {
        const r = (lvl / NUM_LEVELS) * radius
        g.append("circle")
          .attr("r", r)
          .attr("fill", "none")
          .attr("stroke", "currentColor")
          .attr("stroke-opacity", 0.08 + lvl * 0.01)
          .attr("stroke-width", 1)
          .attr("stroke-dasharray", lvl === NUM_LEVELS ? "none" : "4,4")
      }

      // ── Axis lines ──────────────────────────────────────────────────
      data.forEach((_, i) => {
        const angle = (i / n) * 2 * Math.PI
        const [x, y] = polarToCartesian(angle, radius)
        g.append("line")
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", x)
          .attr("y2", y)
          .attr("stroke", "currentColor")
          .attr("stroke-opacity", 0.12)
          .attr("stroke-width", 1)
      })

      // ── Filled polygon (animated) ───────────────────────────────────
      const polygonPath = buildPolygonPath(data, radius)

      // Ghost polygon (full) - defines total path length for stroke-dasharray
      const polygon = g.append("path")
        .attr("d", polygonPath)
        .attr("fill", "hsl(var(--primary))")
        .attr("fill-opacity", animated ? 0.18 : 0)
        .attr("stroke", "hsl(var(--primary))")
        .attr("stroke-width", 2)
        .attr("stroke-linejoin", "round")

      // Animated glow polygon
      const glowPolygon = g.append("path")
        .attr("d", polygonPath)
        .attr("fill", "none")
        .attr("stroke", "hsl(var(--accent))")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("filter", "url(#glow)")
        .attr("opacity", animated ? 0.5 : 0)

      // ── Vertex dots ─────────────────────────────────────────────────
      const dots = g.selectAll("circle.vertex")
        .data(data)
        .join("circle")
        .attr("class", "vertex")
        .attr("cx", (d, i) => polarToCartesian((i / n) * 2 * Math.PI, d.value * radius)[0])
        .attr("cy", (d, i) => polarToCartesian((i / n) * 2 * Math.PI, d.value * radius)[1])
        .attr("r", 4)
        .attr("fill", "hsl(var(--primary))")
        .attr("stroke", "hsl(var(--background))")
        .attr("stroke-width", 2)
        .attr("opacity", 0)

      // ── Labels ──────────────────────────────────────────────────────
      const labelRadius = radius + margin * 0.55

      data.forEach((d, i) => {
        const angle = (i / n) * 2 * Math.PI
        const [lx, ly] = polarToCartesian(angle, labelRadius)
        const [vx, vy] = polarToCartesian(angle, d.value * radius)

        g.append("text")
          .attr("x", lx)
          .attr("y", ly)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .attr("font-size", size < 400 ? 9 : 11)
          .attr("font-weight", "800")
          .attr("fill", "currentColor")
          .attr("fill-opacity", 0.7)
          .attr("letter-spacing", "0.08em")
          .attr("font-family", "var(--font-geist-sans, sans-serif)")
          .text(d.axis.toUpperCase())

        // Value badge near vertex
        g.append("text")
          .attr("x", vx + (vx > 0 ? 10 : -10))
          .attr("y", vy + (vy > 0 ? 10 : -5))
          .attr("text-anchor", "middle")
          .attr("font-size", size < 400 ? 7 : 9)
          .attr("font-weight", "900")
          .attr("fill", "hsl(var(--primary))")
          .attr("opacity", animated ? 1 : 0)
          .attr("class", "value-label")
          .text(d.label)
      })

      // ── SVG defs: glow filter ────────────────────────────────────────
      const defs = svg.append("defs")
      const filter = defs.append("filter").attr("id", "glow")
      filter.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "coloredBlur")
      const merge = filter.append("feMerge")
      merge.append("feMergeNode").attr("in", "coloredBlur")
      merge.append("feMergeNode").attr("in", "SourceGraphic")

      // ── GSAP ScrollTrigger → animate on enter ───────────────────────
      if (!animated) {
        ScrollTrigger.create({
          trigger: wrapper,
          start: "top 80%",
          once: true,
          onEnter: () => {
            setAnimated(true)

            // Polygon stroke-dashoffset reveal
            const pathEl = polygon.node()
            if (pathEl) {
              const len = pathEl.getTotalLength()
              d3.select(pathEl)
                .attr("stroke-dasharray", len)
                .attr("stroke-dashoffset", len)
                .transition()
                .duration(1600)
                .ease(d3.easeQuadInOut)
                .attr("stroke-dashoffset", 0)

              d3.select(pathEl)
                .transition()
                .delay(400)
                .duration(1200)
                .ease(d3.easeCubicOut)
                .attr("fill-opacity", 0.18)
            }

            // Glow polygon
            const glowEl = glowPolygon.node()
            if (glowEl) {
              const len = glowEl.getTotalLength()
              d3.select(glowEl)
                .attr("stroke-dasharray", len)
                .attr("stroke-dashoffset", len)
                .transition()
                .duration(2000)
                .ease(d3.easeQuadInOut)
                .attr("stroke-dashoffset", 0)
                .attr("opacity", 0.5)
            }

            // Vertex dots stagger
            dots
              .transition()
              .delay((_, i) => 800 + i * 80)
              .duration(400)
              .ease(d3.easeBackOut.overshoot(2))
              .attr("opacity", 1)

            // Value labels
            svg.selectAll("text.value-label")
              .transition()
              .delay((_, i) => 1200 + i * 60)
              .duration(400)
              .attr("opacity", 1)
          },
        })
      }
    }

    // Initial render
    const size = Math.min(wrapper.clientWidth, 480)
    svg.attr("width", size).attr("height", size)
    renderChart(size)

    // Responsive re-render
    const ro = new ResizeObserver(() => {
      const newSize = Math.min(wrapper.clientWidth, 480)
      svg.attr("width", newSize).attr("height", newSize)
      renderChart(newSize)
    })
    ro.observe(wrapper)

    return () => {
      ro.disconnect()
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === wrapper) t.kill()
      })
    }
  }, [animated, data])

  return (
    <div ref={wrapperRef} className="w-full flex items-center justify-center max-w-[480px] mx-auto">
      <svg
        ref={svgRef}
        className="text-foreground overflow-visible"
        aria-label="Skills proficiency radar chart"
      />
    </div>
  )
}
