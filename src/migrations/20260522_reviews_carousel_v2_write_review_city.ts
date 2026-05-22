import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`

   DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_reviews_carousel_v2_write_review_city"
     AS ENUM('belgrade', 'sarajevo');
   EXCEPTION WHEN duplicate_object THEN null;
   END $$;

   DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_reviews_carousel_v2_write_review_city"
     AS ENUM('belgrade', 'sarajevo');
   EXCEPTION WHEN duplicate_object THEN null;
   END $$;

   ALTER TABLE "pages_blocks_reviews_carousel_v2"
    ADD COLUMN IF NOT EXISTS "write_review_city"
    "enum_pages_blocks_reviews_carousel_v2_write_review_city" DEFAULT 'belgrade';

   ALTER TABLE "_pages_v_blocks_reviews_carousel_v2"
    ADD COLUMN IF NOT EXISTS "write_review_city"
    "enum__pages_v_blocks_reviews_carousel_v2_write_review_city" DEFAULT 'belgrade';

  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`

   ALTER TABLE "pages_blocks_reviews_carousel_v2"
    DROP COLUMN IF EXISTS "write_review_city";

   ALTER TABLE "_pages_v_blocks_reviews_carousel_v2"
    DROP COLUMN IF EXISTS "write_review_city";

   DROP TYPE IF EXISTS "public"."enum_pages_blocks_reviews_carousel_v2_write_review_city";
   DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_reviews_carousel_v2_write_review_city";

  `)
}
