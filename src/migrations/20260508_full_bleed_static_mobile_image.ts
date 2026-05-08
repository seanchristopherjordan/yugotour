import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`

   ALTER TABLE "pages_blocks_full_bleed_static"
    ADD COLUMN IF NOT EXISTS "image_mobile_id" integer;

   ALTER TABLE "pages_blocks_full_bleed_static"
    ADD CONSTRAINT "pages_blocks_full_bleed_static_image_mobile_id_media_id_fk"
    FOREIGN KEY ("image_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

   CREATE INDEX IF NOT EXISTS "pages_blocks_full_bleed_static_image_mobile_idx"
    ON "pages_blocks_full_bleed_static" USING btree ("image_mobile_id");

  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`

   ALTER TABLE "pages_blocks_full_bleed_static"
    DROP CONSTRAINT IF EXISTS "pages_blocks_full_bleed_static_image_mobile_id_media_id_fk";

   DROP INDEX IF EXISTS "pages_blocks_full_bleed_static_image_mobile_idx";

   ALTER TABLE "pages_blocks_full_bleed_static"
    DROP COLUMN IF EXISTS "image_mobile_id";

  `)
}
