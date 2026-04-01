"use client"

import { useParams } from "next/navigation"

type ParamValue = string | string[] | undefined

function normalizeParamValue(value: ParamValue): string {
  if (Array.isArray(value)) {
    return value[0] ?? ""
  }
  return value ?? ""
}

export function parsePageParam(value: ParamValue, fallback = 1): number {
  const normalized = normalizeParamValue(value)
  const parsed = Number.parseInt(normalized, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export function parseSlugParam(value: ParamValue): string {
  return normalizeParamValue(value).trim()
}

export function useRouteParam(paramName: string): string {
  const params = useParams()
  return normalizeParamValue(params?.[paramName] as ParamValue)
}