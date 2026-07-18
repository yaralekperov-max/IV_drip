CREATE SCHEMA "medical";
--> statement-breakpoint
CREATE TYPE "public"."analysis_status" AS ENUM('parsing', 'awaiting_review', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."payment_kind" AS ENUM('payment', 'refund');--> statement-breakpoint
CREATE TYPE "public"."result_status" AS ENUM('recognized', 'edited', 'approved');--> statement-breakpoint
CREATE TYPE "public"."staff_role" AS ENUM('doctor', 'operator', 'admin');--> statement-breakpoint
CREATE TYPE "public"."visit_status" AS ENUM('pending', 'confirmed', 'assigned', 'done', 'cancelled');--> statement-breakpoint
CREATE TABLE "addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"label" text,
	"address" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medical"."analysis_uploads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"file_key" text NOT NULL,
	"lab" text,
	"status" "analysis_status" DEFAULT 'parsing' NOT NULL,
	"consent_at" timestamp with time zone,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medical"."biomarker_catalog" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"unit" text,
	"category" text,
	"aliases" jsonb DEFAULT '[]'::jsonb,
	"reference_ranges" jsonb DEFAULT '[]'::jsonb,
	"sort" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"description" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medical"."biomarker_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"upload_id" uuid NOT NULL,
	"catalog_code" text,
	"raw_name" text,
	"value" numeric,
	"unit" text,
	"status" "result_status" DEFAULT 'recognized' NOT NULL,
	"taken_at" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone" text NOT NULL,
	"name" text,
	"email" text,
	"amocrm_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "otp_codes" (
	"phone" text PRIMARY KEY NOT NULL,
	"code_hash" text NOT NULL,
	"name" text,
	"attempts" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"visit_id" uuid,
	"amount_rub" integer NOT NULL,
	"kind" "payment_kind" DEFAULT 'payment' NOT NULL,
	"method" text,
	"receipt_no" text,
	"yookassa_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staff" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone" text NOT NULL,
	"name" text NOT NULL,
	"role" "staff_role" DEFAULT 'operator' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "visits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"program" text NOT NULL,
	"desired_date" date,
	"desired_time" text,
	"address_id" uuid,
	"status" "visit_status" DEFAULT 'pending' NOT NULL,
	"brigade_note" text,
	"price_rub" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medical"."biomarker_results" ADD CONSTRAINT "biomarker_results_upload_id_analysis_uploads_id_fk" FOREIGN KEY ("upload_id") REFERENCES "medical"."analysis_uploads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_visit_id_visits_id_fk" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visits" ADD CONSTRAINT "visits_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visits" ADD CONSTRAINT "visits_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "uploads_client_idx" ON "medical"."analysis_uploads" USING btree ("client_id");--> statement-breakpoint
CREATE UNIQUE INDEX "biomarker_code_uq" ON "medical"."biomarker_catalog" USING btree ("code");--> statement-breakpoint
CREATE INDEX "results_upload_idx" ON "medical"."biomarker_results" USING btree ("upload_id");--> statement-breakpoint
CREATE UNIQUE INDEX "clients_phone_uq" ON "clients" USING btree ("phone");--> statement-breakpoint
CREATE UNIQUE INDEX "staff_phone_uq" ON "staff" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "visits_client_idx" ON "visits" USING btree ("client_id");