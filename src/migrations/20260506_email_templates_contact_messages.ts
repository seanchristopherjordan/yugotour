import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`

   -- Enum: email template keys
   CREATE TYPE "public"."enum_email_templates_template_key" AS ENUM(
    'booking_guest_confirmation',
    'booking_staff_belgrade',
    'booking_staff_sarajevo',
    'contact_staff_notification'
   );

   -- Enum: contact message status
   CREATE TYPE "public"."enum_contact_messages_status" AS ENUM('new', 'read', 'replied');

   -- email_templates: main record
   CREATE TABLE IF NOT EXISTS "email_templates" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar NOT NULL,
    "template_key" "enum_email_templates_template_key" NOT NULL,
    "from_name" varchar,
    "from_email" varchar,
    "subject" varchar,
    "preheader" varchar,
    "body" jsonb,
    "logo_id" integer,
    "signature_id" integer,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
   );

   -- email_templates_recipients: one row per recipient address
   CREATE TABLE IF NOT EXISTS "email_templates_recipients" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "email" varchar NOT NULL
   );

   -- contact_messages
   CREATE TABLE IF NOT EXISTS "contact_messages" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar NOT NULL,
    "email" varchar NOT NULL,
    "message" varchar NOT NULL,
    "status" "enum_contact_messages_status" DEFAULT 'new',
    "ip_address" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
   );

   -- Foreign keys
   ALTER TABLE "email_templates" ADD CONSTRAINT "email_templates_logo_id_media_id_fk"
    FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "email_templates" ADD CONSTRAINT "email_templates_signature_id_media_id_fk"
    FOREIGN KEY ("signature_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "email_templates_recipients" ADD CONSTRAINT "email_templates_recipients_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."email_templates"("id") ON DELETE cascade ON UPDATE no action;

   -- Indexes
   CREATE UNIQUE INDEX IF NOT EXISTS "email_templates_template_key_idx" ON "email_templates" USING btree ("template_key");
   CREATE INDEX IF NOT EXISTS "email_templates_logo_idx" ON "email_templates" USING btree ("logo_id");
   CREATE INDEX IF NOT EXISTS "email_templates_signature_idx" ON "email_templates" USING btree ("signature_id");
   CREATE INDEX IF NOT EXISTS "email_templates_created_at_idx" ON "email_templates" USING btree ("created_at");
   CREATE INDEX IF NOT EXISTS "email_templates_recipients_order_idx" ON "email_templates_recipients" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "email_templates_recipients_parent_id_idx" ON "email_templates_recipients" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "contact_messages_created_at_idx" ON "contact_messages" USING btree ("created_at");
   CREATE INDEX IF NOT EXISTS "contact_messages_status_idx" ON "contact_messages" USING btree ("status");

  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "email_templates_recipients" DROP CONSTRAINT IF EXISTS "email_templates_recipients_parent_id_fk";
   ALTER TABLE "email_templates" DROP CONSTRAINT IF EXISTS "email_templates_logo_id_media_id_fk";
   ALTER TABLE "email_templates" DROP CONSTRAINT IF EXISTS "email_templates_signature_id_media_id_fk";
   DROP TABLE IF EXISTS "email_templates_recipients" CASCADE;
   DROP TABLE IF EXISTS "email_templates" CASCADE;
   DROP TABLE IF EXISTS "contact_messages" CASCADE;
   DROP TYPE IF EXISTS "public"."enum_email_templates_template_key";
   DROP TYPE IF EXISTS "public"."enum_contact_messages_status";
  `)
}
