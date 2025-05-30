ALTER TABLE "job_posting" ALTER COLUMN "salary" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "job_posting" ALTER COLUMN "salary" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "job_posting" ADD COLUMN "experiences" text DEFAULT 'Not specified' NOT NULL;