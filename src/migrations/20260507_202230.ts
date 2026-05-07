import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_posts_blocks_text_container_spacing_top" AS ENUM('standard', 'none', 'custom');
  CREATE TYPE "public"."enum_posts_blocks_text_container_spacing_bottom" AS ENUM('standard', 'none', 'custom');
  CREATE TYPE "public"."enum_posts_blocks_text_container_image_position" AS ENUM('none', 'left', 'right', 'full');
  CREATE TYPE "public"."enum_posts_blocks_video_embed_position" AS ENUM('full', 'left', 'right');
  CREATE TYPE "public"."enum__posts_v_blocks_text_container_spacing_top" AS ENUM('standard', 'none', 'custom');
  CREATE TYPE "public"."enum__posts_v_blocks_text_container_spacing_bottom" AS ENUM('standard', 'none', 'custom');
  CREATE TYPE "public"."enum__posts_v_blocks_text_container_image_position" AS ENUM('none', 'left', 'right', 'full');
  CREATE TYPE "public"."enum__posts_v_blocks_video_embed_position" AS ENUM('full', 'left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_text_container_spacing_top" AS ENUM('standard', 'none', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_text_container_spacing_bottom" AS ENUM('standard', 'none', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_text_container_image_position" AS ENUM('none', 'left', 'right', 'full');
  CREATE TYPE "public"."enum_pages_blocks_video_embed_position" AS ENUM('full', 'left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_simulator_block_spacing_top" AS ENUM('standard', 'none', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_simulator_block_spacing_bottom" AS ENUM('standard', 'none', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_text_container_spacing_top" AS ENUM('standard', 'none', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_text_container_spacing_bottom" AS ENUM('standard', 'none', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_text_container_image_position" AS ENUM('none', 'left', 'right', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_video_embed_position" AS ENUM('full', 'left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_simulator_block_spacing_top" AS ENUM('standard', 'none', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_simulator_block_spacing_bottom" AS ENUM('standard', 'none', 'custom');
  CREATE TYPE "public"."enum_optional_extras_city" AS ENUM('belgrade', 'sarajevo');
  CREATE TYPE "public"."enum_contact_messages_status" AS ENUM('new', 'read', 'replied');
  CREATE TYPE "public"."enum_email_templates_template_key" AS ENUM('booking_guest_confirmation_belgrade', 'booking_guest_confirmation_sarajevo', 'booking_staff_belgrade', 'booking_staff_sarajevo', 'contact_staff_notification');
  CREATE TABLE "posts_blocks_text_container" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"spacing_top" "enum_posts_blocks_text_container_spacing_top" DEFAULT 'standard',
  	"spacing_top_custom" numeric,
  	"spacing_bottom" "enum_posts_blocks_text_container_spacing_bottom" DEFAULT 'standard',
  	"spacing_bottom_custom" numeric,
  	"image_media_id" integer,
  	"image_position" "enum_posts_blocks_text_container_image_position" DEFAULT 'none',
  	"image_width_percent" numeric DEFAULT 42,
  	"image_caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_full_bleed_parallax" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_full_bleed_static" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_image_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slider_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_video_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"youtube_url" varchar,
  	"position" "enum_posts_blocks_video_embed_position" DEFAULT 'full',
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_text_container" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"spacing_top" "enum__posts_v_blocks_text_container_spacing_top" DEFAULT 'standard',
  	"spacing_top_custom" numeric,
  	"spacing_bottom" "enum__posts_v_blocks_text_container_spacing_bottom" DEFAULT 'standard',
  	"spacing_bottom_custom" numeric,
  	"image_media_id" integer,
  	"image_position" "enum__posts_v_blocks_text_container_image_position" DEFAULT 'none',
  	"image_width_percent" numeric DEFAULT 42,
  	"image_caption" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_full_bleed_parallax" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_full_bleed_static" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_image_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"slider_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_video_embed" (
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
  
  CREATE TABLE "_posts_v_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "sliders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sliders_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "pages_blocks_text_container" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"spacing_top" "enum_pages_blocks_text_container_spacing_top" DEFAULT 'standard',
  	"spacing_top_custom" numeric,
  	"spacing_bottom" "enum_pages_blocks_text_container_spacing_bottom" DEFAULT 'standard',
  	"spacing_bottom_custom" numeric,
  	"image_media_id" integer,
  	"image_position" "enum_pages_blocks_text_container_image_position" DEFAULT 'none',
  	"image_width_percent" numeric DEFAULT 42,
  	"image_caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_full_bleed_parallax" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_full_bleed_static" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_image_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slider_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_video_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"youtube_url" varchar,
  	"position" "enum_pages_blocks_video_embed_position" DEFAULT 'full',
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Contact Us',
  	"lede" varchar DEFAULT 'Questions about a tour, a booking, or something else? Drop us a line and we''ll get back to you as soon as we can.',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_simulator_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"spacing_top" "enum_pages_blocks_simulator_block_spacing_top" DEFAULT 'standard',
  	"spacing_top_custom" numeric,
  	"spacing_bottom" "enum_pages_blocks_simulator_block_spacing_bottom" DEFAULT 'standard',
  	"spacing_bottom_custom" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_text_container" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"spacing_top" "enum__pages_v_blocks_text_container_spacing_top" DEFAULT 'standard',
  	"spacing_top_custom" numeric,
  	"spacing_bottom" "enum__pages_v_blocks_text_container_spacing_bottom" DEFAULT 'standard',
  	"spacing_bottom_custom" numeric,
  	"image_media_id" integer,
  	"image_position" "enum__pages_v_blocks_text_container_image_position" DEFAULT 'none',
  	"image_width_percent" numeric DEFAULT 42,
  	"image_caption" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_full_bleed_parallax" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_full_bleed_static" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"slider_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_video_embed" (
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
  
  CREATE TABLE "_pages_v_blocks_contact_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Contact Us',
  	"lede" varchar DEFAULT 'Questions about a tour, a booking, or something else? Drop us a line and we''ll get back to you as soon as we can.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_simulator_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"spacing_top" "enum__pages_v_blocks_simulator_block_spacing_top" DEFAULT 'standard',
  	"spacing_top_custom" numeric,
  	"spacing_bottom" "enum__pages_v_blocks_simulator_block_spacing_bottom" DEFAULT 'standard',
  	"spacing_bottom_custom" numeric,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "optional_extras" (
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
  
  CREATE TABLE "contact_messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"status" "enum_contact_messages_status" DEFAULT 'new',
  	"ip_address" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "email_templates_recipients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email" varchar
  );
  
  CREATE TABLE "email_templates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"template_key" "enum_email_templates_template_key" NOT NULL,
  	"from_name" varchar DEFAULT 'Yugotour',
  	"from_email" varchar DEFAULT 'noreply@yugotour.com',
  	"subject" varchar NOT NULL,
  	"preheader" varchar,
  	"body" jsonb,
  	"logo_id" integer,
  	"signature_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" jsonb
  );
  
  CREATE TABLE "faq" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pages_hero_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_image_slider" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_version_hero_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_image_slider" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tour_list_pages_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_folders_folder_type" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_folders" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_hero_links" CASCADE;
  DROP TABLE "pages_blocks_image_slider" CASCADE;
  DROP TABLE "_pages_v_version_hero_links" CASCADE;
  DROP TABLE "_pages_v_blocks_image_slider" CASCADE;
  DROP TABLE "tour_list_pages_rels" CASCADE;
  DROP TABLE "payload_folders_folder_type" CASCADE;
  DROP TABLE "payload_folders" CASCADE;
  ALTER TABLE "pages" DROP CONSTRAINT "pages_hero_media_id_media_id_fk";
  
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_media_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_hero_media_id_media_id_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_media_fk";
  
  ALTER TABLE "media" DROP CONSTRAINT "media_folder_id_payload_folders_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payload_folders_fk";
  
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE text;
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'pageHero'::text;
  DROP TYPE "public"."enum_pages_hero_type";
  CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('none', 'pageHero');
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'pageHero'::"public"."enum_pages_hero_type";
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE "public"."enum_pages_hero_type" USING "hero_type"::"public"."enum_pages_hero_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'pageHero'::text;
  DROP TYPE "public"."enum__pages_v_version_hero_type";
  CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('none', 'pageHero');
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'pageHero'::"public"."enum__pages_v_version_hero_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE "public"."enum__pages_v_version_hero_type" USING "version_hero_type"::"public"."enum__pages_v_version_hero_type";
  DROP INDEX "pages_hero_hero_media_idx";
  DROP INDEX "pages_rels_media_id_idx";
  DROP INDEX "_pages_v_version_hero_version_hero_media_idx";
  DROP INDEX "_pages_v_rels_media_id_idx";
  DROP INDEX "media_folder_idx";
  DROP INDEX "payload_locked_documents_rels_payload_folders_id_idx";
  ALTER TABLE "pages" ADD COLUMN "hero_hero_headline" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_hero_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN "hero_hero_image_mobile_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_headline" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_image_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_image_mobile_id" integer;
  ALTER TABLE "tours_extras" ADD COLUMN "extra_id" integer NOT NULL;
  ALTER TABLE "tour_list_pages" ADD COLUMN "slider_id" integer;
  ALTER TABLE "bookings" ADD COLUMN "pickup_spot" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "sliders_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "optional_extras_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "contact_messages_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "email_templates_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "booking_tour_time_start" varchar DEFAULT '09:00';
  ALTER TABLE "site_settings" ADD COLUMN "booking_tour_time_end" varchar DEFAULT '17:00';
  ALTER TABLE "site_settings" ADD COLUMN "booking_airport_time_start" varchar DEFAULT '08:00';
  ALTER TABLE "site_settings" ADD COLUMN "booking_airport_time_end" varchar DEFAULT '20:00';
  ALTER TABLE "site_settings" ADD COLUMN "booking_success_line1" varchar DEFAULT 'The Marshal of Yugoslavia is pleased to confirm receipt of your booking request.';
  ALTER TABLE "site_settings" ADD COLUMN "booking_success_line2" varchar DEFAULT 'We''ll be in touch via email to firm up the details. Thank you for booking with Yugotour! <i>Ajmo!</i>';
  ALTER TABLE "site_settings" ADD COLUMN "site_hero_video_desktop_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "site_hero_video_mobile_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "site_hero_cover_desktop_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "site_hero_cover_mobile_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "site_site_title" varchar DEFAULT 'Yugotour';
  ALTER TABLE "site_settings" ADD COLUMN "site_site_description" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "site_homepage_slider_id" integer;
  ALTER TABLE "posts_blocks_text_container" ADD CONSTRAINT "posts_blocks_text_container_image_media_id_media_id_fk" FOREIGN KEY ("image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_text_container" ADD CONSTRAINT "posts_blocks_text_container_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_full_bleed_parallax" ADD CONSTRAINT "posts_blocks_full_bleed_parallax_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_full_bleed_parallax" ADD CONSTRAINT "posts_blocks_full_bleed_parallax_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_full_bleed_static" ADD CONSTRAINT "posts_blocks_full_bleed_static_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_full_bleed_static" ADD CONSTRAINT "posts_blocks_full_bleed_static_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_image_carousel" ADD CONSTRAINT "posts_blocks_image_carousel_slider_id_sliders_id_fk" FOREIGN KEY ("slider_id") REFERENCES "public"."sliders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_image_carousel" ADD CONSTRAINT "posts_blocks_image_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_faq_block" ADD CONSTRAINT "posts_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_video_embed" ADD CONSTRAINT "posts_blocks_video_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_media_block" ADD CONSTRAINT "posts_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_media_block" ADD CONSTRAINT "posts_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
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
  ALTER TABLE "sliders_rels" ADD CONSTRAINT "sliders_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."sliders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sliders_rels" ADD CONSTRAINT "sliders_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_text_container" ADD CONSTRAINT "pages_blocks_text_container_image_media_id_media_id_fk" FOREIGN KEY ("image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_text_container" ADD CONSTRAINT "pages_blocks_text_container_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_full_bleed_parallax" ADD CONSTRAINT "pages_blocks_full_bleed_parallax_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_full_bleed_parallax" ADD CONSTRAINT "pages_blocks_full_bleed_parallax_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_full_bleed_static" ADD CONSTRAINT "pages_blocks_full_bleed_static_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_full_bleed_static" ADD CONSTRAINT "pages_blocks_full_bleed_static_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_carousel" ADD CONSTRAINT "pages_blocks_image_carousel_slider_id_sliders_id_fk" FOREIGN KEY ("slider_id") REFERENCES "public"."sliders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_carousel" ADD CONSTRAINT "pages_blocks_image_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_block" ADD CONSTRAINT "pages_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video_embed" ADD CONSTRAINT "pages_blocks_video_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_block" ADD CONSTRAINT "pages_blocks_contact_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_simulator_block" ADD CONSTRAINT "pages_blocks_simulator_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_text_container" ADD CONSTRAINT "_pages_v_blocks_text_container_image_media_id_media_id_fk" FOREIGN KEY ("image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_text_container" ADD CONSTRAINT "_pages_v_blocks_text_container_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_full_bleed_parallax" ADD CONSTRAINT "_pages_v_blocks_full_bleed_parallax_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_full_bleed_parallax" ADD CONSTRAINT "_pages_v_blocks_full_bleed_parallax_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_full_bleed_static" ADD CONSTRAINT "_pages_v_blocks_full_bleed_static_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_full_bleed_static" ADD CONSTRAINT "_pages_v_blocks_full_bleed_static_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_carousel" ADD CONSTRAINT "_pages_v_blocks_image_carousel_slider_id_sliders_id_fk" FOREIGN KEY ("slider_id") REFERENCES "public"."sliders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_carousel" ADD CONSTRAINT "_pages_v_blocks_image_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_block" ADD CONSTRAINT "_pages_v_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video_embed" ADD CONSTRAINT "_pages_v_blocks_video_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_block" ADD CONSTRAINT "_pages_v_blocks_contact_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_simulator_block" ADD CONSTRAINT "_pages_v_blocks_simulator_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "optional_extras" ADD CONSTRAINT "optional_extras_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "email_templates_recipients" ADD CONSTRAINT "email_templates_recipients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."email_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "email_templates" ADD CONSTRAINT "email_templates_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "email_templates" ADD CONSTRAINT "email_templates_signature_id_media_id_fk" FOREIGN KEY ("signature_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faq_items" ADD CONSTRAINT "faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faq"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_blocks_text_container_order_idx" ON "posts_blocks_text_container" USING btree ("_order");
  CREATE INDEX "posts_blocks_text_container_parent_id_idx" ON "posts_blocks_text_container" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_text_container_path_idx" ON "posts_blocks_text_container" USING btree ("_path");
  CREATE INDEX "posts_blocks_text_container_image_image_media_idx" ON "posts_blocks_text_container" USING btree ("image_media_id");
  CREATE INDEX "posts_blocks_full_bleed_parallax_order_idx" ON "posts_blocks_full_bleed_parallax" USING btree ("_order");
  CREATE INDEX "posts_blocks_full_bleed_parallax_parent_id_idx" ON "posts_blocks_full_bleed_parallax" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_full_bleed_parallax_path_idx" ON "posts_blocks_full_bleed_parallax" USING btree ("_path");
  CREATE INDEX "posts_blocks_full_bleed_parallax_image_idx" ON "posts_blocks_full_bleed_parallax" USING btree ("image_id");
  CREATE INDEX "posts_blocks_full_bleed_static_order_idx" ON "posts_blocks_full_bleed_static" USING btree ("_order");
  CREATE INDEX "posts_blocks_full_bleed_static_parent_id_idx" ON "posts_blocks_full_bleed_static" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_full_bleed_static_path_idx" ON "posts_blocks_full_bleed_static" USING btree ("_path");
  CREATE INDEX "posts_blocks_full_bleed_static_image_idx" ON "posts_blocks_full_bleed_static" USING btree ("image_id");
  CREATE INDEX "posts_blocks_image_carousel_order_idx" ON "posts_blocks_image_carousel" USING btree ("_order");
  CREATE INDEX "posts_blocks_image_carousel_parent_id_idx" ON "posts_blocks_image_carousel" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_image_carousel_path_idx" ON "posts_blocks_image_carousel" USING btree ("_path");
  CREATE INDEX "posts_blocks_image_carousel_slider_idx" ON "posts_blocks_image_carousel" USING btree ("slider_id");
  CREATE INDEX "posts_blocks_faq_block_order_idx" ON "posts_blocks_faq_block" USING btree ("_order");
  CREATE INDEX "posts_blocks_faq_block_parent_id_idx" ON "posts_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_faq_block_path_idx" ON "posts_blocks_faq_block" USING btree ("_path");
  CREATE INDEX "posts_blocks_video_embed_order_idx" ON "posts_blocks_video_embed" USING btree ("_order");
  CREATE INDEX "posts_blocks_video_embed_parent_id_idx" ON "posts_blocks_video_embed" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_video_embed_path_idx" ON "posts_blocks_video_embed" USING btree ("_path");
  CREATE INDEX "posts_blocks_media_block_order_idx" ON "posts_blocks_media_block" USING btree ("_order");
  CREATE INDEX "posts_blocks_media_block_parent_id_idx" ON "posts_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_media_block_path_idx" ON "posts_blocks_media_block" USING btree ("_path");
  CREATE INDEX "posts_blocks_media_block_media_idx" ON "posts_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "_posts_v_blocks_text_container_order_idx" ON "_posts_v_blocks_text_container" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_text_container_parent_id_idx" ON "_posts_v_blocks_text_container" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_text_container_path_idx" ON "_posts_v_blocks_text_container" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_text_container_image_image_media_idx" ON "_posts_v_blocks_text_container" USING btree ("image_media_id");
  CREATE INDEX "_posts_v_blocks_full_bleed_parallax_order_idx" ON "_posts_v_blocks_full_bleed_parallax" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_full_bleed_parallax_parent_id_idx" ON "_posts_v_blocks_full_bleed_parallax" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_full_bleed_parallax_path_idx" ON "_posts_v_blocks_full_bleed_parallax" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_full_bleed_parallax_image_idx" ON "_posts_v_blocks_full_bleed_parallax" USING btree ("image_id");
  CREATE INDEX "_posts_v_blocks_full_bleed_static_order_idx" ON "_posts_v_blocks_full_bleed_static" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_full_bleed_static_parent_id_idx" ON "_posts_v_blocks_full_bleed_static" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_full_bleed_static_path_idx" ON "_posts_v_blocks_full_bleed_static" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_full_bleed_static_image_idx" ON "_posts_v_blocks_full_bleed_static" USING btree ("image_id");
  CREATE INDEX "_posts_v_blocks_image_carousel_order_idx" ON "_posts_v_blocks_image_carousel" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_image_carousel_parent_id_idx" ON "_posts_v_blocks_image_carousel" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_image_carousel_path_idx" ON "_posts_v_blocks_image_carousel" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_image_carousel_slider_idx" ON "_posts_v_blocks_image_carousel" USING btree ("slider_id");
  CREATE INDEX "_posts_v_blocks_faq_block_order_idx" ON "_posts_v_blocks_faq_block" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_faq_block_parent_id_idx" ON "_posts_v_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_faq_block_path_idx" ON "_posts_v_blocks_faq_block" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_video_embed_order_idx" ON "_posts_v_blocks_video_embed" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_video_embed_parent_id_idx" ON "_posts_v_blocks_video_embed" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_video_embed_path_idx" ON "_posts_v_blocks_video_embed" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_media_block_order_idx" ON "_posts_v_blocks_media_block" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_media_block_parent_id_idx" ON "_posts_v_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_media_block_path_idx" ON "_posts_v_blocks_media_block" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_media_block_media_idx" ON "_posts_v_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "sliders_updated_at_idx" ON "sliders" USING btree ("updated_at");
  CREATE INDEX "sliders_created_at_idx" ON "sliders" USING btree ("created_at");
  CREATE INDEX "sliders_rels_order_idx" ON "sliders_rels" USING btree ("order");
  CREATE INDEX "sliders_rels_parent_idx" ON "sliders_rels" USING btree ("parent_id");
  CREATE INDEX "sliders_rels_path_idx" ON "sliders_rels" USING btree ("path");
  CREATE INDEX "sliders_rels_media_id_idx" ON "sliders_rels" USING btree ("media_id");
  CREATE INDEX "pages_blocks_text_container_order_idx" ON "pages_blocks_text_container" USING btree ("_order");
  CREATE INDEX "pages_blocks_text_container_parent_id_idx" ON "pages_blocks_text_container" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_text_container_path_idx" ON "pages_blocks_text_container" USING btree ("_path");
  CREATE INDEX "pages_blocks_text_container_image_image_media_idx" ON "pages_blocks_text_container" USING btree ("image_media_id");
  CREATE INDEX "pages_blocks_full_bleed_parallax_order_idx" ON "pages_blocks_full_bleed_parallax" USING btree ("_order");
  CREATE INDEX "pages_blocks_full_bleed_parallax_parent_id_idx" ON "pages_blocks_full_bleed_parallax" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_full_bleed_parallax_path_idx" ON "pages_blocks_full_bleed_parallax" USING btree ("_path");
  CREATE INDEX "pages_blocks_full_bleed_parallax_image_idx" ON "pages_blocks_full_bleed_parallax" USING btree ("image_id");
  CREATE INDEX "pages_blocks_full_bleed_static_order_idx" ON "pages_blocks_full_bleed_static" USING btree ("_order");
  CREATE INDEX "pages_blocks_full_bleed_static_parent_id_idx" ON "pages_blocks_full_bleed_static" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_full_bleed_static_path_idx" ON "pages_blocks_full_bleed_static" USING btree ("_path");
  CREATE INDEX "pages_blocks_full_bleed_static_image_idx" ON "pages_blocks_full_bleed_static" USING btree ("image_id");
  CREATE INDEX "pages_blocks_image_carousel_order_idx" ON "pages_blocks_image_carousel" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_carousel_parent_id_idx" ON "pages_blocks_image_carousel" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_carousel_path_idx" ON "pages_blocks_image_carousel" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_carousel_slider_idx" ON "pages_blocks_image_carousel" USING btree ("slider_id");
  CREATE INDEX "pages_blocks_faq_block_order_idx" ON "pages_blocks_faq_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_block_parent_id_idx" ON "pages_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_block_path_idx" ON "pages_blocks_faq_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_embed_order_idx" ON "pages_blocks_video_embed" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_embed_parent_id_idx" ON "pages_blocks_video_embed" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_embed_path_idx" ON "pages_blocks_video_embed" USING btree ("_path");
  CREATE INDEX "pages_blocks_contact_block_order_idx" ON "pages_blocks_contact_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_block_parent_id_idx" ON "pages_blocks_contact_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_block_path_idx" ON "pages_blocks_contact_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_simulator_block_order_idx" ON "pages_blocks_simulator_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_simulator_block_parent_id_idx" ON "pages_blocks_simulator_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_simulator_block_path_idx" ON "pages_blocks_simulator_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_text_container_order_idx" ON "_pages_v_blocks_text_container" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_text_container_parent_id_idx" ON "_pages_v_blocks_text_container" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_text_container_path_idx" ON "_pages_v_blocks_text_container" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_text_container_image_image_media_idx" ON "_pages_v_blocks_text_container" USING btree ("image_media_id");
  CREATE INDEX "_pages_v_blocks_full_bleed_parallax_order_idx" ON "_pages_v_blocks_full_bleed_parallax" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_full_bleed_parallax_parent_id_idx" ON "_pages_v_blocks_full_bleed_parallax" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_full_bleed_parallax_path_idx" ON "_pages_v_blocks_full_bleed_parallax" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_full_bleed_parallax_image_idx" ON "_pages_v_blocks_full_bleed_parallax" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_full_bleed_static_order_idx" ON "_pages_v_blocks_full_bleed_static" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_full_bleed_static_parent_id_idx" ON "_pages_v_blocks_full_bleed_static" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_full_bleed_static_path_idx" ON "_pages_v_blocks_full_bleed_static" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_full_bleed_static_image_idx" ON "_pages_v_blocks_full_bleed_static" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_image_carousel_order_idx" ON "_pages_v_blocks_image_carousel" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_carousel_parent_id_idx" ON "_pages_v_blocks_image_carousel" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_carousel_path_idx" ON "_pages_v_blocks_image_carousel" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_carousel_slider_idx" ON "_pages_v_blocks_image_carousel" USING btree ("slider_id");
  CREATE INDEX "_pages_v_blocks_faq_block_order_idx" ON "_pages_v_blocks_faq_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_block_parent_id_idx" ON "_pages_v_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_block_path_idx" ON "_pages_v_blocks_faq_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_embed_order_idx" ON "_pages_v_blocks_video_embed" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_embed_parent_id_idx" ON "_pages_v_blocks_video_embed" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_embed_path_idx" ON "_pages_v_blocks_video_embed" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_contact_block_order_idx" ON "_pages_v_blocks_contact_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_block_parent_id_idx" ON "_pages_v_blocks_contact_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_block_path_idx" ON "_pages_v_blocks_contact_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_simulator_block_order_idx" ON "_pages_v_blocks_simulator_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_simulator_block_parent_id_idx" ON "_pages_v_blocks_simulator_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_simulator_block_path_idx" ON "_pages_v_blocks_simulator_block" USING btree ("_path");
  CREATE INDEX "optional_extras_image_idx" ON "optional_extras" USING btree ("image_id");
  CREATE INDEX "optional_extras_updated_at_idx" ON "optional_extras" USING btree ("updated_at");
  CREATE INDEX "optional_extras_created_at_idx" ON "optional_extras" USING btree ("created_at");
  CREATE INDEX "contact_messages_updated_at_idx" ON "contact_messages" USING btree ("updated_at");
  CREATE INDEX "contact_messages_created_at_idx" ON "contact_messages" USING btree ("created_at");
  CREATE INDEX "email_templates_recipients_order_idx" ON "email_templates_recipients" USING btree ("_order");
  CREATE INDEX "email_templates_recipients_parent_id_idx" ON "email_templates_recipients" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "email_templates_template_key_idx" ON "email_templates" USING btree ("template_key");
  CREATE INDEX "email_templates_logo_idx" ON "email_templates" USING btree ("logo_id");
  CREATE INDEX "email_templates_signature_idx" ON "email_templates" USING btree ("signature_id");
  CREATE INDEX "email_templates_updated_at_idx" ON "email_templates" USING btree ("updated_at");
  CREATE INDEX "email_templates_created_at_idx" ON "email_templates" USING btree ("created_at");
  CREATE INDEX "faq_items_order_idx" ON "faq_items" USING btree ("_order");
  CREATE INDEX "faq_items_parent_id_idx" ON "faq_items" USING btree ("_parent_id");
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_hero_image_id_media_id_fk" FOREIGN KEY ("hero_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_hero_image_mobile_id_media_id_fk" FOREIGN KEY ("hero_hero_image_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_hero_image_mobile_id_media_id_fk" FOREIGN KEY ("version_hero_hero_image_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tours_extras" ADD CONSTRAINT "tours_extras_extra_id_optional_extras_id_fk" FOREIGN KEY ("extra_id") REFERENCES "public"."optional_extras"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tour_list_pages" ADD CONSTRAINT "tour_list_pages_slider_id_sliders_id_fk" FOREIGN KEY ("slider_id") REFERENCES "public"."sliders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sliders_fk" FOREIGN KEY ("sliders_id") REFERENCES "public"."sliders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_optional_extras_fk" FOREIGN KEY ("optional_extras_id") REFERENCES "public"."optional_extras"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_messages_fk" FOREIGN KEY ("contact_messages_id") REFERENCES "public"."contact_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_email_templates_fk" FOREIGN KEY ("email_templates_id") REFERENCES "public"."email_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_site_hero_video_desktop_id_media_id_fk" FOREIGN KEY ("site_hero_video_desktop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_site_hero_video_mobile_id_media_id_fk" FOREIGN KEY ("site_hero_video_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_site_hero_cover_desktop_id_media_id_fk" FOREIGN KEY ("site_hero_cover_desktop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_site_hero_cover_mobile_id_media_id_fk" FOREIGN KEY ("site_hero_cover_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_site_homepage_slider_id_sliders_id_fk" FOREIGN KEY ("site_homepage_slider_id") REFERENCES "public"."sliders"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_hero_hero_hero_image_idx" ON "pages" USING btree ("hero_hero_image_id");
  CREATE INDEX "pages_hero_hero_hero_image_mobile_idx" ON "pages" USING btree ("hero_hero_image_mobile_id");
  CREATE INDEX "_pages_v_version_hero_version_hero_hero_image_idx" ON "_pages_v" USING btree ("version_hero_hero_image_id");
  CREATE INDEX "_pages_v_version_hero_version_hero_hero_image_mobile_idx" ON "_pages_v" USING btree ("version_hero_hero_image_mobile_id");
  CREATE INDEX "tours_extras_extra_idx" ON "tours_extras" USING btree ("extra_id");
  CREATE INDEX "tour_list_pages_slider_idx" ON "tour_list_pages" USING btree ("slider_id");
  CREATE INDEX "payload_locked_documents_rels_sliders_id_idx" ON "payload_locked_documents_rels" USING btree ("sliders_id");
  CREATE INDEX "payload_locked_documents_rels_optional_extras_id_idx" ON "payload_locked_documents_rels" USING btree ("optional_extras_id");
  CREATE INDEX "payload_locked_documents_rels_contact_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_messages_id");
  CREATE INDEX "payload_locked_documents_rels_email_templates_id_idx" ON "payload_locked_documents_rels" USING btree ("email_templates_id");
  CREATE INDEX "site_settings_site_site_hero_video_desktop_idx" ON "site_settings" USING btree ("site_hero_video_desktop_id");
  CREATE INDEX "site_settings_site_site_hero_video_mobile_idx" ON "site_settings" USING btree ("site_hero_video_mobile_id");
  CREATE INDEX "site_settings_site_site_hero_cover_desktop_idx" ON "site_settings" USING btree ("site_hero_cover_desktop_id");
  CREATE INDEX "site_settings_site_site_hero_cover_mobile_idx" ON "site_settings" USING btree ("site_hero_cover_mobile_id");
  CREATE INDEX "site_settings_site_site_homepage_slider_idx" ON "site_settings" USING btree ("site_homepage_slider_id");
  ALTER TABLE "pages" DROP COLUMN "hero_rich_text";
  ALTER TABLE "pages" DROP COLUMN "hero_media_id";
  ALTER TABLE "pages_rels" DROP COLUMN "media_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_rich_text";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_media_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "media_id";
  ALTER TABLE "media" DROP COLUMN "folder_id";
  ALTER TABLE "tours_extras" DROP COLUMN "title";
  ALTER TABLE "tours_extras" DROP COLUMN "price_group";
  ALTER TABLE "tours_extras" DROP COLUMN "price_solo";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_folders_id";
  DROP TYPE "public"."enum_pages_hero_links_link_type";
  DROP TYPE "public"."enum_pages_hero_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_version_hero_links_link_type";
  DROP TYPE "public"."enum__pages_v_version_hero_links_link_appearance";
  DROP TYPE "public"."enum_payload_folders_folder_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_hero_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_version_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_version_hero_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_payload_folders_folder_type" AS ENUM('media');
  CREATE TABLE "pages_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_hero_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_image_slider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_version_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_version_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_version_hero_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_slider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "tour_list_pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "payload_folders_folder_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_payload_folders_folder_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload_folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "posts_blocks_text_container" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_full_bleed_parallax" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_full_bleed_static" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_image_carousel" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_faq_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_video_embed" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_media_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_text_container" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_full_bleed_parallax" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_full_bleed_static" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_image_carousel" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_faq_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_video_embed" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_media_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sliders" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sliders_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_text_container" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_full_bleed_parallax" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_full_bleed_static" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_image_carousel" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_video_embed" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_contact_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_simulator_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_text_container" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_full_bleed_parallax" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_full_bleed_static" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_image_carousel" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_faq_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_video_embed" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_contact_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_simulator_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "optional_extras" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_messages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "email_templates_recipients" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "email_templates" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "faq" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "posts_blocks_text_container" CASCADE;
  DROP TABLE "posts_blocks_full_bleed_parallax" CASCADE;
  DROP TABLE "posts_blocks_full_bleed_static" CASCADE;
  DROP TABLE "posts_blocks_image_carousel" CASCADE;
  DROP TABLE "posts_blocks_faq_block" CASCADE;
  DROP TABLE "posts_blocks_video_embed" CASCADE;
  DROP TABLE "posts_blocks_media_block" CASCADE;
  DROP TABLE "_posts_v_blocks_text_container" CASCADE;
  DROP TABLE "_posts_v_blocks_full_bleed_parallax" CASCADE;
  DROP TABLE "_posts_v_blocks_full_bleed_static" CASCADE;
  DROP TABLE "_posts_v_blocks_image_carousel" CASCADE;
  DROP TABLE "_posts_v_blocks_faq_block" CASCADE;
  DROP TABLE "_posts_v_blocks_video_embed" CASCADE;
  DROP TABLE "_posts_v_blocks_media_block" CASCADE;
  DROP TABLE "sliders" CASCADE;
  DROP TABLE "sliders_rels" CASCADE;
  DROP TABLE "pages_blocks_text_container" CASCADE;
  DROP TABLE "pages_blocks_full_bleed_parallax" CASCADE;
  DROP TABLE "pages_blocks_full_bleed_static" CASCADE;
  DROP TABLE "pages_blocks_image_carousel" CASCADE;
  DROP TABLE "pages_blocks_faq_block" CASCADE;
  DROP TABLE "pages_blocks_video_embed" CASCADE;
  DROP TABLE "pages_blocks_contact_block" CASCADE;
  DROP TABLE "pages_blocks_simulator_block" CASCADE;
  DROP TABLE "_pages_v_blocks_text_container" CASCADE;
  DROP TABLE "_pages_v_blocks_full_bleed_parallax" CASCADE;
  DROP TABLE "_pages_v_blocks_full_bleed_static" CASCADE;
  DROP TABLE "_pages_v_blocks_image_carousel" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_block" CASCADE;
  DROP TABLE "_pages_v_blocks_video_embed" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_block" CASCADE;
  DROP TABLE "_pages_v_blocks_simulator_block" CASCADE;
  DROP TABLE "optional_extras" CASCADE;
  DROP TABLE "contact_messages" CASCADE;
  DROP TABLE "email_templates_recipients" CASCADE;
  DROP TABLE "email_templates" CASCADE;
  DROP TABLE "faq_items" CASCADE;
  DROP TABLE "faq" CASCADE;
  ALTER TABLE "pages" DROP CONSTRAINT "pages_hero_hero_image_id_media_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_hero_hero_image_mobile_id_media_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_hero_hero_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_hero_hero_image_mobile_id_media_id_fk";
  
  ALTER TABLE "tours_extras" DROP CONSTRAINT "tours_extras_extra_id_optional_extras_id_fk";
  
  ALTER TABLE "tour_list_pages" DROP CONSTRAINT "tour_list_pages_slider_id_sliders_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_sliders_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_optional_extras_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_contact_messages_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_email_templates_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_site_hero_video_desktop_id_media_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_site_hero_video_mobile_id_media_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_site_hero_cover_desktop_id_media_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_site_hero_cover_mobile_id_media_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_site_homepage_slider_id_sliders_id_fk";
  
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE text;
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::text;
  DROP TYPE "public"."enum_pages_hero_type";
  CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::"public"."enum_pages_hero_type";
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE "public"."enum_pages_hero_type" USING "hero_type"::"public"."enum_pages_hero_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::text;
  DROP TYPE "public"."enum__pages_v_version_hero_type";
  CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::"public"."enum__pages_v_version_hero_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE "public"."enum__pages_v_version_hero_type" USING "version_hero_type"::"public"."enum__pages_v_version_hero_type";
  DROP INDEX "pages_hero_hero_hero_image_idx";
  DROP INDEX "pages_hero_hero_hero_image_mobile_idx";
  DROP INDEX "_pages_v_version_hero_version_hero_hero_image_idx";
  DROP INDEX "_pages_v_version_hero_version_hero_hero_image_mobile_idx";
  DROP INDEX "tours_extras_extra_idx";
  DROP INDEX "tour_list_pages_slider_idx";
  DROP INDEX "payload_locked_documents_rels_sliders_id_idx";
  DROP INDEX "payload_locked_documents_rels_optional_extras_id_idx";
  DROP INDEX "payload_locked_documents_rels_contact_messages_id_idx";
  DROP INDEX "payload_locked_documents_rels_email_templates_id_idx";
  DROP INDEX "site_settings_site_site_hero_video_desktop_idx";
  DROP INDEX "site_settings_site_site_hero_video_mobile_idx";
  DROP INDEX "site_settings_site_site_hero_cover_desktop_idx";
  DROP INDEX "site_settings_site_site_hero_cover_mobile_idx";
  DROP INDEX "site_settings_site_site_homepage_slider_idx";
  ALTER TABLE "media" ADD COLUMN "folder_id" integer;
  ALTER TABLE "pages" ADD COLUMN "hero_rich_text" jsonb;
  ALTER TABLE "pages" ADD COLUMN "hero_media_id" integer;
  ALTER TABLE "pages_rels" ADD COLUMN "media_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_rich_text" jsonb;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_media_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "media_id" integer;
  ALTER TABLE "tours_extras" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "tours_extras" ADD COLUMN "price_group" varchar;
  ALTER TABLE "tours_extras" ADD COLUMN "price_solo" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_folders_id" integer;
  ALTER TABLE "pages_hero_links" ADD CONSTRAINT "pages_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_slider" ADD CONSTRAINT "pages_blocks_image_slider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_links" ADD CONSTRAINT "_pages_v_version_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_slider" ADD CONSTRAINT "_pages_v_blocks_image_slider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tour_list_pages_rels" ADD CONSTRAINT "tour_list_pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tour_list_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tour_list_pages_rels" ADD CONSTRAINT "tour_list_pages_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders_folder_type" ADD CONSTRAINT "payload_folders_folder_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders" ADD CONSTRAINT "payload_folders_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_hero_links_order_idx" ON "pages_hero_links" USING btree ("_order");
  CREATE INDEX "pages_hero_links_parent_id_idx" ON "pages_hero_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_slider_order_idx" ON "pages_blocks_image_slider" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_slider_parent_id_idx" ON "pages_blocks_image_slider" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_slider_path_idx" ON "pages_blocks_image_slider" USING btree ("_path");
  CREATE INDEX "_pages_v_version_hero_links_order_idx" ON "_pages_v_version_hero_links" USING btree ("_order");
  CREATE INDEX "_pages_v_version_hero_links_parent_id_idx" ON "_pages_v_version_hero_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_slider_order_idx" ON "_pages_v_blocks_image_slider" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_slider_parent_id_idx" ON "_pages_v_blocks_image_slider" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_slider_path_idx" ON "_pages_v_blocks_image_slider" USING btree ("_path");
  CREATE INDEX "tour_list_pages_rels_order_idx" ON "tour_list_pages_rels" USING btree ("order");
  CREATE INDEX "tour_list_pages_rels_parent_idx" ON "tour_list_pages_rels" USING btree ("parent_id");
  CREATE INDEX "tour_list_pages_rels_path_idx" ON "tour_list_pages_rels" USING btree ("path");
  CREATE INDEX "tour_list_pages_rels_media_id_idx" ON "tour_list_pages_rels" USING btree ("media_id");
  CREATE INDEX "payload_folders_folder_type_order_idx" ON "payload_folders_folder_type" USING btree ("order");
  CREATE INDEX "payload_folders_folder_type_parent_idx" ON "payload_folders_folder_type" USING btree ("parent_id");
  CREATE INDEX "payload_folders_name_idx" ON "payload_folders" USING btree ("name");
  CREATE INDEX "payload_folders_folder_idx" ON "payload_folders" USING btree ("folder_id");
  CREATE INDEX "payload_folders_updated_at_idx" ON "payload_folders" USING btree ("updated_at");
  CREATE INDEX "payload_folders_created_at_idx" ON "payload_folders" USING btree ("created_at");
  ALTER TABLE "media" ADD CONSTRAINT "media_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_media_id_media_id_fk" FOREIGN KEY ("version_hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_folders_fk" FOREIGN KEY ("payload_folders_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "media_folder_idx" ON "media" USING btree ("folder_id");
  CREATE INDEX "pages_hero_hero_media_idx" ON "pages" USING btree ("hero_media_id");
  CREATE INDEX "pages_rels_media_id_idx" ON "pages_rels" USING btree ("media_id");
  CREATE INDEX "_pages_v_version_hero_version_hero_media_idx" ON "_pages_v" USING btree ("version_hero_media_id");
  CREATE INDEX "_pages_v_rels_media_id_idx" ON "_pages_v_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_payload_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_folders_id");
  ALTER TABLE "pages" DROP COLUMN "hero_hero_headline";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_image_id";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_image_mobile_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_headline";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_image_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_image_mobile_id";
  ALTER TABLE "tours_extras" DROP COLUMN "extra_id";
  ALTER TABLE "tour_list_pages" DROP COLUMN "slider_id";
  ALTER TABLE "bookings" DROP COLUMN "pickup_spot";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "sliders_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "optional_extras_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "contact_messages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "email_templates_id";
  ALTER TABLE "site_settings" DROP COLUMN "booking_tour_time_start";
  ALTER TABLE "site_settings" DROP COLUMN "booking_tour_time_end";
  ALTER TABLE "site_settings" DROP COLUMN "booking_airport_time_start";
  ALTER TABLE "site_settings" DROP COLUMN "booking_airport_time_end";
  ALTER TABLE "site_settings" DROP COLUMN "booking_success_line1";
  ALTER TABLE "site_settings" DROP COLUMN "booking_success_line2";
  ALTER TABLE "site_settings" DROP COLUMN "site_hero_video_desktop_id";
  ALTER TABLE "site_settings" DROP COLUMN "site_hero_video_mobile_id";
  ALTER TABLE "site_settings" DROP COLUMN "site_hero_cover_desktop_id";
  ALTER TABLE "site_settings" DROP COLUMN "site_hero_cover_mobile_id";
  ALTER TABLE "site_settings" DROP COLUMN "site_site_title";
  ALTER TABLE "site_settings" DROP COLUMN "site_site_description";
  ALTER TABLE "site_settings" DROP COLUMN "site_homepage_slider_id";
  DROP TYPE "public"."enum_posts_blocks_text_container_spacing_top";
  DROP TYPE "public"."enum_posts_blocks_text_container_spacing_bottom";
  DROP TYPE "public"."enum_posts_blocks_text_container_image_position";
  DROP TYPE "public"."enum_posts_blocks_video_embed_position";
  DROP TYPE "public"."enum__posts_v_blocks_text_container_spacing_top";
  DROP TYPE "public"."enum__posts_v_blocks_text_container_spacing_bottom";
  DROP TYPE "public"."enum__posts_v_blocks_text_container_image_position";
  DROP TYPE "public"."enum__posts_v_blocks_video_embed_position";
  DROP TYPE "public"."enum_pages_blocks_text_container_spacing_top";
  DROP TYPE "public"."enum_pages_blocks_text_container_spacing_bottom";
  DROP TYPE "public"."enum_pages_blocks_text_container_image_position";
  DROP TYPE "public"."enum_pages_blocks_video_embed_position";
  DROP TYPE "public"."enum_pages_blocks_simulator_block_spacing_top";
  DROP TYPE "public"."enum_pages_blocks_simulator_block_spacing_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_text_container_spacing_top";
  DROP TYPE "public"."enum__pages_v_blocks_text_container_spacing_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_text_container_image_position";
  DROP TYPE "public"."enum__pages_v_blocks_video_embed_position";
  DROP TYPE "public"."enum__pages_v_blocks_simulator_block_spacing_top";
  DROP TYPE "public"."enum__pages_v_blocks_simulator_block_spacing_bottom";
  DROP TYPE "public"."enum_optional_extras_city";
  DROP TYPE "public"."enum_contact_messages_status";
  DROP TYPE "public"."enum_email_templates_template_key";`)
}
