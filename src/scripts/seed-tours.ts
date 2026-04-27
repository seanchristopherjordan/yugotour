import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../../src/payload.config'
import { seedTours } from '../endpoints/seed/tours'

async function run() {
  const payload = await getPayload({ config })

  // Local scripts don't have a real request; pass a minimal stub
  await seedTours({ payload, req: {} as Parameters<typeof seedTours>[0]['req'] })

  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
