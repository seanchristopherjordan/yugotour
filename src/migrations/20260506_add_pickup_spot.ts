import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "bookings"
    ADD COLUMN IF NOT EXISTS "pickup_spot" varchar
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "bookings"
    DROP COLUMN IF EXISTS "pickup_spot"
  `)
}
