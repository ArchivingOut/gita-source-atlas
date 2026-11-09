import { mkdir, writeFile } from 'node:fs/promises';

const repo = 'https://raw.githubusercontent.com/gita/gita/main/data';
const sources = {
  verses: `${repo}/verse.json`,
  chapters: `${repo}/chapters.json`,
};
const [verseResponse, chapterResponse] = await Promise.all(Object.values(sources).map((url) => fetch(url)));
if (!verseResponse.ok || !chapterResponse.ok) throw new Error('Could not retrieve the upstream Gita Initiative data.');
const [verses, sourceChapters] = await Promise.all([verseResponse.json(), chapterResponse.json()]);
if (!Array.isArray(verses) || verses.length < 700) throw new Error(`Expected at least 700 verse records; received ${verses?.length ?? 'invalid data'}.`);
const refs = new Set();
for (const v of verses) {
  if (!Number.isInteger(v.chapter_number) || v.chapter_number < 1 || v.chapter_number > 18 || !Number.isInteger(v.verse_number) || typeof v.text !== 'string' || !v.text.trim()) throw new Error(`Invalid verse record: ${JSON.stringify(v).slice(0,160)}`);
  const key = `${v.chapter_number}.${v.verse_number}`;
  if (refs.has(key)) throw new Error(`Duplicate chapter/verse reference: ${key}`);
  refs.add(key);
}
const chapterCounts = Array.from({length:18},(_,i)=>verses.filter(v=>v.chapter_number===i+1).length);
const payload = {
  archive: 'Gītā Source Atlas',
  dataset: 'gita/gita',
  license: 'Unlicense (upstream data repository; see source LICENSE)',
  retrievedAt: new Date().toISOString(),
  recordCount: verses.length,
  note: 'The source dataset has its own verse segmentation and numbering. Its extra record in the 13th chapter corresponds to a numbering witness found in some editions. The commonly cited 700-verse arrangement handles this verse differently. This archive preserves upstream records without silently normalizing them into a critical edition.',
  sources,
  chapterCounts,
  sourceChapters,
  verses,
};
await mkdir('data',{recursive:true});
await writeFile('data/corpus.json', JSON.stringify(payload));
console.log(`Archived ${verses.length} source verse records across ${chapterCounts.length} chapters (${chapterCounts.join(', ')}).`);

