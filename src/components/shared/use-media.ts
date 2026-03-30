"use client"

import { useQuery } from "@tanstack/react-query"
import { type Pagination } from "@/lib/api/types"

export function useMediaListData<T>(queryKey: readonly unknown[], fetchFn: () => Promise<{ data: T[]; pagination: Pagination }>) {
  return useQuery<{ data: T[]; pagination: Pagination }, Error>({
    queryKey,
    queryFn: fetchFn,
  })
}

export function useMediaSearch<T>(queryKey: readonly unknown[], fetchFn: () => Promise<T>, enabled: boolean) {
  return useQuery<T, Error>({
    queryKey,
    queryFn: fetchFn,
    enabled,
  })
}
