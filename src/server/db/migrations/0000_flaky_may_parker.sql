CREATE TABLE "property" (
	"id" varchar(10) PRIMARY KEY NOT NULL,
	"property_id" varchar(256) NOT NULL,
	"name" varchar(256) NOT NULL,
	"price" integer,
	"subtitle" varchar,
	"description" text,
	"land_size" varchar,
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"url" varchar(512),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "property_property_id_unique" UNIQUE("property_id")
);
