import { getSimulatorAssets } from '@/lib/getSimulatorAssets'
import { SimulatorSection } from '@/components/SimulatorSection'

interface SpacingConfig {
  top?: 'standard' | 'none' | 'custom' | null
  topCustom?: number | null
  bottom?: 'standard' | 'none' | 'custom' | null
  bottomCustom?: number | null
}

function resolveSpacing(type?: string | null, custom?: number | null): string {
  if (type === 'none') return '0'
  if (type === 'custom' && custom != null) return `${custom}rem`
  return '0'
}

interface SimulatorBlockProps {
  spacing?: SpacingConfig | null
}

export async function SimulatorBlockComponent({ spacing }: SimulatorBlockProps) {
  const assets = await getSimulatorAssets()
  const marginTop    = resolveSpacing(spacing?.top, spacing?.topCustom)
  const marginBottom = resolveSpacing(spacing?.bottom, spacing?.bottomCustom)
  const hasMargin    = marginTop !== '0' || marginBottom !== '0'

  return (
    <div style={hasMargin ? { marginTop, marginBottom } : undefined}>
      <SimulatorSection {...assets} />
    </div>
  )
}
