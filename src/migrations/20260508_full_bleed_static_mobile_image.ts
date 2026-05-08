import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`

   ALTER TABLE "pages_blocks_full_bleed_static"
    ADD COLUMN IF NOT EXISTS "image_mobile_id" integer;
   DO $$ BEGIN
    ALTER TABLE "pages_blocks_full_bleed_static"
     ADD CONSTRAINT "pages_blocks_full_bleed_static_image_mobile_id_media_id_fk"
     FOREIGN KEY ("image_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION WHEN duplicate_object THEN null;
   END $$;
   CREATE INDEX IF NOT EXISTS "pages_blocks_full_bleed_static_image_mobile_idx"
    ON "pages_blocks_full_bleed_static" USING btree ("image_mobile_id");

   ALTER TABLE IF EXISTS "_pages_v_blocks_full_bleed_static"
    ADD COLUMN IF NOT EXISTS "image_mobile_id" integer;
   DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_full_bleed_static"
     ADD CONSTRAINT "_pages_v_blocks_full_bleed_static_image_mobile_id_media_id_fk"
     FOREIGN KEY ("image_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION WHEN duplicate_object THEN null;
   END $$;
   CREATE INDEX IF NOT EXISTS "_pages_v_blocks_full_bleed_static_image_mobile_idx"
    ON "_pages_v_blocks_full_bleed_static" USING btree ("image_mobile_id");

   ALTER TABLE IF EXISTS "posts_blocks_full_bleed_static"
    ADD COLUMN IF NOT EXISTS "image_mobile_id" integer;
   DO $$ BEGIN
    ALTER TABLE "posts_blocks_full_bleed_static"
     ADD CONSTRAINT "posts_blocks_full_bleed_static_image_mobile_id_media_id_fk"
     FOREIGN KEY ("image_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION WHEN duplicate_object THEN null;
   END $$;
   CREATE INDEX IF NOT EXISTS "posts_blocks_full_bleed_static_image_mobile_idx"
    ON "posts_blocks_full_bleed_static" USING btree ("image_mobile_id");

   ALTER TABLE IF EXISTS "_posts_v_blocks_full_bleed_static"
    ADD COLUMN IF NOT EXISTS "image_mobile_id" integer;
   DO $$ BEGIN
    ALTER TABLE "_posts_v_blocks_full_bleed_static"
     ADD CONSTRAINT "_posts_v_blocks_full_bleed_static_image_mobile_id_media_id_fk"
     FOREIGN KEY ("image_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION WHEN duplicate_object THEN null;
   END $$;
   CREATE INDEX IF NOT EXISTS "_posts_v_blocks_full_bleed_static_image_mobile_idx"
    ON "_posts_v_blocks_full_bleed_static" USING btree ("image_mobile_id");

  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`

   ALTER TABLE "_posts_v_blocks_full_bleed_static" DROP CONSTRAINT IF EXISTS "_posts_v_blocks_full_bleed_static_image_mobile_id_media_id_fk";
   DROP INDEX IF EXISTS "_posts_v_blocks_full_bleed_static_image_mobile_idx";
   ALTER TABLE IF EXISTS "_posts_v_blocks_full_bleed_static" DROP COLUMN IF EXISTS "image_mobile_id";

   ALTER TABLE "posts_blocks_full_bleed_static" DROP CONSTRAINT IF EXISTS "posts_blocks_full_bleed_static_image_mobile_id_media_id_fk";
   DROP INDEX IF EXISTS "posts_blocks_full_bleed_static_image_mobile_idx";
   ALTER TABLE IF EXISTS "posts_blocks_full_bleed_static" DROP COLUMN IF EXISTS "image_mobile_id";

   ALTER TABLE "_pages_v_blocks_full_bleed_static" DROP CONSTRAINT IF EXISTS "_pages_v_blocks_full_bleed_static_image_mobile_id_media_id_fk";
   DROP INDEX IF EXISTS "_pages_v_blocks_full_bleed_static_image_mobile_idx";
   ALTER TABLE IF EXISTS "_pages_v_blocks_full_bleed_static" DROP COLUMN IF EXISTS "image_mobile_id";

   ALTER TABLE "pages_blocks_full_bleed_static" DROP CONSTRAINT IF EXISTS "pages_blocks_full_bleed_static_image_mobile_id_media_id_fk";
   DROP INDEX IF EXISTS "pages_blocks_full_bleed_static_image_mobile_idx";
   ALTER TABLE "pages_blocks_full_bleed_static" DROP COLUMN IF EXISTS "image_mobile_id";

  `)
}
