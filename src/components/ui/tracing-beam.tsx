"use client";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/index";

export const TracingBeam = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [svgHeight, setSvgHeight] = useState(200);

  useEffect(() => {
    const update = () => {
      if (ref.current) {
        setSvgHeight(ref.current.offsetHeight);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div ref={ref} className={cn("relative w-full max-w-7xl mx-auto h-full", className)}>
      <div className="absolute -left-4 md:-left-20 top-3">
        <div className="ml-[27px] h-4 w-4 rounded-full border border-neutral-200 dark:border-neutral-700 shadow-sm bg-white" />
        <svg viewBox={`0 0 20 ${svgHeight}`} width="20" height={svgHeight} className="ml-4 block" aria-hidden="true">
          <path d={`M 1 0 V ${svgHeight * 0.8} l 18 24 V ${svgHeight}`} fill="none" stroke="#9091A0" strokeOpacity="0.16" />
          <path d={`M 1 0 V ${svgHeight * 0.8} l 18 24 V ${svgHeight}`} fill="none" stroke="url(#gradient)" strokeWidth="1.25" className="hidden motion-reduce:block" />
          <defs>
            <linearGradient id="gradient" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="0" y2="100">
              <stop stopColor="#18CCFC" stopOpacity="0" />
              <stop stopColor="#18CCFC" />
              <stop stopColor="#6344F5" />
              <stop stopColor="#AE48FF" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div>{children}</div>
    </div>
  );
};
