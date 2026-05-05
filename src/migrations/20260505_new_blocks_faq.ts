import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   -- New enum types for TextContainer image position
   CREATE TYPE "public"."enum_pages_blocks_text_container_image_position" AS ENUM('none', 'left', 'right', 'full');
   CREATE TYPE "public"."enum__pages_v_blocks_text_container_image_position" AS ENUM('none', 'left', 'right', 'full');
   CREATE TYPE "public"."enum_posts_blocks_text_container_image_position" AS ENUM('none', 'left', 'right', 'full');
   CREATE TYPE "public"."enum__posts_v_blocks_text_container_image_position" AS ENUM('none', 'left', 'right', 'full');

   -- New enum types for VideoEmbed position
   CREATE TYPE "public"."enum_pages_blocks_video_embed_position" AS ENUM('full', 'left', 'right');
   CREATE TYPE "public"."enum__pages_v_blocks_video_embed_position" AS ENUM('full', 'left', 'right');
   CREATE TYPE "public"."enum_posts_blocks_video_embed_position" AS ENUM('full', 'left', 'right');
   CREATE TYPE "public"."enum__posts_v_blocks_video_embed_position" AS ENUM('full', 'left', 'right');

   -- Add 'pageHero' to existing hero type enums
   ALTER TYPE "public"."enum_pages_hero_type" ADD VALUE IF NOT EXISTS 'pageHero';
   ALTER TYPE "public"."enum__pages_v_version_hero_type" ADD VALUE IF NOT EXISTS 'pageHero';

   -- Sliders collection tables
   CREATE TABLE IF NOT EXISTS "sliders" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
   );
   CREATE TABLE IF NOT EXISTS "sliders_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "media_id" integer
   );

   -- Pages block tables
   CREATE TABLE IF NOT EXISTS "pages_blocks_text_container" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "content" jsonb,
    "image_media_id" integer,
    "image_position" "enum_pages_blocks_text_container_image_position" DEFAULT 'none',
    "image_caption" varchar,
    "block_name" varchar
   );
   CREATE TABLE IF NOT EXISTS "pages_blocks_full_bleed_parallax" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "image_id" integer,
    "block_name" varchar
   );
   CREATE TABLE IF NOT EXISTS "pages_blocks_full_bleed_static" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "image_id" integer,
    "caption" varchar,
    "block_name" varchar
   );
   CREATE TABLE IF NOT EXISTS "pages_blocks_image_carousel" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "slider_id" integer,
    "block_name" varchar
   );
   CREATE TABLE IF NOT EXISTS "pages_blocks_faq_block" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar,
    "block_name" varchar
   );
   CREATE TABLE IF NOT EXISTS "pages_blocks_video_embed" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "youtube_url" varchar,
    "position" "enum_pages_blocks_video_embed_position" DEFAULT 'full',
    "caption" varchar,
    "block_name" varchar
   );

   -- _pages_v block tables (version history)
   CREATE TABLE IF NOT EXISTS "_pages_v_blocks_text_container" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "content" jsonb,
    "image_media_id" integer,
    "image_position" "enum__pages_v_blocks_text_container_image_position" DEFAULT 'none',
    "image_caption" varchar,
    "_uuid" varchar,
    "block_name" varchar
   );
   CREATE TABLE IF NOT EXISTS "_pages_v_blocks_full_bleed_parallax" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "image_id" integer,
    "_uuid" varchar,
    "block_name" varchar
   );
   CREATE TABLE IF NOT EXISTS "_pages_v_blocks_full_bleed_static" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "image_id" integer,
    "caption" varchar,
    "_uuid" varchar,
    "block_name" varchar
   );
   CREATE TABLE IF NOT EXISTS "_pages_v_blocks_image_carousel" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "slider_id" integer,
    "_uuid" varchar,
    "block_name" varchar
   );
   CREATE TABLE IF NOT EXISTS "_pages_v_blocks_faq_block" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "label" varchar,
    "_uuid" varchar,
    "block_name" varchar
   );
   CREATE TABLE IF NOT EXISTS "_pages_v_blocks_video_embed" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "youtube_url" varchar,
    "position" "enum__pages_v_blocks_video_embed_position" DEFAULT 'full',
    "caption" varchar,
    "_uuid" varchar,
    "block_name" varchar
   );

   -- Posts block tables
   CREATE TABLE IF NOT EXISTS "posts_blocks_text_container" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "content" jsonb,
    "image_media_id" integer,
    "image_position" "enum_posts_blocks_text_container_image_position" DEFAULT 'none',
    "image_caption" varchar,
    "block_name" varchar
   );
   CREATE TABLE IF NOT EXISTS "posts_blocks_full_bleed_parallax" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "image_id" integer,
    "block_name" varchar
   );
   CREATE TABLE IF NOT EXISTS "posts_blocks_full_bleed_static" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "image_id" integer,
    "caption" varchar,
    "block_name" varchar
   );
   CREATE TABLE IF NOT EXISTS "posts_blocks_image_carousel" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "slider_id" integer,
    "block_name" varchar
   );
   CREATE TABLE IF NOT EXISTS "posts_blocks_faq_block" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar,
    "block_name" varchar
   );
   CREATE TABLE IF NOT EXISTS "posts_blocks_video_embed" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "youtube_url" varchar,
    "position" "enum_posts_blocks_video_embed_position" DEFAULT 'full',
    "caption" varchar,
    "block_name" varchar
   );
   CREATE TABLE IF NOT EXISTS "posts_blocks_media_block" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "media_id" integer,
    "block_name" varchar
   );

   -- _posts_v block tables (version history)
   CREATE TABLE IF NOT EXISTS "_posts_v_blocks_text_container" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "content" jsonb,
    "image_media_id" integer,
    "image_position" "enum__posts_v_blocks_text_container_image_position" DEFAULT 'none',
    "image_caption" varchar,
    "_uuid" varchar,
    "block_name" varchar
   );
   CREATE TABLE IF NOT EXISTS "_posts_v_blocks_full_bleed_parallax" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "image_id" integer,
    "_uuid" varchar,
    "block_name" varchar
   );
   CREATE TABLE IF NOT EXISTS "_posts_v_blocks_full_bleed_static" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "image_id" integer,
    "caption" varchar,
    "_uuid" varchar,
    "block_name" varchar
   );
   CREATE TABLE IF NOT EXISTS "_posts_v_blocks_image_carousel" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "slider_id" integer,
    "_uuid" varchar,
    "block_name" varchar
   );
   CREATE TABLE IF NOT EXISTS "_posts_v_blocks_faq_block" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "label" varchar,
    "_uuid" varchar,
    "block_name" varchar
   );
   CREATE TABLE IF NOT EXISTS "_posts_v_blocks_video_embed" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "youtube_url" varchar,
    "position" "enum__posts_v_blocks_video_embed_position" DEFAULT 'full',
    "caption" varchar,
    "_uuid" varchar,
    "block_name" varchar
   );
   CREATE TABLE IF NOT EXISTS "_posts_v_blocks_media_block" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "media_id" integer,
    "_uuid" varchar,
    "block_name" varchar
   );

   -- FAQ global tables
   CREATE TABLE IF NOT EXISTS "globals_faq" (
    "id" serial PRIMARY KEY NOT NULL,
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
   );
   CREATE TABLE IF NOT EXISTS "globals_faq_items" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "question" varchar,
    "answer" jsonb
   );

   -- Add pageHero fields to pages table
   ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_hero_headline" varchar;
   ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_hero_image_id" integer;
   ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_hero_image_mobile_id" integer;

   -- Add pageHero fields to _pages_v table
   ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_hero_hero_headline" varchar;
   ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_hero_hero_image_id" integer;
   ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_hero_hero_image_mobile_id" integer;

   -- Add sliders_id to payload_locked_documents_rels
   ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "sliders_id" integer;

   -- Foreign key constraints: sliders_rels
   ALTER TABLE "sliders_rels" ADD CONSTRAINT "sliders_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."sliders"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "sliders_rels" ADD CONSTRAINT "sliders_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;

   -- Foreign key constraints: pages_blocks_text_container
   ALTER TABLE "pages_blocks_text_container" ADD CONSTRAINT "pages_blocks_text_container_image_media_id_media_id_fk" FOREIGN KEY ("image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "pages_blocks_text_container" ADD CONSTRAINT "pages_blocks_text_container_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;

   -- Foreign key constraints: pages_blocks_full_bleed_parallax
   ALTER TABLE "pages_blocks_full_bleed_parallax" ADD CONSTRAINT "pages_blocks_full_bleed_parallax_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "pages_blocks_full_bleed_parallax" ADD CONSTRAINT "pages_blocks_full_bleed_parallax_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;

   -- Foreign key constraints: pages_blocks_full_bleed_static
   ALTER TABLE "pages_blocks_full_bleed_static" ADD CONSTRAINT "pages_blocks_full_bleed_static_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "pages_blocks_full_bleed_static" ADD CONSTRAINT "pages_blocks_full_bleed_static_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;

   -- Foreign key constraints: pages_blocks_image_carousel
   ALTER TABLE "pages_blocks_image_carousel" ADD CONSTRAINT "pages_blocks_image_carousel_slider_id_sliders_id_fk" FOREIGN KEY ("slider_id") REFERENCES "public"."sliders"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "pages_blocks_image_carousel" ADD CONSTRAINT "pages_blocks_image_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;

   -- Foreign key constraints: pages_blocks_faq_block
   ALTER TABLE "pages_blocks_faq_block" ADD CONSTRAINT "pages_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;

   -- Foreign key constraints: pages_blocks_video_embed
   ALTER TABLE "pages_blocks_video_embed" ADD CONSTRAINT "pages_blocks_video_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;

   -- Foreign key constraints: _pages_v_blocks_text_container
   ALTER TABLE "_pages_v_blocks_text_container" ADD CONSTRAINT "_pages_v_blocks_text_container_image_media_id_media_id_fk" FOREIGN KEY ("image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "_pages_v_blocks_text_container" ADD CONSTRAINT "_pages_v_blocks_text_container_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;

   -- Foreign key constraints: _pages_v_blocks_full_bleed_parallax
   ALTER TABLE "_pages_v_blocks_full_bleed_parallax" ADD CONSTRAINT "_pages_v_blocks_full_bleed_parallax_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "_pages_v_blocks_full_bleed_parallax" ADD CONSTRAINT "_pages_v_blocks_full_bleed_parallax_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;

   -- Foreign key constraints: _pages_v_blocks_full_bleed_static
   ALTER TABLE "_pages_v_blocks_full_bleed_static" ADD CONSTRAINT "_pages_v_blocks_full_bleed_static_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "_pages_v_blocks_full_bleed_static" ADD CONSTRAINT "_pages_v_blocks_full_bleed_static_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;

   -- Foreign key constraints: _pages_v_blocks_image_carousel
   ALTER TABLE "_pages_v_blocks_image_carousel" ADD CONSTRAINT "_pages_v_blocks_image_carousel_slider_id_sliders_id_fk" FOREIGN KEY ("slider_id") REFERENCES "public"."sliders"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "_pages_v_blocks_image_carousel" ADD CONSTRAINT "_pages_v_blocks_image_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;

   -- Foreign key constraints: _pages_v_blocks_faq_block
   ALTER TABLE "_pages_v_blocks_faq_block" ADD CONSTRAINT "_pages_v_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;

   -- Foreign key constraints: _pages_v_blocks_video_embed
   ALTER TABLE "_pages_v_blocks_video_embed" ADD CONSTRAINT "_pages_v_blocks_video_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;

   -- Foreign key constraints: posts_blocks_text_container
   ALTER TABLE "posts_blocks_text_container" ADD CONSTRAINT "posts_blocks_text_container_image_media_id_media_id_fk" FOREIGN KEY ("image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "posts_blocks_text_container" ADD CONSTRAINT "posts_blocks_text_container_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;

   -- Foreign key constraints: posts_blocks_full_bleed_parallax
   ALTER TABLE "posts_blocks_full_bleed_parallax" ADD CONSTRAINT "posts_blocks_full_bleed_parallax_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "posts_blocks_full_bleed_parallax" ADD CONSTRAINT "posts_blocks_full_bleed_parallax_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;

   -- Foreign key constraints: posts_blocks_full_bleed_static
   ALTER TABLE "posts_blocks_full_bleed_static" ADD CONSTRAINT "posts_blocks_full_bleed_static_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "posts_blocks_full_bleed_static" ADD CONSTRAINT "posts_blocks_full_bleed_static_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;

   -- Foreign key constraints: posts_blocks_image_carousel
   ALTER TABLE "posts_blocks_image_carousel" ADD CONSTRAINT "posts_blocks_image_carousel_slider_id_sliders_id_fk" FOREIGN KEY ("slider_id") REFERENCES "public"."sliders"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "posts_blocks_image_carousel" ADD CONSTRAINT "posts_blocks_image_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;

   -- Foreign key constraints: posts_blocks_faq_block
   ALTER TABLE "posts_blocks_faq_block" ADD CONSTRAINT "posts_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;

   -- Foreign key constraints: posts_blocks_video_embed
   ALTER TABLE "posts_blocks_video_embed" ADD CONSTRAINT "posts_blocks_video_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;

   -- Foreign key constraints: posts_blocks_media_block
   ALTER TABLE "posts_blocks_media_block" ADD CONSTRAINT "posts_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "posts_blocks_media_block" ADD CONSTRAINT "posts_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;

   -- Foreign key constraints: _posts_v block tables
   ALTER TABLE "_posts_v_blocks_text_container" ADD CONSTRAINT "_posts_v_blocks_text_container_image_media_id_media_id_fk" FOREIGN KEY ("image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "_posts_v_blocks_text_container" ADD CONSTRAINT "_posts_v_blocks_text_container_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "_posts_v_blocks_full_bleed_parallax" ADD CONSTRAINT "_posts_v_blocks_full_bleed_parallax_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "_posts_v_blocks_full_bleed_parallax" ADD CONSTRAINT "_posts_v_blocks_full_bleed_parallax_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "_posts_v_blocks_full_bleed_static" ADD CONSTRAINT "_posts_v_blocks_full_bleed_static_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "_posts_v_blocks_full_bleed_static" ADD CONSTRAINT "_posts_v_blocks_full_bleed_static_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "_posts_v_blocks_image_carousel" ADD CONSTRAINT "_posts_v_blocks_image_carousel_slider_id_sliders_id_fk" FOREIGN KEY ("slider_id") REFERENCES "public"."sliders"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "_posts_v_blocks_image_carousel" ADD CONSTRAINT "_posts_v_blocks_image_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "_posts_v_blocks_faq_block" ADD CONSTRAINT "_posts_v_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "_posts_v_blocks_video_embed" ADD CONSTRAINT "_posts_v_blocks_video_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "_posts_v_blocks_media_block" ADD CONSTRAINT "_posts_v_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "_posts_v_blocks_media_block" ADD CONSTRAINT "_posts_v_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;

   -- Foreign key constraints: globals_faq_items
   ALTER TABLE "globals_faq_items" ADD CONSTRAINT "globals_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."globals_faq"("id") ON DELETE cascade ON UPDATE no action;

   -- Foreign key constraints: pages hero new columns
   ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_hero_image_id_media_id_fk" FOREIGN KEY ("hero_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_hero_image_mobile_id_media_id_fk" FOREIGN KEY ("hero_hero_image_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

   -- Foreign key constraints: _pages_v hero new columns
   ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_hero_image_mobile_id_media_id_fk" FOREIGN KEY ("version_hero_hero_image_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

   -- Foreign key constraints: payload_locked_documents_rels
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sliders_fk" FOREIGN KEY ("sliders_id") REFERENCES "public"."sliders"("id") ON DELETE cascade ON UPDATE no action;

   -- Indexes: sliders
   CREATE INDEX IF NOT EXISTS "sliders_updated_at_idx" ON "sliders" USING btree ("updated_at");
   CREATE INDEX IF NOT EXISTS "sliders_created_at_idx" ON "sliders" USING btree ("created_at");
   CREATE INDEX IF NOT EXISTS "sliders_rels_order_idx" ON "sliders_rels" USING btree ("order");
   CREATE INDEX IF NOT EXISTS "sliders_rels_parent_idx" ON "sliders_rels" USING btree ("parent_id");
   CREATE INDEX IF NOT EXISTS "sliders_rels_path_idx" ON "sliders_rels" USING btree ("path");
   CREATE INDEX IF NOT EXISTS "sliders_rels_media_id_idx" ON "sliders_rels" USING btree ("media_id");

   -- Indexes: pages_blocks_text_container
   CREATE INDEX IF NOT EXISTS "pages_blocks_text_container_order_idx" ON "pages_blocks_text_container" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "pages_blocks_text_container_parent_id_idx" ON "pages_blocks_text_container" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "pages_blocks_text_container_path_idx" ON "pages_blocks_text_container" USING btree ("_path");
   CREATE INDEX IF NOT EXISTS "pages_blocks_text_container_image_media_idx" ON "pages_blocks_text_container" USING btree ("image_media_id");

   -- Indexes: pages_blocks_full_bleed_parallax
   CREATE INDEX IF NOT EXISTS "pages_blocks_full_bleed_parallax_order_idx" ON "pages_blocks_full_bleed_parallax" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "pages_blocks_full_bleed_parallax_parent_id_idx" ON "pages_blocks_full_bleed_parallax" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "pages_blocks_full_bleed_parallax_path_idx" ON "pages_blocks_full_bleed_parallax" USING btree ("_path");
   CREATE INDEX IF NOT EXISTS "pages_blocks_full_bleed_parallax_image_idx" ON "pages_blocks_full_bleed_parallax" USING btree ("image_id");

   -- Indexes: pages_blocks_full_bleed_static
   CREATE INDEX IF NOT EXISTS "pages_blocks_full_bleed_static_order_idx" ON "pages_blocks_full_bleed_static" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "pages_blocks_full_bleed_static_parent_id_idx" ON "pages_blocks_full_bleed_static" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "pages_blocks_full_bleed_static_path_idx" ON "pages_blocks_full_bleed_static" USING btree ("_path");
   CREATE INDEX IF NOT EXISTS "pages_blocks_full_bleed_static_image_idx" ON "pages_blocks_full_bleed_static" USING btree ("image_id");

   -- Indexes: pages_blocks_image_carousel
   CREATE INDEX IF NOT EXISTS "pages_blocks_image_carousel_order_idx" ON "pages_blocks_image_carousel" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "pages_blocks_image_carousel_parent_id_idx" ON "pages_blocks_image_carousel" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "pages_blocks_image_carousel_path_idx" ON "pages_blocks_image_carousel" USING btree ("_path");
   CREATE INDEX IF NOT EXISTS "pages_blocks_image_carousel_slider_idx" ON "pages_blocks_image_carousel" USING btree ("slider_id");

   -- Indexes: pages_blocks_faq_block
   CREATE INDEX IF NOT EXISTS "pages_blocks_faq_block_order_idx" ON "pages_blocks_faq_block" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "pages_blocks_faq_block_parent_id_idx" ON "pages_blocks_faq_block" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "pages_blocks_faq_block_path_idx" ON "pages_blocks_faq_block" USING btree ("_path");

   -- Indexes: pages_blocks_video_embed
   CREATE INDEX IF NOT EXISTS "pages_blocks_video_embed_order_idx" ON "pages_blocks_video_embed" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "pages_blocks_video_embed_parent_id_idx" ON "pages_blocks_video_embed" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "pages_blocks_video_embed_path_idx" ON "pages_blocks_video_embed" USING btree ("_path");

   -- Indexes: _pages_v block tables
   CREATE INDEX IF NOT EXISTS "_pages_v_blocks_text_container_order_idx" ON "_pages_v_blocks_text_container" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "_pages_v_blocks_text_container_parent_id_idx" ON "_pages_v_blocks_text_container" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "_pages_v_blocks_text_container_path_idx" ON "_pages_v_blocks_text_container" USING btree ("_path");
   CREATE INDEX IF NOT EXISTS "_pages_v_blocks_full_bleed_parallax_order_idx" ON "_pages_v_blocks_full_bleed_parallax" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "_pages_v_blocks_full_bleed_parallax_parent_id_idx" ON "_pages_v_blocks_full_bleed_parallax" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "_pages_v_blocks_full_bleed_parallax_path_idx" ON "_pages_v_blocks_full_bleed_parallax" USING btree ("_path");
   CREATE INDEX IF NOT EXISTS "_pages_v_blocks_full_bleed_static_order_idx" ON "_pages_v_blocks_full_bleed_static" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "_pages_v_blocks_full_bleed_static_parent_id_idx" ON "_pages_v_blocks_full_bleed_static" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "_pages_v_blocks_full_bleed_static_path_idx" ON "_pages_v_blocks_full_bleed_static" USING btree ("_path");
   CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_carousel_order_idx" ON "_pages_v_blocks_image_carousel" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_carousel_parent_id_idx" ON "_pages_v_blocks_image_carousel" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_carousel_path_idx" ON "_pages_v_blocks_image_carousel" USING btree ("_path");
   CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_block_order_idx" ON "_pages_v_blocks_faq_block" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_block_parent_id_idx" ON "_pages_v_blocks_faq_block" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_block_path_idx" ON "_pages_v_blocks_faq_block" USING btree ("_path");
   CREATE INDEX IF NOT EXISTS "_pages_v_blocks_video_embed_order_idx" ON "_pages_v_blocks_video_embed" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "_pages_v_blocks_video_embed_parent_id_idx" ON "_pages_v_blocks_video_embed" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "_pages_v_blocks_video_embed_path_idx" ON "_pages_v_blocks_video_embed" USING btree ("_path");

   -- Indexes: posts block tables
   CREATE INDEX IF NOT EXISTS "posts_blocks_text_container_order_idx" ON "posts_blocks_text_container" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "posts_blocks_text_container_parent_id_idx" ON "posts_blocks_text_container" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "posts_blocks_text_container_path_idx" ON "posts_blocks_text_container" USING btree ("_path");
   CREATE INDEX IF NOT EXISTS "posts_blocks_text_container_image_media_idx" ON "posts_blocks_text_container" USING btree ("image_media_id");
   CREATE INDEX IF NOT EXISTS "posts_blocks_full_bleed_parallax_order_idx" ON "posts_blocks_full_bleed_parallax" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "posts_blocks_full_bleed_parallax_parent_id_idx" ON "posts_blocks_full_bleed_parallax" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "posts_blocks_full_bleed_parallax_path_idx" ON "posts_blocks_full_bleed_parallax" USING btree ("_path");
   CREATE INDEX IF NOT EXISTS "posts_blocks_full_bleed_parallax_image_idx" ON "posts_blocks_full_bleed_parallax" USING btree ("image_id");
   CREATE INDEX IF NOT EXISTS "posts_blocks_full_bleed_static_order_idx" ON "posts_blocks_full_bleed_static" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "posts_blocks_full_bleed_static_parent_id_idx" ON "posts_blocks_full_bleed_static" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "posts_blocks_full_bleed_static_path_idx" ON "posts_blocks_full_bleed_static" USING btree ("_path");
   CREATE INDEX IF NOT EXISTS "posts_blocks_full_bleed_static_image_idx" ON "posts_blocks_full_bleed_static" USING btree ("image_id");
   CREATE INDEX IF NOT EXISTS "posts_blocks_image_carousel_order_idx" ON "posts_blocks_image_carousel" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "posts_blocks_image_carousel_parent_id_idx" ON "posts_blocks_image_carousel" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "posts_blocks_image_carousel_path_idx" ON "posts_blocks_image_carousel" USING btree ("_path");
   CREATE INDEX IF NOT EXISTS "posts_blocks_image_carousel_slider_idx" ON "posts_blocks_image_carousel" USING btree ("slider_id");
   CREATE INDEX IF NOT EXISTS "posts_blocks_faq_block_order_idx" ON "posts_blocks_faq_block" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "posts_blocks_faq_block_parent_id_idx" ON "posts_blocks_faq_block" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "posts_blocks_faq_block_path_idx" ON "posts_blocks_faq_block" USING btree ("_path");
   CREATE INDEX IF NOT EXISTS "posts_blocks_video_embed_order_idx" ON "posts_blocks_video_embed" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "posts_blocks_video_embed_parent_id_idx" ON "posts_blocks_video_embed" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "posts_blocks_video_embed_path_idx" ON "posts_blocks_video_embed" USING btree ("_path");
   CREATE INDEX IF NOT EXISTS "posts_blocks_media_block_order_idx" ON "posts_blocks_media_block" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "posts_blocks_media_block_parent_id_idx" ON "posts_blocks_media_block" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "posts_blocks_media_block_path_idx" ON "posts_blocks_media_block" USING btree ("_path");
   CREATE INDEX IF NOT EXISTS "posts_blocks_media_block_media_idx" ON "posts_blocks_media_block" USING btree ("media_id");

   -- Indexes: _posts_v block tables
   CREATE INDEX IF NOT EXISTS "_posts_v_blocks_text_container_order_idx" ON "_posts_v_blocks_text_container" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "_posts_v_blocks_text_container_parent_id_idx" ON "_posts_v_blocks_text_container" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "_posts_v_blocks_text_container_path_idx" ON "_posts_v_blocks_text_container" USING btree ("_path");
   CREATE INDEX IF NOT EXISTS "_posts_v_blocks_full_bleed_parallax_order_idx" ON "_posts_v_blocks_full_bleed_parallax" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "_posts_v_blocks_full_bleed_parallax_parent_id_idx" ON "_posts_v_blocks_full_bleed_parallax" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "_posts_v_blocks_full_bleed_parallax_path_idx" ON "_posts_v_blocks_full_bleed_parallax" USING btree ("_path");
   CREATE INDEX IF NOT EXISTS "_posts_v_blocks_full_bleed_static_order_idx" ON "_posts_v_blocks_full_bleed_static" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "_posts_v_blocks_full_bleed_static_parent_id_idx" ON "_posts_v_blocks_full_bleed_static" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "_posts_v_blocks_full_bleed_static_path_idx" ON "_posts_v_blocks_full_bleed_static" USING btree ("_path");
   CREATE INDEX IF NOT EXISTS "_posts_v_blocks_image_carousel_order_idx" ON "_posts_v_blocks_image_carousel" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "_posts_v_blocks_image_carousel_parent_id_idx" ON "_posts_v_blocks_image_carousel" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "_posts_v_blocks_image_carousel_path_idx" ON "_posts_v_blocks_image_carousel" USING btree ("_path");
   CREATE INDEX IF NOT EXISTS "_posts_v_blocks_faq_block_order_idx" ON "_posts_v_blocks_faq_block" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "_posts_v_blocks_faq_block_parent_id_idx" ON "_posts_v_blocks_faq_block" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "_posts_v_blocks_faq_block_path_idx" ON "_posts_v_blocks_faq_block" USING btree ("_path");
   CREATE INDEX IF NOT EXISTS "_posts_v_blocks_video_embed_order_idx" ON "_posts_v_blocks_video_embed" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "_posts_v_blocks_video_embed_parent_id_idx" ON "_posts_v_blocks_video_embed" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "_posts_v_blocks_video_embed_path_idx" ON "_posts_v_blocks_video_embed" USING btree ("_path");
   CREATE INDEX IF NOT EXISTS "_posts_v_blocks_media_block_order_idx" ON "_posts_v_blocks_media_block" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "_posts_v_blocks_media_block_parent_id_idx" ON "_posts_v_blocks_media_block" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "_posts_v_blocks_media_block_path_idx" ON "_posts_v_blocks_media_block" USING btree ("_path");
   CREATE INDEX IF NOT EXISTS "_posts_v_blocks_media_block_media_idx" ON "_posts_v_blocks_media_block" USING btree ("media_id");

   -- Indexes: globals_faq_items
   CREATE INDEX IF NOT EXISTS "globals_faq_items_order_idx" ON "globals_faq_items" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "globals_faq_items_parent_id_idx" ON "globals_faq_items" USING btree ("_parent_id");

   -- Indexes: pages hero
   CREATE INDEX IF NOT EXISTS "pages_hero_hero_image_idx" ON "pages" USING btree ("hero_hero_image_id");
   CREATE INDEX IF NOT EXISTS "pages_hero_hero_image_mobile_idx" ON "pages" USING btree ("hero_hero_image_mobile_id");

   -- Indexes: _pages_v hero
   CREATE INDEX IF NOT EXISTS "_pages_v_version_hero_hero_image_idx" ON "_pages_v" USING btree ("version_hero_hero_image_id");
   CREATE INDEX IF NOT EXISTS "_pages_v_version_hero_hero_image_mobile_idx" ON "_pages_v" USING btree ("version_hero_hero_image_mobile_id");

   -- Indexes: payload_locked_documents_rels sliders
   CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_sliders_id_idx" ON "payload_locked_documents_rels" USING btree ("sliders_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE IF EXISTS "pages_blocks_text_container" CASCADE;
   DROP TABLE IF EXISTS "pages_blocks_full_bleed_parallax" CASCADE;
   DROP TABLE IF EXISTS "pages_blocks_full_bleed_static" CASCADE;
   DROP TABLE IF EXISTS "pages_blocks_image_carousel" CASCADE;
   DROP TABLE IF EXISTS "pages_blocks_faq_block" CASCADE;
   DROP TABLE IF EXISTS "pages_blocks_video_embed" CASCADE;
   DROP TABLE IF EXISTS "_pages_v_blocks_text_container" CASCADE;
   DROP TABLE IF EXISTS "_pages_v_blocks_full_bleed_parallax" CASCADE;
   DROP TABLE IF EXISTS "_pages_v_blocks_full_bleed_static" CASCADE;
   DROP TABLE IF EXISTS "_pages_v_blocks_image_carousel" CASCADE;
   DROP TABLE IF EXISTS "_pages_v_blocks_faq_block" CASCADE;
   DROP TABLE IF EXISTS "_pages_v_blocks_video_embed" CASCADE;
   DROP TABLE IF EXISTS "posts_blocks_text_container" CASCADE;
   DROP TABLE IF EXISTS "posts_blocks_full_bleed_parallax" CASCADE;
   DROP TABLE IF EXISTS "posts_blocks_full_bleed_static" CASCADE;
   DROP TABLE IF EXISTS "posts_blocks_image_carousel" CASCADE;
   DROP TABLE IF EXISTS "posts_blocks_faq_block" CASCADE;
   DROP TABLE IF EXISTS "posts_blocks_video_embed" CASCADE;
   DROP TABLE IF EXISTS "posts_blocks_media_block" CASCADE;
   DROP TABLE IF EXISTS "_posts_v_blocks_text_container" CASCADE;
   DROP TABLE IF EXISTS "_posts_v_blocks_full_bleed_parallax" CASCADE;
   DROP TABLE IF EXISTS "_posts_v_blocks_full_bleed_static" CASCADE;
   DROP TABLE IF EXISTS "_posts_v_blocks_image_carousel" CASCADE;
   DROP TABLE IF EXISTS "_posts_v_blocks_faq_block" CASCADE;
   DROP TABLE IF EXISTS "_posts_v_blocks_video_embed" CASCADE;
   DROP TABLE IF EXISTS "_posts_v_blocks_media_block" CASCADE;
   DROP TABLE IF EXISTS "globals_faq_items" CASCADE;
   DROP TABLE IF EXISTS "globals_faq" CASCADE;
   DROP TABLE IF EXISTS "sliders_rels" CASCADE;
   DROP TABLE IF EXISTS "sliders" CASCADE;
   ALTER TABLE "pages" DROP COLUMN IF EXISTS "hero_hero_headline";
   ALTER TABLE "pages" DROP COLUMN IF EXISTS "hero_hero_image_id";
   ALTER TABLE "pages" DROP COLUMN IF EXISTS "hero_hero_image_mobile_id";
   ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_hero_hero_headline";
   ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_hero_hero_image_id";
   ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_hero_hero_image_mobile_id";
   ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "sliders_id";
   DROP TYPE IF EXISTS "public"."enum_pages_blocks_text_container_image_position";
   DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_text_container_image_position";
   DROP TYPE IF EXISTS "public"."enum_posts_blocks_text_container_image_position";
   DROP TYPE IF EXISTS "public"."enum__posts_v_blocks_text_container_image_position";
   DROP TYPE IF EXISTS "public"."enum_pages_blocks_video_embed_position";
   DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_video_embed_position";
   DROP TYPE IF EXISTS "public"."enum_posts_blocks_video_embed_position";
   DROP TYPE IF EXISTS "public"."enum__posts_v_blocks_video_embed_position";
  `)
}
