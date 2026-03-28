"use client"

import { useEffect, useState } from "react"

export function PageLoadingOverlay({
  label = "LOADING",
  logs = [
    "[SYS] INITIALIZING NEURAL ENGINE",
    "[NET] ESTABLISHING UPLINK...",
    "[DB]  SYNCING DATA STREAM...",
    "[APP] MOUNTING MODULES...",
    "[OK]  PROTOCOL READY",
  ],
}: {
  label?: string
  logs?: string[]
}) {
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    const progressSchedule = [
      2, 5, 9, 14, 19, 24, 29, 34, 38, 43, 47, 51, 55, 59, 62,
      65, 68, 71, 74, 76, 78, 80, 82, 84, 86, 87, 88, 89, 90, 91,
      92, 93, 94, 95, 96, 97, 97, 98, 98, 99,
    ]

    const timers = progressSchedule.map((val, i) => {
      const delay = i * 120 + 50
      return setTimeout(() => setCounter(val), delay)
    })

    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="lo-overlay fixed inset-0 z-[9998] flex flex-col items-center justify-center overflow-hidden font-mono transition-colors duration-300">
      {/* Ambient orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full blur-[150px] pointer-events-none bg-indigo-500/[0.12]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] rounded-full blur-[100px] pointer-events-none bg-purple-500/10 animate-pulse-slow" />

      {/* Holographic grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[linear-gradient(rgba(99,102,241,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.25)_1px,transparent_1px)] bg-[length:40px_40px] [transform:perspective(500px)_rotateX(60deg)_translateY(-100px)_scale(2)]" />

      <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-2xl px-6">
        {/* Triple concentric rings + counter */}
        <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80">
          <div className="absolute inset-0 rounded-full border border-indigo-500/20 border-t-indigo-500 shadow-[0_0_40px_rgba(99,102,241,0.35)] animate-[spin_4s_linear_infinite]" />
          <div className="absolute inset-[1.5rem] rounded-full border border-purple-500/25 border-b-purple-400 border-l-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.25)] animate-[spin_3s_linear_infinite_reverse]" />
          <div className="absolute inset-[3rem] rounded-full border border-dashed border-blue-400/35 animate-[spin_8s_linear_infinite]" />
          <div className="absolute inset-[5.5rem] rounded-full bg-indigo-500/10 blur-md animate-pulse" />

          {/* Centre — animated percentage counter */}
          <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none select-none">
            <div className="flex items-end leading-none drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]">
              <span className="text-[3.5rem] md:text-[4rem] font-black tracking-tighter text-white">
                {counter.toString().padStart(2, "0")}
              </span>
              <span className="text-2xl font-black text-indigo-400/80 mb-1 ml-0.5">
                %
              </span>
            </div>
            <span className="text-[8px] tracking-[0.35em] uppercase mt-2 text-white/35">
              Syncing...
            </span>
          </div>
        </div>

        {/* Label badge */}
        <div className="flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-indigo-300">
              {label}
            </span>
          </div>
        </div>

        {/* Terminal window */}
        <div className="w-full max-w-lg border border-white/10 rounded-xl p-4 md:p-5 backdrop-blur-md shadow-2xl relative overflow-hidden bg-black/50">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span className="ml-2 text-[8px] text-white/20 tracking-widest uppercase font-bold">
              Terminal_Access_v4.2
            </span>
          </div>
          <div className="space-y-1 h-24 flex flex-col justify-end overflow-hidden mask-image-b-fade">
            {logs.map((log, i) => (
              <div key={i} className={`lo-log-line lo-log-${i + 1}`}>
                <span className="text-white/25 mr-2">&gt;_</span>{log}
              </div>
            ))}
          </div>
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent h-10 animate-scan" />
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none scanlines opacity-10" />
    </div>
  )
}

export function ContentSkeleton({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded animate-pulse bg-muted/60 mb-2"
          style={{ width: `${90 - i * 15}%` }}
        />
      ))}
    </div>
  )
}
