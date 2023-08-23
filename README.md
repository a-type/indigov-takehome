# indigov takehome: constituent list manager

Hi! Here's what I was able to put together in ~90 minutes. It's functionally complete, but a bit messy. I've left `FIXME:` comments on things I would update. I've also kept a work log [here](./WORKLOG.md) with my thoughts over time as I set about the project, as well as a time breakdown for transparency.

## Running the app

I use PNPM. If you don't have that, you might need it to have a smooth experience. It might also just work with NPM out of the box.

```
npm i -g pnpm
```

Install dependencies

```
pnpm i
```

Create a `.env` file

```
cp .env.example .env
```

Migrate the database

```
pnpm prisma migrate dev
```

Seed the database

```
pnpm prisma db seed
```

Start the app

```
pnpm dev
```

The app will be running on http://localhost:3000.

## Overview and limitations

It only does the main requirements, plus basic validation on the uploaded data. Click [Upload CSV] to open the upload dialog, select a file to preview it, and click [Upload] to send it to the server. The server should process a valid file and automatically reload the main table, because Remix just does that. I put in some rudimentary toast notifications for basic feedback.

Since the provided "town hall" CSV includes format errors on email addresses (😉) I made a copy where those errors were fixed to test successful upload. Try either one.

Deduplication is done entirely at the database level. Anything else wouldn't be resilient to multi-process/multi-node scenarios (without... a lot of extra work), but hey, that's what database constraints are for!

Given time constraints I did very simple, sync CSV parsing server-side. In a real app I would use streams or (since Remix seems to prefer) async iterators. The library I pulled in doesn't seem to work off-the-shelf with iterators, it's something where I would look into shimming or research some other options if I had more time.

Also, for whatever reason, Remix' starter kit with Tailwind has hydration errors related to the Tailwind style injection. That surprised me. I haven't attempted to fix it, but would definitely track that down in a production app before shipping.
