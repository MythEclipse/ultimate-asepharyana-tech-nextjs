"use client"

import { IconServer, IconCpu, IconCloud, IconDatabase, IconWorld, IconBrandRust, IconApi } from "@tabler/icons-react"
import { useEffect, useState, useCallback } from "react"
import { AreaChart, Area, ResponsiveContainer } from "recharts"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Section } from "@/components/ui/section"
import { Spotlight } from "@/components/ui/spotlight"

const PROMETHEUS_URL = "https://prometheus.asepharyana.tech/api/v1"

async function fetchMetric(query: string): Promise<number> {
  try {
    const res = await fetch(`${PROMETHEUS_URL}/query?query=${encodeURIComponent(query)}`)
    const data = await res.json()
    if (data.status === "success" && data.data.result.length > 0) {
      return parseFloat(data.data.result[0].value[1])
    }
    return 0
  } catch { return 0 }
}

async function fetchRangeMetric(query: string, minutes: number = 60): Promise<{ time: number; value: number }[]> {
  try {
    const end = Math.floor(Date.now() / 1000)
    const start = end - minutes * 60
    const step = Math.max(60, Math.floor(minutes * 60 / 30))
    const res = await fetch(`${PROMETHEUS_URL}/query_range?query=${encodeURIComponent(query)}&start=${start}&end=${end}&step=${step}s`)
    const data = await res.json()
    if (data.status === "success" && data.data.result.length > 0) {
      return data.data.result[0].values.map((v: [number, string]) => ({ time: v[0] * 1000, value: parseFloat(v[1]) }))
    }
    return []
  } catch { return [] }
}

