import { readFile } from 'node:fs/promises';

const corpus = JSON.parse(await readFile('data/corpus.json', 'utf8'));
if (!Array.isArray(corpus.verses) || corpus.verses.length !== 701) throw new Error('Expected the preserved 701-record corpus snapshot.');
if (!Array.isArray(corpus.chapterMetadata) || corpus.chapterMetadata.length !== 18) throw new Error('Expected metadata for all 18 chapters.');
const refs = new Set();
for (const verse of corpus.verses) {
  if (!Number.isInteger(verse.chapter_number) || verse.chapter_number < 1 || verse.chapter_number > 18 ||
      !Number.isInteger(verse.verse_number) || typeof verse.text !== 'string' || !verse.text.trim()) {
    throw new Error(`Invalid source record: ${JSON.stringify(verse).slice(0, 160)}`);
  }
  const ref = `${verse.chapter_number}.${verse.verse_number}`;
  if (refs.has(ref)) throw new Error(`Duplicate source reference: ${ref}`);
  refs.add(ref);
}
const counts = Array.from({ length: 18 }, (_, i) => corpus.verses.filter(v => v.chapter_number === i + 1).length);
if (JSON.stringify(counts) !== JSON.stringify(corpus.chapterCounts)) throw new Error('Stored chapter counts do not match source records.');
console.log(`Validated archived snapshot ${corpus.snapshotDate}: ${corpus.verses.length} records in 18 chapters.`);
