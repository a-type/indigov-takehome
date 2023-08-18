# 18/18/23

Began: 10:40AM

Starting from Remix' Indie stack. Rather than clutter the codebase with unnecessary features, I'm removing login/auth/sessions, existing pages, and resetting the database schema to only include relevant models.

Headed directly for minimal functionality, I used simple synchronous CSV parsing and an upsert for each individual parsed record wrapped in a transaction. The upsert is keyed on the `email` column, which has a unique constraint. This should prevent duplicate insertions. The upsert also updates data if the incoming info is newer (normally this would be a product discussion, but I'm making an assumption about user expectations here). The upload logic has basic validation via Zod schema.

I've also reused the same logic to seed the initial database state from the provided file. I noticed from this that there is at least one `email` field in a row which is not a valid email, so I adjusted the Zod schema not to validate email contents. May investigate further.

This basic but ugly functionality is complete. Committing work so far, with remaining time I'll try to polish a bit more.

Ended: 11:30 AM

---

Began: 2:30 PM

Cleaning up TypeScript errors and other problems from CI, including PNPM install.

Aha! I knew the malformatted email thing was fishy. I was not consuming the header row correctly, so I was seeding it as a normal entry.

Otherwise, spending some time on user feedback for form submission. Goal is to get basic loading, error, and success feedback states in, as well as the requirement for client-side preview of the CSV data.

Paused: 3:00 PM, Resumed 3:20 PM

Email validation is back for the Town Hall dataset after restoring the validation schema. Looking into what I'm sending.