function formatBytesClient(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

function formatNumberClient(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
  if (num >= 1000) return (num / 1000).toFixed(1) + "K"
  return num.toFixed(0)
}

type TimeRange = "15m" | "30m" | "1h" | "3h" | "6h" | "12h" | "24h"

const TIME_RANGES: { label: string; value: TimeRange; minutes: number }[] = [
  { label: "15m", value: "15m", minutes: 15 },
  { label: "30m", value: "30m", minutes: 30 },
  { label: "1h", value: "1h", minutes: 60 },
  { label: "3h", value: "3h", minutes: 180 },
  { label: "6h", value: "6h", minutes: 360 },
  { label: "12h", value: "12h", minutes: 720 },
  { label: "24h", value: "24h", minutes: 1440 },
]

interface DashboardClientProps {
  initialMetrics: {
    load1: number
    memoryUsed: number
    memoryTotal: number
    redisClients: number
    redisMemory: number
    minioNodes: number
    traefikRequests: number
    elysiaRequests: number
    elysiaMemory: number
    rustRequests: number
    rustActive: number
  }
  initialHistory: {
    load: { time: number; value: number }[]
    memory: { time: number; value: number }[]
  }
}

export function DashboardClient({ initialMetrics, initialHistory }: DashboardClientProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("1h")
  const [metrics, setMetrics] = useState(initialMetrics)
  const [history, setHistory] = useState(initialHistory)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  const loadMetrics = useCallback(async () => {
    const range = TIME_RANGES.find(r => r.value === timeRange)?.minutes || 60
    
    const [load1, memUsed, memTotal, redisClients, redisMemory, minioNodes, traefikRequests, elysiaRequests, elysiaMemory, rustRequests, rustActive, loadHistory, memHistory] = await Promise.all([
      fetchMetric("node_load1"),
      fetchMetric("node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes"),
      fetchMetric("node_memory_MemTotal_bytes"),
      fetchMetric("redis_connected_clients"),
      fetchMetric("redis_memory_used_bytes"),
      fetchMetric("minio_cluster_nodes_online_total"),
      fetchMetric("sum(traefik_entrypoint_requests_total)"),
      fetchMetric("sum(elysia_http_requests_total)"),
      fetchMetric("sum(elysia_nodejs_heap_size_used_bytes)"),
      fetchMetric("sum(axum_http_requests_total)"),
      fetchMetric("axum_http_requests_pending"),
      fetchRangeMetric("node_load1", range),
      fetchRangeMetric("100 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes * 100)", range),
    ])

    setMetrics({
      load1,
      memoryUsed: memUsed,
      memoryTotal: memTotal,
      redisClients,
      redisMemory,
      minioNodes,
      traefikRequests,
      elysiaRequests,
      elysiaMemory,
      rustRequests,
      rustActive,
    })
    setHistory({ load: loadHistory, memory: memHistory })
    setLastUpdate(new Date())
  }, [timeRange])

  useEffect(function loadData() {
    loadMetrics()
    const interval = setInterval(loadMetrics, 10000)
    return () => clearInterval(interval)
  }, [loadMetrics])

  const memPercent = metrics.memoryTotal > 0 
    ? ((metrics.memoryUsed / metrics.memoryTotal) * 100).toFixed(1)
    : "0"

  return (
    <main className="min-h-screen relative overflow-hidden">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="var(--color-primary)" />
      
      <Section className="pt-24 pb-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
               <Badge variant="glow" className="px-4 py-1 uppercase text-[10px] font-black tracking-[0.2em]">
                 System Monitor
               </Badge>
               <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
               </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tightest text-foreground leading-[0.9]">
              REAL-TIME <span className="text-gradient">STATS</span>
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              Last updated: {lastUpdate.toLocaleTimeString()} • Auto-refresh: 10s
            </p>
          </div>

          <div className="flex items-center gap-2 bg-card/50 backdrop-blur-md p-1.5 rounded-2xl border border-border/10">
            {TIME_RANGES.map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  timeRange === range.value
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="lg:col-span-2 p-6 relative overflow-hidden bg-gradient-to-br from-blue-500/5 to-transparent">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <IconCpu size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">CPU Load</p>
                  <p className="text-3xl font-black tracking-tight text-foreground">{metrics.load1.toFixed(2)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-black uppercase text-muted-foreground/50">1m avg</p>
                <p className="text-sm font-black text-blue-400">{metrics.load1.toFixed(2)}</p>
              </div>
            </div>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history.load}>
                  <defs>
                    <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5}/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fill="url(#loadGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="lg:col-span-2 p-6 relative overflow-hidden bg-gradient-to-br from-purple-500/5 to-transparent">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <IconDatabase size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Memory</p>
                  <p className="text-3xl font-black tracking-tight text-foreground">{memPercent}%</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-black uppercase text-muted-foreground/50">Used</p>
                <p className="text-sm font-black text-purple-400">{formatBytesClient(metrics.memoryUsed)}</p>
              </div>
            </div>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history.memory}>
                  <defs>
                    <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity={0.5}/>
                      <stop offset="100%" stopColor="#a855f7" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="#a855f7" strokeWidth={2} fill="url(#memGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="p-4 bg-gradient-to-br from-emerald-500/5 to-transparent">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2">HTTP Requests</p>
            <p className="text-2xl font-black tracking-tight text-foreground">{formatNumberClient(metrics.traefikRequests)}</p>
            <p className="text-[8px] text-muted-foreground">Traefik Total</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-cyan-500/5 to-transparent">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2">Elysia API</p>
            <p className="text-2xl font-black tracking-tight text-foreground">{formatNumberClient(metrics.elysiaRequests)}</p>
            <p className="text-[8px] text-muted-foreground">Total Requests</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-orange-500/5 to-transparent">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2">Rust API</p>
            <p className="text-2xl font-black tracking-tight text-foreground">{formatNumberClient(metrics.rustRequests)}</p>
            <p className="text-[8px] text-muted-foreground">Total Requests</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-amber-500/5 to-transparent">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2">MinIO</p>
            <p className="text-2xl font-black tracking-tight text-foreground">{metrics.minioNodes}</p>
            <p className="text-[8px] text-muted-foreground">Nodes Online</p>
          </Card>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
              <IconServer size={18} />
            </div>
            <h2 className="text-lg font-black uppercase tracking-tight">Services</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4 hover:border-red-500/40 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400">
                <IconDatabase size={16} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase">Redis</h3>
                <p className="text-[8px] font-bold text-emerald-400 uppercase">Online</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-muted/10">
                <p className="text-[8px] text-muted-foreground/50 uppercase">Clients</p>
                <p className="font-black">{metrics.redisClients}</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/10">
                <p className="text-[8px] text-muted-foreground/50 uppercase">Memory</p>
                <p className="font-black">{formatBytesClient(metrics.redisMemory)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:border-amber-500/40 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                <IconCloud size={16} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase">MinIO</h3>
                <p className="text-[8px] font-bold text-emerald-400 uppercase">Online</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-muted/10">
                <p className="text-[8px] text-muted-foreground/50 uppercase">Nodes</p>
                <p className="font-black">{metrics.minioNodes}</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/10">
                <p className="text-[8px] text-muted-foreground/50 uppercase">Status</p>
                <p className="font-black text-emerald-400">Ready</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:border-cyan-500/40 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                <IconWorld size={16} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase">Traefik</h3>
                <p className="text-[8px] font-bold text-emerald-400 uppercase">Online</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-muted/10">
                <p className="text-[8px] text-muted-foreground/50 uppercase">Requests</p>
                <p className="font-black">{formatNumberClient(metrics.traefikRequests)}</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/10">
                <p className="text-[8px] text-muted-foreground/50 uppercase">Entry</p>
                <p className="font-black">HTTPS</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:border-indigo-500/40 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <IconApi size={16} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase">Elysia</h3>
                <p className="text-[8px] font-bold text-emerald-400 uppercase">Online</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-muted/10">
                <p className="text-[8px] text-muted-foreground/50 uppercase">Requests</p>
                <p className="font-black">{formatNumberClient(metrics.elysiaRequests)}</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/10">
                <p className="text-[8px] text-muted-foreground/50 uppercase">Memory</p>
                <p className="font-black">{formatBytesClient(metrics.elysiaMemory)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:border-orange-500/40 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                <IconBrandRust size={16} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase">Rust</h3>
                <p className="text-[8px] font-bold text-emerald-400 uppercase">Online</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-muted/10">
                <p className="text-[8px] text-muted-foreground/50 uppercase">Requests</p>
                <p className="font-black">{formatNumberClient(metrics.rustRequests)}</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/10">
                <p className="text-[8px] text-muted-foreground/50 uppercase">Pending</p>
                <p className="font-black">{metrics.rustActive}</p>
              </div>
            </div>
          </Card>
        </div>
      </Section>
    </main>
  )
}