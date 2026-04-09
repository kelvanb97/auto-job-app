CREATE TABLE `llm_config` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_profile_id` integer NOT NULL,
	`anthropic_api_key` text DEFAULT '' NOT NULL,
	`openai_api_key` text DEFAULT '' NOT NULL,
	`scoring_provider` text DEFAULT 'anthropic' NOT NULL,
	`scoring_model` text DEFAULT 'claude-haiku-4-5' NOT NULL,
	`keyword_provider` text DEFAULT 'anthropic' NOT NULL,
	`keyword_model` text DEFAULT 'claude-haiku-4-5' NOT NULL,
	`resume_provider` text DEFAULT 'anthropic' NOT NULL,
	`resume_model` text DEFAULT 'claude-opus-4-6' NOT NULL,
	`cover_letter_provider` text DEFAULT 'anthropic' NOT NULL,
	`cover_letter_model` text DEFAULT 'claude-opus-4-6' NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_profile_id`) REFERENCES `user_profile`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `llm_config_user_profile_id_unique` ON `llm_config` (`user_profile_id`);
