PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_llm_config` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`anthropic_api_key` text DEFAULT '' NOT NULL,
	`openai_api_key` text DEFAULT '' NOT NULL,
	`scoring_provider` text DEFAULT 'anthropic' NOT NULL,
	`scoring_model` text NOT NULL,
	`keyword_provider` text DEFAULT 'anthropic' NOT NULL,
	`keyword_model` text NOT NULL,
	`resume_provider` text DEFAULT 'anthropic' NOT NULL,
	`resume_model` text NOT NULL,
	`cover_letter_provider` text DEFAULT 'anthropic' NOT NULL,
	`cover_letter_model` text NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_llm_config`("id", "anthropic_api_key", "openai_api_key", "scoring_provider", "scoring_model", "keyword_provider", "keyword_model", "resume_provider", "resume_model", "cover_letter_provider", "cover_letter_model", "created_at", "updated_at") SELECT "id", "anthropic_api_key", "openai_api_key", "scoring_provider", "scoring_model", "keyword_provider", "keyword_model", "resume_provider", "resume_model", "cover_letter_provider", "cover_letter_model", "created_at", "updated_at" FROM `llm_config`;--> statement-breakpoint
DROP TABLE `llm_config`;--> statement-breakpoint
ALTER TABLE `__new_llm_config` RENAME TO `llm_config`;--> statement-breakpoint
PRAGMA foreign_keys=ON;