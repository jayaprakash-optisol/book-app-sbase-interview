DO $$ BEGIN
 CREATE TYPE "userRole" AS ENUM('ADMIN', 'BASIC');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "book" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"genre" varchar NOT NULL,
	"publisher" varchar NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"age" integer NOT NULL,
	"email" varchar(255) NOT NULL,
	"userRole" "userRole" DEFAULT 'BASIC' NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);

-- Create a trigger on the book table
CREATE OR REPLACE FUNCTION update_deleted_at_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_deleted THEN
        NEW.deleted_at = NOW(); 
    ELSE
        NEW.deleted_at = NULL; 
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER book_update_deleted_at_trigger
BEFORE UPDATE ON book
FOR EACH ROW
EXECUTE FUNCTION update_deleted_at_trigger();

