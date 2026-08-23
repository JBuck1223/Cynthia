# Cynthia Productions

Sarasota piano school. White sand and gulf blues. Site for **cynthiamusic.com**.

Teach kids, adults, and grandparents to play and compose together. Three video courses at $97, family bundle at $197.

## Stack

Next.js 16, Tailwind 4, Supabase, Stripe, Vimeo embeds.

## Local

```bash
cp .env.example .env.local
npm install
npm run dev
```

App runs on [http://localhost:3010](http://localhost:3010).

Public pages work without env. Checkout, studio login, and admin need Supabase + Stripe.

## Transcripts

These Vimeo lessons have no captions. The LMS reads JSON from `content/transcripts/{course}/{lesson}.json`.

Generate them with a Vimeo token that includes **video_files** (public + private too):

```bash
VIMEO_ACCESS_TOKEN=xxxxx npm run transcripts
```

That downloads each owner file and runs local Whisper into the JSON. Re-run with `--force` to replace existing text.

Embeds are domain-locked. Allow `localhost`, `cynthiamusic.com`, and `www.cynthiamusic.com` (`npm run vimeo:allow-embeds`).

## Brand

Foam white, pale aqua sky, gulf `#2BBCD0`, sunset coral `#FF7A5C` for buy buttons. Large type, large pill buttons, rounded cards. Fraunces + Source Sans 3.
