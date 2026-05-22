import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`

   ALTER TABLE "site_settings"
    ADD COLUMN IF NOT EXISTS "site_default_og_image_id" integer;
   DO $$ BEGIN
    ALTER TABLE "site_settings"
     ADD CONSTRAINT "site_settings_site_default_og_image_id_media_id_fk"
     FOREIGN KEY ("site_default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION WHEN duplicate_object THEN null;
   END $$;
   CREATE INDEX IF NOT EXISTS "site_settings_site_default_og_image_idx"
    ON "site_settings" USING btree ("site_default_og_image_id");

  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`

   ALTER TABLE "site_settings" DROP CONSTRAINT IF EXISTS "site_settings_site_default_og_image_id_media_id_fk";
   DROP INDEX IF EXISTS "site_settings_site_default_og_image_idx";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "site_default_og_image_id";

  `)
}
