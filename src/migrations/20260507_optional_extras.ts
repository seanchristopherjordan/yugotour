import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`

   -- Enum for optional_extras city
   CREATE TYPE IF NOT EXISTS "public"."enum_optional_extras_city" AS ENUM('belgrade', 'sarajevo');

   -- New optional_extras collection table
   CREATE TABLE IF NOT EXISTS "optional_extras" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "city" "enum_optional_extras_city" NOT NULL,
    "price_group" varchar,
    "price_solo" varchar,
    "description" jsonb,
    "image_id" integer,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
   );

   ALTER TABLE "optional_extras"
    ADD CONSTRAINT "optional_extras_image_id_media_id_fk"
    FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

   CREATE INDEX IF NOT EXISTS "optional_extras_created_at_idx"
    ON "optional_extras" USING btree ("created_at");
   CREATE INDEX IF NOT EXISTS "optional_extras_image_idx"
    ON "optional_extras" USING btree ("image_id");

   -- Migrate tours_extras from inline fields to relationship
   -- (old inline data is discarded; extras will be re-entered via admin)
   TRUNCATE TABLE "tours_extras";
   ALTER TABLE "tours_extras" DROP COLUMN IF EXISTS "title";
   ALTER TABLE "tours_extras" DROP COLUMN IF EXISTS "price_group";
   ALTER TABLE "tours_extras" DROP COLUMN IF EXISTS "price_solo";
   ALTER TABLE "tours_extras" ADD COLUMN IF NOT EXISTS "extra_id" integer;

   ALTER TABLE "tours_extras"
    ADD CONSTRAINT "tours_extras_extra_id_optional_extras_id_fk"
    FOREIGN KEY ("extra_id") REFERENCES "public"."optional_extras"("id") ON DELETE set null ON UPDATE no action;

   CREATE INDEX IF NOT EXISTS "tours_extras_extra_id_idx"
    ON "tours_extras" USING btree ("extra_id");

   -- Register optional_extras in payload_locked_documents_rels
   ALTER TABLE "payload_locked_documents_rels"
    ADD COLUMN IF NOT EXISTS "optional_extras_id" integer;
   ALTER TABLE "payload_locked_documents_rels"
    ADD CONSTRAINT "payload_locked_documents_rels_optional_extras_id_fk"
    FOREIGN KEY ("optional_extras_id") REFERENCES "public"."optional_extras"("id") ON DELETE cascade ON UPDATE no action;
   CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_optional_extras_id_idx"
    ON "payload_locked_documents_rels" USING btree ("optional_extras_id");

  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`

   ALTER TABLE "payload_locked_documents_rels"
    DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_optional_extras_id_fk";
   ALTER TABLE "payload_locked_documents_rels"
    DROP COLUMN IF EXISTS "optional_extras_id";

   ALTER TABLE "tours_extras"
    DROP CONSTRAINT IF EXISTS "tours_extras_extra_id_optional_extras_id_fk";
   ALTER TABLE "tours_extras" DROP COLUMN IF EXISTS "extra_id";
   TRUNCATE TABLE "tours_extras";
   ALTER TABLE "tours_extras" ADD COLUMN IF NOT EXISTS "title" varchar NOT NULL DEFAULT '';
   ALTER TABLE "tours_extras" ADD COLUMN IF NOT EXISTS "price_group" varchar;
   ALTER TABLE "tours_extras" ADD COLUMN IF NOT EXISTS "price_solo" varchar;

   ALTER TABLE "optional_extras"
    DROP CONSTRAINT IF EXISTS "optional_extras_image_id_media_id_fk";
   DROP TABLE IF EXISTS "optional_extras" CASCADE;
   DROP TYPE IF EXISTS "public"."enum_optional_extras_city";

  `)
}
