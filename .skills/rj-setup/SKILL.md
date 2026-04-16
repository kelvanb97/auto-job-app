---
name: rj-setup
description: >
    Use when the user says "/rj-setup", "$rj-setup", "rj-setup", "configure
    rocket jobs", "first time setup", or wants help filling in /settings for
    the first time. Walks through each settings tab via Playwright MCP,
    mixing chat-driven prompts (for conceptual fields like LLM keys, EEO,
    scoring weights) with tour-driven prompts (for plain text fields).
    Suggests resume upload as a shortcut.
user-invocable: true
---

# rj-setup Skill

Walk the user through `/settings` end-to-end so a fresh database has everything it needs to start scraping, scoring, and applying. Use a "smart" mix:

- **Chat-driven** for fields that need explanation or context (API keys, EEO, scoring weights, scraper sources).
- **Tour-driven** for plain text fields (just open the tab, point at it, ask the user to type, verify, move on).
- **Resume upload as a shortcut** for Profile / Experience / Education — offer it before walking those tabs by hand.

Use the **Playwright MCP** browser tools (e.g. `browser_navigate`, `browser_snapshot`, `browser_click`). Tool names follow the [MCP](https://modelcontextprotocol.io) spec; your harness may expose them under a server prefix (e.g. Claude Code surfaces them as `mcp__playwright__browser_navigate`, while other harnesses may expose them by their bare name).

## Step 0: Pre-flight — is the dev server running?

Probe first:

```bash
curl -sf http://localhost:3000 > /dev/null && echo OK || echo DOWN
```

- **OK** → continue to Step 1.
- **DOWN** → try to start it automatically (below). Don't ask the user first; just do it.

### Auto-start the dev server

1. Start `pnpm dev` in the background (Bash tool with `run_in_background: true`). Capture the background process so you can read its output on failure:

    ```bash
    pnpm dev
    ```

2. Poll readiness for up to 60 seconds:

    ```bash
    for i in $(seq 1 60); do
      curl -sf http://localhost:3000 > /dev/null && echo "OK" && break
      sleep 1
    done
    ```

3. **If `OK` is seen:** tell the user:

    > "Dev server wasn't running — started `pnpm dev` in the background. It will stay running after this skill exits so you can keep using the app. Continuing setup."

    Then continue to Step 1. **Do not kill the background process** — the rest of this skill (and the user's subsequent work) depends on it.

4. **If no `OK` after 60 seconds:** read the background process output with the `Read` tool (or `BashOutput` equivalent in your harness), surface the last ~30 lines of stdout/stderr to the user, then stop with:

    > "I tried to start the dev server but it didn't come up on <http://localhost:3000>. If you haven't installed yet, invoke the `rj-install` skill first. Otherwise check the output above — likely a missing dep, broken migration, or port conflict — then invoke the `rj-setup` skill again once `pnpm dev` boots cleanly."

## Step 1: Open /llm-config in the browser

LLM config lives on its own page now. Do it first so that when we get to `/settings`, the resume-upload shortcut is already enabled.

```
browser_navigate → http://localhost:3000/llm-config
```

Do **not** snapshot, inspect, or manipulate this page. The user drives it themselves — controlling the form is overkill for a handful of keys and dropdowns.

## Step 2: LLM Provider (user-driven, FIRST)

Post this message to chat verbatim (adjust only the link text formatting for your harness):

> "The app uses Claude (Anthropic) and/or GPT (OpenAI) for scoring jobs, generating resumes, generating cover letters, and parsing uploaded resumes. You need at least one API key.
>
> - Anthropic key: <https://console.anthropic.com/settings/keys>
> - OpenAI key: <https://platform.openai.com/api-keys>
>
> The LLM config page is open in the browser. Fill in your key(s), set the provider/model dropdowns for each use case, and click Save. Let me know when you're done (or say 'skip' if keys are already configured) and I'll continue to Settings."

Then **wait for the user**. Do not navigate, snapshot, type, click, or verify. Secrets belong in the page, not the transcript — never ask the user to paste a key into chat.

When the user confirms they're done (or says skip), continue to Step 3.

## Step 3: Profile / Experience / Education — offer resume upload first

Navigate to `/settings`:

```
browser_navigate → http://localhost:3000/settings
browser_snapshot
```

Ask in chat:

> "Want to import your profile, work experience, and education from a PDF or DOCX resume? It's much faster than typing each one out. Or we can fill them in by hand."

**If the user wants to upload:**

1. Ask the user to drag and drop their resume file into the chat if their harness supports it. If not, ask for the absolute file path.
2. Copy the file into the project directory because Playwright MCP may restrict file access to the project root:
    ```bash
    cp '<ORIGINAL_PATH>' '<PROJECT_ROOT>/data/tmp-resume-upload.<ext>'
    ```
3. Use the Playwright MCP `browser_run_code` tool to trigger the file chooser and attach the project-local copy in one atomic action:
    ```js
    ;async (page) => {
        const [fileChooser] = await Promise.all([
            page.waitForEvent("filechooser"),
            page.getByRole("button", { name: "Upload Resume" }).click(),
        ])
        await fileChooser.setFiles(
            "<PROJECT_ROOT>/data/tmp-resume-upload.<ext>",
        )
    }
    ```
4. Clean up the temporary project-local copy after upload completes:
    ```bash
    rm '<PROJECT_ROOT>/data/tmp-resume-upload.<ext>'
    ```
5. Wait for the preview modal to appear (`browser_wait_for` text "Apply Selected" or similar).
6. Read the modal's contents back to the user. Help them decide which rows to keep checked. Click "Apply Selected".
7. Snapshot to confirm the modal closed and the Profile / Experience / Education tabs are populated.
8. Skip Steps 3a / 3b / 3c below (they're already done).

**If the user prefers to type by hand:**

### Step 3a: Profile (tour-driven)

Walk through the visible fields in the Profile tab. For each one, ask the user to provide a value in chat, then type it via Playwright. Required fields: name, email, phone, jobTitle. Optional: location, links, summary, skills.

Click Save.

### Step 3b: Experience (tour-driven)

Click the **Experience** tab. For each role the user wants to add, click "Add Experience", fill in company / title / startDate / endDate / type / techStack / highlights, click Save. Repeat until the user says they're done.

### Step 3c: Education (tour-driven)

Click the **Education** tab. For each entry, click "Add Education", fill in degree / field / institution, click Save. Repeat until done.

## Step 4: Scraper Config (chat-driven for sources, tour-driven for keywords)

Click the **Scraper Config** tab. Explain in chat:

> "The scraper pulls jobs from LinkedIn. You'll need to sign in once (the scrape skill handles that)."

Ask the user which sources to enable. Toggle them in the form.

For **Relevant Keywords** and **Blocked Keywords**: do **not** suggest values. These fields filter against job **titles only** (not descriptions, not skills), so generic tech suggestions like `typescript` / `react` / `node` reject legitimate matches whose titles are things like "Senior Software Engineer". Ask the user for their own comma-separated list, and briefly explain the title-only matching so they can pick wisely.

Ask the user for any blocked companies. Fill in. Click Save.

If the user enabled LinkedIn, walk over to the **LinkedIn** tab and explain that they need to add at least one LinkedIn search URL (e.g. <https://www.linkedin.com/jobs/search/?keywords=frontend%20engineer>). Help them build one.

## Step 5: EEO & Work Auth (chat-driven)

Click the **EEO & Work Auth** tab. Explain in chat:

> "These are optional demographic questions that often appear in application forms. The auto-apply skill uses these answers to fill those fields automatically. You can leave them all blank — auto-apply will skip them. Or fill them in once here so you don't have to retype them on every application."

Ask each question gently:

- Gender: prefer not to say / male / female / non-binary
- Ethnicity: prefer not to say / [list]
- Veteran status: prefer not to say / yes / no
- Disability status: prefer not to say / yes / no
- **Work authorization** (this one matters): "Authorized to work without sponsorship" / "Need visa sponsorship"
- Requires visa sponsorship (boolean)

Fill via Playwright. Click Save.

## Step 6: Scoring Weights (chat-driven)

Click the **Scoring Weights** tab. Explain:

> "This is how the AI scores each role. Each factor can be weighted High / Medium / Low. The scorer multiplies these against its evaluation of the role to produce a 0–100 score."

Walk through each:

- **Title and seniority** — does the role title and level match what you want? (Default: high)
- **Skills** — does the role need skills you have? (Default: high)
- **Salary** — is the salary in your range? (Default: high)
- **Location** — is the location remote / where you want? (Default: medium)
- **Industry** — is the industry one you want? (Default: low)

Ask which they want to bump or lower. Fill via Playwright. Click Save.

## Step 7: Hand off

Tell the user:

> "Setup complete! You're ready to:
>
> - Invoke the `rj-scrape` skill to pull new job listings
> - Invoke the `rj-auto-apply` skill after scoring to apply to the top-scored unapplied role
> - Open <http://localhost:3000> to see your dashboard
>
> You can come back to <http://localhost:3000/settings> any time to update these values."

Close the Playwright browser with the `browser_close` tool, then stop.

## Notes

- If the dev server dies mid-walkthrough, tell the user and stop. Don't try to restart it from this skill (auto-start is pre-flight only, in Step 0).
- If a Playwright action fails twice in a row on the same field, surface the failure to the user and ask whether to skip that field or stop.
- Don't try to verify saved values via the API — verify by re-snapshotting the form and reading the input values from the DOM.
