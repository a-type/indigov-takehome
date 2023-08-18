# 18/18/23

Began: 10:40AM

Starting from Remix' Indie stack. Rather than clutter the codebase with unnecessary features, I'm removing login/auth/sessions, existing pages, and resetting the database schema to only include relevant models.

Headed directly for minimal functionality, I used simple synchronous CSV parsing and an upsert for each individual parsed record wrapped in a transaction. The upsert is keyed on the `email` column, which has a unique constraint. This should prevent duplicate insertions. The upsert also updates data if the incoming info is newer (normally this would be a product discussion, but I'm making an assumption about user expectations here). The upload logic has basic validation via Zod schema.

I've also reused the same logic to seed the initial database state from the provided file. I noticed from this that there is at least one `email` field in a row which is not a valid email, so I adjusted the Zod schema not to validate email contents. May investigate further.

This basic but ugly functionality is complete. Committing work so far, with remaining time I'll try to polish a bit more.

Ended: 11:30 AM
