ALTER TABLE "property" DROP CONSTRAINT "property_property_id_unique";--> statement-breakpoint
ALTER TABLE "property" ALTER COLUMN "url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "property" DROP COLUMN "property_id";--> statement-breakpoint
ALTER TABLE "property" ADD CONSTRAINT "property_url_unique" UNIQUE("url");