"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"
import { type GitHubContribution } from "@/lib/api/github"

const CELL_SIZE = 11
const CELL_PAD = 2
const WEEK_DAYS = 7

export function ActivityHeatmap({ data = [] }: { data?: GitHubContribution[] }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current || data.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    // Parse dates and ensure counts are numbers
    const parsedData = data.map(d => ({
      ...d,
      date: new Date(d.date),
      count: Number(d.count)
    }))

    const maxCount = d3.max(parsedData, (d) => d.count) || 10

    // Color scale: transparent → primary
    const colorScale = d3.scaleSequential()
      .domain([0, maxCount])
      .interpolator(t => {
        const alpha = t === 0 ? 0.05 : 0.15 + t * 0.85
        return `hsla(var(--primary), ${alpha})`
      })

    // Build week groups
    const startDate = parsedData[0].date
    const endDate = parsedData[parsedData.length - 1].date
    const weeks = d3.timeWeeks(startDate, endDate)
    const numWeeks = weeks.length

    const totalW = numWeeks * (CELL_SIZE + CELL_PAD)
    const totalH = WEEK_DAYS * (CELL_SIZE + CELL_PAD) + 28

    svg.attr("width", totalW).attr("height", totalH)

    const g = svg.append("g").attr("transform", `translate(0,20)`)

    // Draw cells
    const allDays = parsedData.map((d) => {
      const weekIndex = d3.timeWeek.count(startDate, d.date)
      const dayIndex = d.date.getDay()
      return { ...d, week: weekIndex, day: dayIndex }
    })

    const cells = g.selectAll("rect.cell")
      .data(allDays)
      .join("rect")
      .attr("class", "cell")
      .attr("x", (d) => d.week * (CELL_SIZE + CELL_PAD))
      .attr("y", (d) => d.day * (CELL_SIZE + CELL_PAD))
      .attr("width", CELL_SIZE)
      .attr("height", CELL_SIZE)
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("fill", "hsla(var(--primary), 0.04)")
      .attr("stroke", "hsla(var(--foreground), 0.05)")
      .attr("stroke-width", 0.5)

    cells
      .transition()
      .delay((d) => d.week * 2 + d.day * 0.5)
      .duration(300)
      .ease(d3.easeQuadOut)
      .attr("fill", (d) => colorScale(d.count))

    cells.append("title").text((d) => {
      const fmt = d3.timeFormat("%b %d, %Y")(d.date)
      return `${fmt}: ${d.count} contributions`
    })

    // Month labels
    const monthFormat = d3.timeFormat("%b")
    const months = d3.timeMonths(startDate, endDate)
    g.selectAll("text.month")
      .data(months)
      .join("text")
      .attr("class", "month")
      .attr("x", (d) => d3.timeWeek.count(startDate, d) * (CELL_SIZE + CELL_PAD))
      .attr("y", -6)
      .attr("font-size", 9)
      .attr("font-weight", "700")
      .attr("fill", "currentColor")
      .attr("fill-opacity", 0.4)
      .text((d) => monthFormat(d).toUpperCase())

    return () => {
      // Cleanup
    }
  }, [data])

  return (
    <div ref={wrapperRef} className="w-full overflow-x-auto">
      <svg
        ref={svgRef}
        className="text-foreground min-w-[600px]"
        aria-label="GitHub activity heatmap"
      />
    </div>
  )
}
