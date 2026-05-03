const PROMETHEUS_URL = "https://prometheus.asepharyana.tech/api/v1"

async function fetchMetric(query: string): Promise<number> {
  try {
    const res = await fetch(`${PROMETHEUS_URL}/query?query=${encodeURIComponent(query)}`, { 
      next: { revalidate: 30 } 
    })
    const data = await res.json()
    if (data.status === "success" && data.data.result.length > 0) {
      return parseFloat(data.data.result[0].value[1])
    }
    return 0
  } catch {
    return 0
  }
}

async function fetchRangeMetric(query: string, minutes: number = 60): Promise<{ time: number; value: number }[]> {
  try {
    const end = Math.floor(Date.now() / 1000)
    const start = end - minutes * 60
    const step = Math.max(60, Math.floor(minutes * 60 / 30))
    const res = await fetch(`${PROMETHEUS_URL}/query_range?query=${encodeURIComponent(query)}&start=${start}&end=${end}&step=${step}s`, { 
      next: { revalidate: 30 } 
    })
    const data = await res.json()
    if (data.status === "success" && data.data.result.length > 0) {
      return data.data.result[0].values.map((v: [number, string]) => ({
        time: v[0] * 1000,
        value: parseFloat(v[1])
      }))
    }
    return []
  } catch {
    return []
  }
}

async function getInitialData() {
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
    fetchRangeMetric("node_load1", 60),
    fetchRangeMetric("100 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes * 100)", 60),
  ])

  return {
    metrics: {
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
    },
    history: {
      load: loadHistory,
      memory: memHistory,
    }
  }
}

export default async function DashboardPage() {
  const { metrics, history } = await getInitialData()

  const loadChartData = history.load.length > 0 
    ? history.load.map(d => ({ time: d.time, value: d.value }))
    : Array.from({ length: 30 }, (_, i) => ({ time: Date.now() - (29 - i) * 60000, value: Math.random() * 2 }))

  const memChartData = history.memory.length > 0
    ? history.memory.map(d => ({ time: d.time, value: d.value }))
    : Array.from({ length: 30 }, (_, i) => ({ time: Date.now() - (29 - i) * 60000, value: 50 + Math.random() * 20 }))

  const { DashboardClient } = await import("@/components/dashboard/dashboard-client")

  return (
    <DashboardClient 
      initialMetrics={metrics} 
      initialHistory={{ load: loadChartData, memory: memChartData }}
    />
  )
}