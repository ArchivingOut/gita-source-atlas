# Gītā Source Atlas

**A source-first reading room for the Bhagavad Gītā.** Read the open Sanskrit corpus verse by verse, navigate the 18-chapter conversation, open commentary and edition portals, listen through attributed source links, and keep private notes on your own device.

**Live site:** after the first successful GitHub Pages deployment, open `https://archivingout.github.io/gita-source-atlas/`.

## What is here

- Sanskrit verse text, transliteration and word meanings from [The Gita Initiative](https://github.com/gita/gita), retrieved and validated by the Pages workflow.
- Verse navigator, chapter selector, Sanskrit search, reading progress, copy, previous/next controls and a chapter constellation map.
- Links to the [IIT Kanpur Gītā Supersite](https://heritage.iitk.ac.in/gitasupersite) and the open dataset, without copying modern copyrighted commentaries or translations.
- Per-verse recording links and browser speech synthesis. Audio is streamed from its host rather than rehosted.
- Local-only verse bookmarks and notes using browser storage. These are not uploaded or synced.
- Offline-ready shell and cached corpus after the first successful site load.

## Corpus count and editorial care

The upstream JSON contains **701 source records**, including a separately numbered Arjuna question in chapter 13. Some editions number it 13.1; others leave it unnumbered, so the conventional arrangement is commonly described as 700 verses. This archive preserves the upstream record and numbering. It does not claim that one source file resolves the Gītā’s manuscript history or constitutes a critical edition. See [SOURCES.md](SOURCES.md) for provenance, licenses and audio rights.

## Run locally

The site is static. For the complete corpus, run with Node.js 20 or newer:

```sh
node scripts/sync-data.mjs
python -m http.server 8000
```

Then open `http://localhost:8000`. The sync script uses Node’s built-in `fetch`, validates records and writes `data/corpus.json`. Without a local corpus, the browser attempts to load the upstream JSON; this requires a network connection. Use a local HTTP server because browsers restrict `fetch` from `file://` pages.

## Publish

The included workflow retrieves the dataset, validates it and publishes the static site with GitHub Pages after a push to `main`. In the repository’s **Settings → Pages**, choose **GitHub Actions** as the build and deployment source if it is not already selected. The workflow runs monthly as well as on each push and can be started manually.

## Rights and contribution

Project code is MIT-licensed. Upstream corpus data retains the upstream Unlicense. External translations, commentaries, audio and portal content remain under their owners’ terms. Do not add a text/audio source without recording edition, steward, URL, license, retrieval date and any attribution requirements. See `SOURCES.md` before contributing archival material.

## Planned archive layers

The initial public release is a carefully scoped Sanskrit source reader and catalogue of external edition portals. A source-critical expansion should add separately documented witness records, scans with catalogue identifiers, diplomatic transcriptions, variant readings and line-level citations reviewed against named editions. No manuscript variant or commentary comparison should be generated from summaries alone.

