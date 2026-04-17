'use client'

import dynamic from 'next/dynamic'

const CDSSimulator = dynamic(() => import('./CDSSimulator'), { ssr: false })

export type SimulatorType = 'cds'

interface SimulatorSlotProps {
  type: SimulatorType
}

export function SimulatorSlot({ type }: SimulatorSlotProps) {
  if (type === 'cds') return <CDSSimulator />
  return null
}
