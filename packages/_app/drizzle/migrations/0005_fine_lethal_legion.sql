CREATE TABLE `certification` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_profile_id` integer NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`name` text NOT NULL,
	`issuer` text NOT NULL,
	`issue_date` text,
	`expiration_date` text,
	`url` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_profile_id`) REFERENCES `user_profile`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_certification_user_profile_id` ON `certification` (`user_profile_id`);