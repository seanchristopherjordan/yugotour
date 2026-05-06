import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`ALTER TYPE "public"."enum_email_templates_template_key" ADD VALUE IF NOT EXISTS 'booking_guest_confirmation_belgrade'`)
  await db.execute(sql`ALTER TYPE "public"."enum_email_templates_template_key" ADD VALUE IF NOT EXISTS 'booking_guest_confirmation_sarajevo'`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // PostgreSQL does not support removing enum values — no-op
}
