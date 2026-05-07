import { getSimulatorAssets } from '@/lib/getSimulatorAssets'
import { SimulatorSection } from '@/components/SimulatorSection'

export async function SimulatorBlockComponent() {
  const assets = await getSimulatorAssets()
  return <SimulatorSection {...assets} />
}
