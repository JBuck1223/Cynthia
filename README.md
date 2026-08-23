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

Vimeo has no captions on these videos, and downloads are blocked without a Vimeo account token. `npm run transcripts` records every lesson URL. To fill transcripts later: add a Vimeo API token, or download audio from Vimeo’s owner dashboard and drop Whisper JSON into `content/transcripts/{course}/{lesson}.json`.

Embeds are domain-locked. In Vimeo, allow `localhost:3010` and `cynthiamusic.com`.

## Brand

Sand `#F6F1E8`, foam white, gulf `#2B8A9E`, horizon navy `#14323C`, sunset coral for buy buttons. Fraunces + Source Sans 3.
