CREATE TYPE "public"."payment_status_choices" AS ENUM('pending', 'paid', 'canceled', 'not_applicable');--> statement-breakpoint
CREATE TABLE "registrations" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"attendees" integer NOT NULL,
	"classes" text NOT NULL,
	"corsages" integer DEFAULT 0 NOT NULL,
	"boutonnieres" integer DEFAULT 0 NOT NULL,
	"stripe_session_id" text,
	"payment_status" "payment_status_choices" DEFAULT 'not_applicable',
	"amount_paid" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"token_expiration" timestamp
);
