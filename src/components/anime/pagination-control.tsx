"use client"

import { PaginationControl as SharedPaginationControl } from "@/components/shared/pagination-control"
import { type Pagination } from "@/lib/api/types"

interface PaginationControlProps {
  pagination: Pagination
  baseUrl: string
}

export function PaginationControl({ pagination, baseUrl }: PaginationControlProps) {
  return <SharedPaginationControl pagination={pagination} baseUrl={baseUrl} variant="primary" />
}
