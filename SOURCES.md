# Source and rights register

This project is a reading interface and provenance index. It does not present itself as a critical edition and does not copy contemporary translations or commentaries without a clear reuse license.

## Primary Sanskrit dataset

- **The Gita Initiative**, `gita/gita`, data files `data/verse.json` and `data/chapters.json`.
- Upstream source: <https://github.com/gita/gita>
- License declared by upstream repository: [The Unlicense](https://github.com/gita/gita/blob/main/LICENSE).
- The Pages workflow downloads these files, validates the verse references and writes `data/corpus.json` into the published site. The corpus is not silently editorially normalized.
- The upstream dataset contains 701 verse records. This includes a separately numbered Arjuna question in the 13th chapter that some editions count as 13.1 and others treat as an unnumbered introductory verse. The common arrangement is described as 700 verses. This archive retains the upstream numbering and makes the difference visible; the count must not be mistaken for a claim about a single universal recension.
- The word meanings and transliteration are also upstream data; they are not a new translation or a critical Sanskrit apparatus.

## Edition and commentary portals

- [Gītā Supersite, Indian Institute of Technology Kanpur](https://heritage.iitk.ac.in/gitasupersite) — linked for comparative access to Sanskrit, translation, commentary and recitation resources. Individual materials remain governed by their respective rights and terms; this project does not mirror their text or audio.
- [Gītā Supersite verse viewer](https://www.gitasupersite.iitk.ac.in/srimad) — edition-specific verse-level comparison.

## Audio

- Per-verse recitation links open the corresponding verse page at `holy-bhagavad-gita.org`. Recordings remain on that service and are not copied into this repository. Links may change and users should follow host attribution and terms.
- The Listen page links to Internet Archive search for Gītā recitations. Search results are not an endorsement or a blanket rights grant; each item has its own metadata and license.
- Browser speech synthesis is generated on-device from the selected Sanskrit string. Pronunciation depends on the browser and installed voice.

## Software

The interface and project-authored scripts are licensed under the MIT License. That license does not relicense upstream corpus data, linked commentary, translations, recordings, or third-party services.

