import 'dotenv/config'
import { Client } from 'pg'

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()

  await client.query(`
    CREATE TABLE IF NOT EXISTS "reviews" (
      "id" serial PRIMARY KEY NOT NULL,
      "city" varchar NOT NULL,
      "reviewer_name" varchar NOT NULL,
      "reviewer_avatar_id" integer,
      "reviewer_avatar_url" varchar,
      "rating" numeric NOT NULL,
      "review_text" text NOT NULL,
      "published_at" timestamp(3) with time zone NOT NULL,
      "google_review_id" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "reviews_city_idx" ON "reviews" USING btree ("city");
    CREATE INDEX IF NOT EXISTS "reviews_created_at_idx" ON "reviews" USING btree ("created_at");
  `)

  console.log('Done: created reviews table.')
  await client.end()
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
