# Gītā Source Atlas

**An open, offline-first source archive and digital humanities reading room for the Bhagavad Gītā.**

**Live archive:** https://archivingout.github.io/gita-source-atlas/

## Archive in this release

- A committed, dated snapshot of the full upstream Sanskrit transcription: **701 source-numbered verse records across all 18 chapters**, with source transliteration and word glosses.
- Verse-by-verse reading, chapter and verse navigation, searchable Sanskrit, transliteration and glosses, private local notes, bookmarks, copy, and browser speech.
- A full-corpus research desk: exact-string concordance, chapter-level source-record profile, word-gloss token frequency, and a thematic verse network with navigable references.
- Source links to comparative readings, classical commentary traditions, recitations, Sanskrit linguistic resources, and manuscript catalogues.
- A published source/rights register and an editorial note distinguishing source numbering from the commonly cited 700-verse arrangement.
- Offline shell and corpus caching after installation/first successful visit; Pages deployment validates and publishes the checked-in snapshot without silently replacing it from the network.

## Scholarly scope

This is a growing **source archive and research index**, not an all-witness critical edition. The 701 rows reproduce one openly licensed digital transcription and its numbering; chapter 13 contains an additional separately numbered Arjuna question. Edition and manuscript differences require witness-level collation. Links to modern translations, commentaries, and audio are not copied without an explicit reuse license. The concept network is explicitly editorial and intended for navigation; it is not an ontology extracted from the Sanskrit text. The search/count tools are reproducible string-based analyses, not a Sanskrit morphological parser.

See [SOURCES.md](SOURCES.md) for the dataset’s provenance, other research portals, rights notes, and suggested manuscript discovery paths. The project tracks resources and access points; it does not claim to have digitized every surviving Gītā manuscript or every translation.

## Run locally

With Node.js 20 or newer:

```sh
node scripts/sync-data.mjs
python -m http.server 8000
```

Open http://localhost:8000. The validator checks the committed corpus snapshot; no network is needed to read or search the included archive. A simple local HTTP server is required because browsers restrict data requests from `file://` pages.

## Data updates

The `data/corpus.json` file is the archival snapshot shown by the website. Updates should be reviewed, dated, and committed as a new corpus snapshot with its upstream revision recorded. The Pages action validates this file and publishes it. It does not fetch a newer upstream file during deployment, so a published build remains reproducible.

## Rights and contributions

Project code is MIT-licensed. The primary dataset retains the upstream Unlicense. The software license does not extend to external scans, translations, commentaries, recitations, or third-party services. Before adding an archival object, record its institution/steward, identifier, edition or witness, URL, rights statement, retrieval date, and any transcription/normalization decisions. Never present a portal search result as proof that a particular manuscript has been inspected.

## Research roadmap

An extensive scholarly archive still needs sustained human work: manuscript catalogue identifiers linked to individual witnesses; scans and access statements; a TEI-encoded diplomatic transcription and apparatus; separate edition layers; rights-cleared commentary/translations; recorded audio provenance; and peer-reviewed annotations. Contributions should be source-cited and visibly versioned.
