'use client'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const RowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<{ question?: string }>()
  return <div>{data?.data?.question || `Question ${(data.rowNumber ?? 0) + 1}`}</div>
}
