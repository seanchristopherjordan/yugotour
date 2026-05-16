import 'dotenv/config'
import { Client } from 'pg'

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()

  await client.query(`
    ALTER TABLE "bookings"
    ADD COLUMN IF NOT EXISTS "is_read" boolean NOT NULL DEFAULT false
  `)

  console.log('Done: added is_read column to bookings.')
  await client.end()
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
