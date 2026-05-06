import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── 1. pages.hero_type — change enum to only 'none' | 'pageHero' ──────────
  // Postgres cannot remove enum values directly; must go through text.
  await db.execute(sql`ALTER TABLE "pages" ALTER COLUMN "hero_type" DROP DEFAULT`)

  await db.execute(sql`
    UPDATE "pages"
    SET "hero_type" = 'none'
    WHERE "hero_type"::text NOT IN ('none', 'pageHero')
  `)

  await db.execute(sql`
    ALTER TABLE "pages"
    ALTER COLUMN "hero_type" SET DATA TYPE text
    USING "hero_type"::text
  `)

  // ── 2. _pages_v.version_hero_type ─────────────────────────────────────────
  await db.execute(sql`ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" DROP DEFAULT`)

  await db.execute(sql`
    UPDATE "_pages_v"
    SET "version_hero_type" = 'none'
    WHERE "version_hero_type"::text NOT IN ('none', 'pageHero')
  `)

  await db.execute(sql`
    ALTER TABLE "_pages_v"
    ALTER COLUMN "version_hero_type" SET DATA TYPE text
    USING "version_hero_type"::text
  `)

  // ── 3. Drop old enums ──────────────────────────────────────────────────────
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_pages_hero_type"`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum__pages_v_version_hero_type"`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_pages_hero_links_link_type"`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_pages_hero_links_link_appearance"`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum__pages_v_version_hero_links_link_type"`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum__pages_v_version_hero_links_link_appearance"`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_payload_folders_folder_type"`)

  // ── 4. Create new enums with only the current values ──────────────────────
  await db.execute(sql`
    CREATE TYPE "public"."enum_pages_hero_type"
    AS ENUM('none', 'pageHero')
  `)
  await db.execute(sql`
    CREATE TYPE "public"."enum__pages_v_version_hero_type"
    AS ENUM('none', 'pageHero')
  `)

  // ── 5. Restore column types using text cast ────────────────────────────────
  await db.execute(sql`
    ALTER TABLE "pages"
    ALTER COLUMN "hero_type"
    SET DATA TYPE "public"."enum_pages_hero_type"
    USING "hero_type"::"public"."enum_pages_hero_type"
  `)
  await db.execute(sql`
    ALTER TABLE "pages"
    ALTER COLUMN "hero_type" SET DEFAULT 'none'
  `)

  await db.execute(sql`
    ALTER TABLE "_pages_v"
    ALTER COLUMN "version_hero_type"
    SET DATA TYPE "public"."enum__pages_v_version_hero_type"
    USING "version_hero_type"::"public"."enum__pages_v_version_hero_type"
  `)
  await db.execute(sql`
    ALTER TABLE "_pages_v"
    ALTER COLUMN "version_hero_type" SET DEFAULT 'none'
  `)

  // ── 6. Drop legacy hero columns ────────────────────────────────────────────
  await db.execute(sql`ALTER TABLE "pages" DROP COLUMN IF EXISTS "hero_rich_text"`)
  await db.execute(sql`ALTER TABLE "pages" DROP COLUMN IF EXISTS "hero_media_id"`)
  await db.execute(sql`ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_hero_rich_text"`)
  await db.execute(sql`ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_hero_media_id"`)

  // ── 7. Drop legacy hero links tables ──────────────────────────────────────
  await db.execute(sql`DROP TABLE IF EXISTS "pages_hero_links"`)
  await db.execute(sql`DROP TABLE IF EXISTS "_pages_v_version_hero_links"`)

  // ── 8. Drop folder_id from media ──────────────────────────────────────────
  await db.execute(sql`ALTER TABLE "media" DROP COLUMN IF EXISTS "folder_id"`)

  // ── 9. Drop orphaned media_id from _rels tables ───────────────────────────
  // These tracked the old hero media relationship field (now removed).
  await db.execute(sql`ALTER TABLE "pages_rels" DROP COLUMN IF EXISTS "media_id"`)
  await db.execute(sql`ALTER TABLE "_pages_v_rels" DROP COLUMN IF EXISTS "media_id"`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Intentionally left empty — restoring removed enum values/columns is
  // not safe without the original data.
}
