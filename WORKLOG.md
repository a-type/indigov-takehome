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

Sure enough, there's a legitimately invalid email (2nd row). So the validation failure is... valid. I'm not thrilled with the UX of rejecting the whole request for 1 invalid row, but I don't want to run over time to fix it. I assume ya'll will be happy enough if I just do a bit of speculation on how I'd approach it. Probably I'd store any invalid incoming rows in an array during validation, and filter them out of the set before storing in the database. I'd then return a formatted error which indicates the row number and the validation problem for each invalid row, and surface that to the user via a dismissable dialog or directly within the upload dialog.

Speaking of, I added an upload dialog to have a place to display the CSV preview. I'm using `csv-parse` on the backend, so I pulled in its browser ESM bundle. I opted to use a dynamic `import()` inline within the preview component, in part because I haven't set this project up for ESM, but also because there's no reason to load the whole parser library on the client unless there's a CSV to parse.

90 minutes isn't super long, so I have a laundry list of things I'd do next:

- Clean up the styling, a lot. It's super ugly right now, with only functional styles applied.
- Centralize the display logic for the constituent table. I didn't get around to any client-side validation, so I opted to make the tables pretty free-form and adapt to whatever data they're given. In a real app I would consolidate how constituents are represented to the user and come up with a way to surface invalid rows before submitting for processing.
- More user-friendly validation errors as mentioned above.

Completed 4:00 PM
