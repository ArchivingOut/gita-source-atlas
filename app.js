const chapterInfo = [
  ['Arjuna Viṣāda Yoga','Arjuna’s grief'],['Sāṅkhya Yoga','The way of discernment'],['Karma Yoga','The way of action'],['Jñāna-Karma-Sannyāsa Yoga','Knowledge and renunciation of action'],['Karma-Sannyāsa Yoga','Renunciation of action'],['Dhyāna Yoga','The way of meditation'],['Jñāna-Vijñāna Yoga','Knowledge and realization'],['Akṣara-Brahma Yoga','The imperishable ground'],['Rāja-Vidyā-Rāja-Guhya Yoga','Royal knowledge and mystery'],['Vibhūti Yoga','Divine manifestations'],['Viśvarūpa-Darśana Yoga','The universal form'],['Bhakti Yoga','The way of devotion'],['Kṣetra-Kṣetrajña-Vibhāga Yoga','Field and knower'],['Guṇa-Traya-Vibhāga Yoga','The three guṇas'],['Puruṣottama Yoga','The supreme person'],['Daivāsura-Sampad-Vibhāga Yoga','Divine and demonic qualities'],['Śraddhā-Traya-Vibhāga Yoga','Three kinds of faith'],['Mokṣa-Sannyāsa Yoga','Liberation and renunciation']
];
let corpus = [], selected = {chapter:2,verse:47}, chapters = [];
const $ = (s)=>document.querySelector(s);
const cleanText = (s='') => s.replace(/\s*\|\|\s*\d+\.\d+\|\|\s*/g,'').replace(/\s*॥\s*\d+\.\d+\s*॥\s*/g,'').trim();
const ref = (c,v)=>`${c}.${v}`;
const rows = ()=>corpus.filter(x=>x.chapter_number===selected.chapter).sort((a,b)=>a.verse_number-b.verse_number);
function verse(){return corpus.find(x=>x.chapter_number===selected.chapter&&x.verse_number===selected.verse);}
function sourceUrl(){return 'https://github.com/gita/gita/blob/main/data/verse.json';}
const translationCache = new Map();
const translationNames = {siva:'Swami Sivananda',gambir:'Swami Gambirananda',purohit:'Purohit Swami',san:'S. Sankaranarayan',adi:'Swami Adidevananda',raman:'Sri Ramanuja',sankar:'Sri Shankaracharya'};
async function loadEnglishTranslation(){
 const key=ref(selected.chapter,selected.verse), author=$('#translationSelect')?.value||'siva', cacheKey=key+':'+author;
 const target=$('#englishTranslation'), credit=$('#translationAuthor');
 if(!target||!credit)return;
 const cached=translationCache.get(cacheKey);
 if(cached){target.textContent=cached.text;credit.textContent=cached.author+' · Vedic Scriptures source';$('#commentaryText').textContent=cached.commentary||'No commentary field is available in this source record for this author.';$('#commentaryAuthor').textContent=cached.commentaryLabel||'No commentary supplied';return}
 const requestKey=key, requestAuthor=author, chapter=selected.chapter, verseNumber=selected.verse;
 target.textContent='Loading the selected translator’s rendering…';credit.textContent=(translationNames[author]||author)+' · live source';
 try{
  const response=await fetch('https://vedicscriptures.github.io/slok/'+chapter+'/'+verseNumber);
  if(!response.ok)throw Error('Translation service unavailable');
  const data=await response.json(), entry=data[author]||null, text=entry&&(entry.et||entry.translation||entry.en);
  if(!text)throw Error('This translator has no English rendering for this verse in the source API');
  if(requestKey!==ref(selected.chapter,selected.verse)||requestAuthor!==($('#translationSelect')?.value||'siva'))return;
  const authorName=entry.author||translationNames[author]||author;
  const note=entry.ec||entry.sc||entry.hc||'';
  const noteLabel=note?(entry.ec?'English source commentary':entry.sc?'Sanskrit source commentary':'Hindi source commentary')+' · '+authorName:'No commentary supplied';
  const item={text:String(text).trim(),author:authorName,commentary:note,commentaryLabel:noteLabel};
  translationCache.set(cacheKey,item);target.textContent=item.text;credit.textContent=item.author+' · Vedic Scriptures source';
  $('#commentaryText').textContent=note||'No commentary field is available in this source record for this author.';
  $('#commentaryAuthor').textContent=noteLabel;
 }catch(error){
  if(requestKey!==ref(selected.chapter,selected.verse)||requestAuthor!==($('#translationSelect')?.value||'siva'))return;
  target.textContent='This English rendering could not be loaded. The complete Sanskrit and transliteration remain available above. Retry by choosing this verse again, or compare editions at the linked Gītā Supersite.';
  credit.textContent=(translationNames[author]||author)+' · source unavailable';
  $('#commentaryText').textContent='Commentary could not be loaded from the source. Open the linked Gītā Supersite to compare this verse.';
  $('#commentaryAuthor').textContent='Source unavailable';
 }
}
function renderVerse(){
 const v=verse(); $('#verseRef').textContent=`CHAPTER ${selected.chapter} · VERSE ${selected.verse}`;
 if(v){$('#sanskrit').innerHTML=cleanText(v.text).split(/\n+/).filter(Boolean).map(s=>`<span>${s}</span>`).join('<br>');$('#transliteration').textContent=(v.transliteration||'').trim();$('#wordMeanings').textContent=(v.word_meanings||'Not supplied in the primary dataset.').replace(/\n/g,' ').trim();$('#sourceVerse').href=sourceUrl(v);}
 else {$('#sanskrit').textContent='The selected verse is not in the locally available source record.';$('#transliteration').textContent='';$('#wordMeanings').textContent='Load the archive corpus from the project’s source manifest.';}
 $('#journal').value=localStorage.getItem(`gita-note-${ref(selected.chapter,selected.verse)}`)||'';
 loadEnglishTranslation();
 const audio=`https://www.holy-bhagavad-gita.org/chapter/${selected.chapter}/verse/${selected.verse}/en/`;
 const comparison=`https://heritage.iitk.ac.in/SBG/${selected.chapter}.${selected.verse}`;$('#compareVerse').href=comparison;$('#compareTradition').href=comparison;
 $('#holyAudio').href=audio;$('#audioLink').href=audio;$('#audioHeading').textContent=`Bhagavad Gītā · ${ref(selected.chapter,selected.verse)}`;
 const audioFile='https://www.holy-bhagavad-gita.org/media/audios/'+String(selected.chapter).padStart(3,'0')+'_'+String(selected.verse).padStart(3,'0')+'.mp3';const player=$('#verseAudio');if(player){player.pause();player.src=audioFile;player.load();player.onerror=()=>{$('#audioStatus').textContent='This recording is unavailable at the host. Open the cited verse page for current recitation options.'};player.oncanplay=()=>{$('#audioStatus').textContent='Ready to play · hosted by Holy Bhagavad Gita · not stored in this archive.'}}
 $('#verseBookmark').innerHTML=(bookmarks().includes(ref(selected.chapter,selected.verse))?'★':'☆')+' <span>Save</span>';
 $('#bookmarkTop').textContent=bookmarks().includes(ref(selected.chapter,selected.verse))?'★':'☆';
 renderVerseList(); renderMap();
}
function renderVerseList(){const list=rows();$('#verseList').innerHTML=list.map(v=>`<button data-verse="${v.verse_number}" class="${v.verse_number===selected.verse?'active':''}">${String(v.verse_number).padStart(2,'0')} <small>${(cleanText(v.text).split(/[।॥\n]/)[0]||'').slice(0,18)}</small></button>`).join('');$('#verseList').querySelectorAll('button').forEach(b=>b.onclick=()=>go(selected.chapter,+b.dataset.verse));}
function chapterCounts(){return Array.from({length:18},(_,i)=>corpus.filter(v=>v.chapter_number===i+1).length);}
function populateChapters(){const counts=chapterCounts();$('#chapterSelect').innerHTML=chapterInfo.map((c,i)=>`<option value="${i+1}">Chapter ${String(i+1).padStart(2,'0')} · ${c[0]}</option>`).join('');$('#chapterSelect').value=selected.chapter;$('#chapterCards').innerHTML=chapterInfo.map((c,i)=>`<button data-ch="${i+1}"><b>${String(i+1).padStart(2,'0')}</b>${c[1]}<br><small>${counts[i]||'—'} source records</small></button>`).join('');$('#chapterCards').querySelectorAll('button').forEach(b=>b.onclick=()=>{show('read');go(+b.dataset.ch,1)});}
function renderMap(){const svg=$('#constellation');if(!svg)return;const cx=450,cy=300,outer=224;let h='';
 h+=`<circle cx="${cx}" cy="${cy}" r="64" fill="#20291f" stroke="#81734f"/><circle cx="${cx}" cy="${cy}" r="52" fill="none" stroke="#81734f" stroke-opacity=".3"/><text x="${cx}" y="${cy-3}" fill="#dfc581" text-anchor="middle" font-size="24" font-family="serif">गीता</text><text x="${cx}" y="${cy+18}" fill="#879080" text-anchor="middle" font-size="8" font-family="monospace">SOURCE ORDER</text>`;
 for(let i=0;i<18;i++){const ch=i+1,ang=(i/18)*Math.PI*2-Math.PI/2,px=cx+outer*Math.cos(ang),py=cy+outer*Math.sin(ang),list=corpus.filter(v=>v.chapter_number===ch).sort((a,b)=>a.verse_number-b.verse_number),color=`hsl(${98+i*4} 25% 64%)`;
  h+=`<line class="map-edge" x1="${cx+68*Math.cos(ang)}" y1="${cy+68*Math.sin(ang)}" x2="${px}" y2="${py}"/><path d="M ${cx+85*Math.cos(ang-.16)} ${cy+85*Math.sin(ang-.16)} A 85 85 0 0 1 ${cx+85*Math.cos(ang+.16)} ${cy+85*Math.sin(ang+.16)}" fill="none" stroke="${color}" stroke-opacity=".18"/><g class="chapter-node ${selected.chapter===ch?'selected':''}" data-ch="${ch}"><circle cx="${px}" cy="${py}" r="17"/><text x="${px}" y="${py}">${String(ch).padStart(2,'0')}</text><title>Chapter ${ch} · ${list.length} source verse records · ${chapterInfo[i][0]}</title></g>`;
  const spread=.155; list.forEach((v,j)=>{const ring=j%5,slot=Math.floor(j/5),angle=ang-spread/2+(slot/Math.max(1,Math.ceil(list.length/5)-1))*spread,r=112+ring*12,x=cx+r*Math.cos(angle),y=cy+r*Math.sin(angle),on=selected.chapter===ch&&selected.verse===v.verse_number,opacity=selected.chapter===ch?'.92':'.38';h+=`<circle class="verse-dot" data-ch="${ch}" data-v="${v.verse_number}" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${on?4:2.4}" fill="${on?'#e6c276':color}" fill-opacity="${on?'1':opacity}" stroke="${on?'#fff0cb':'none'}" stroke-width="1"><title>${ch}.${v.verse_number} · ${cleanText(v.text).slice(0,110)}</title></circle>`});
 }
 svg.innerHTML=h;svg.querySelectorAll('.chapter-node').forEach(n=>n.onclick=()=>{show('read');go(+n.dataset.ch,1)});svg.querySelectorAll('.verse-dot').forEach(n=>{n.style.cursor='pointer';n.onclick=()=>{go(+n.dataset.ch,+n.dataset.v);show('read')}});}
function go(ch,v){selected={chapter:ch,verse:v};$('#chapterSelect').value=ch;renderVerse();}
function show(id){document.querySelectorAll('.workspace').forEach(e=>e.classList.toggle('view-active',e.id===`view-${id}`));document.querySelectorAll('.nav-item').forEach(e=>e.classList.toggle('active',e.dataset.view===id));if(id==='map')renderMap();if(id==='lab')renderLab();if(id==='reflect')renderSaved();window.scrollTo({top:0,behavior:'smooth'});}
function bookmarks(){try{return JSON.parse(localStorage.getItem('gita-bookmarks')||'[]')}catch{return[]}}
function renderSaved(){
 const out=$('#savedVerses');if(!out)return;const refs=bookmarks();
 if(!refs.length){out.innerHTML='<p class="empty-state">No saved verses yet. Use ☆ Save while reading to build your personal collection.</p>';return}
 out.innerHTML=refs.map(r=>{const [c,v]=r.split('.').map(Number),item=corpus.find(x=>x.chapter_number===c&&x.verse_number===v);return item?'<button class="saved-verse" data-ref="'+r+'"><strong>'+r+'</strong><span>'+cleanText(item.text).slice(0,145)+'</span><small>Open verse →</small></button>':''}).join('');
 out.querySelectorAll('[data-ref]').forEach(b=>b.onclick=()=>{const [c,v]=b.dataset.ref.split('.').map(Number);go(c,v);show('read')});
}
function searchArchive(q){
 const out=$('#askResults');if(!out)return;const terms=q.toLocaleLowerCase().split(/\s+/).filter(t=>t.length>1);if(!terms.length){out.innerHTML='<p>Enter a word or phrase to begin.</p>';return}
 const ranked=corpus.map(v=>{const fields=[cleanText(v.text),v.transliteration||'',v.word_meanings||''].map(t=>t.toLocaleLowerCase());const score=terms.reduce((n,t)=>n+fields.reduce((m,f)=>m+(f.includes(t)?1:0),0),0);return {v,score}}).filter(x=>x.score).sort((a,b)=>b.score-a.score).slice(0,12);
 if(!ranked.length){out.innerHTML='<p>No direct matches in the preserved Sanskrit, transliteration or source gloss fields. Try a Sanskrit form, IAST spelling or a shorter English word.</p>';return}
 out.innerHTML=ranked.map(({v,score})=>'<button class="ask-result" data-ch="'+v.chapter_number+'" data-v="'+v.verse_number+'"><span class="ask-ref">BG '+v.chapter_number+'.'+v.verse_number+' · '+score+' field matches</span><span class="ask-sanskrit">'+cleanText(v.text).slice(0,180)+'</span><small>'+String(v.word_meanings||'Source dataset provides no word gloss for this record.').replace(/\n/g,' ').slice(0,180)+'</small><b>Open cited verse →</b></button>').join('');
 out.querySelectorAll('button').forEach(b=>b.onclick=()=>{go(+b.dataset.ch,+b.dataset.v);show('read')});
}
function toggleBookmark(){const r=ref(selected.chapter,selected.verse),a=bookmarks();localStorage.setItem('gita-bookmarks',JSON.stringify(a.includes(r)?a.filter(x=>x!==r):[...a,r]));renderVerse();}
function search(q){const out=$('#searchResults');q=q.trim();if(!q){out.innerHTML='';return}const m=q.match(/^(\d{1,2})\s*[.:/]\s*(\d{1,3})$/);if(m){const found=corpus.find(v=>v.chapter_number===+m[1]&&v.verse_number===+m[2]);out.innerHTML=found?`<button data-ch="${m[1]}" data-v="${m[2]}">Open chapter ${m[1]}, verse ${m[2]} →</button>`:'<p>That reference is not present in the loaded source data.</p>';out.querySelector('button')?.addEventListener('click',e=>{go(+e.currentTarget.dataset.ch,+e.currentTarget.dataset.v);show('read');$('#searchDialog').close()});return}const results=corpus.filter(v=>cleanText(v.text).includes(q)||String(v.transliteration||'').toLowerCase().includes(q.toLowerCase())).slice(0,12);out.innerHTML=results.map(v=>`<button data-ch="${v.chapter_number}" data-v="${v.verse_number}">${v.chapter_number}.${v.verse_number} · ${cleanText(v.text).slice(0,110)} →</button>`).join('')||'<p>No Sanskrit matches in the loaded source record.</p>';out.querySelectorAll('button').forEach(b=>b.onclick=()=>{go(+b.dataset.ch,+b.dataset.v);show('read');$('#searchDialog').close()});}
async function loadCorpus(){try{let res=await fetch('data/corpus.json');if(!res.ok)throw new Error('local corpus unavailable');const payload=await res.json();corpus=payload.verses||payload;}catch{try{const u='https://raw.githubusercontent.com/gita/gita/main/data/verse.json';const r=await fetch(u);if(!r.ok)throw new Error();corpus=await r.json();}catch{corpus=[]}}
 if(corpus.length){$('#corpusStatus').textContent=`${corpus.length} source records available`;$('#verseCount').textContent=corpus.length;document.querySelector('.stats p').textContent='This preserved source snapshot contains 701 numbered records. Chapter 13 has an additional separately numbered question; editions differ in how they count it.';}else $('#corpusStatus').textContent='Sample reading · corpus unavailable offline';
 populateChapters();const bookmark=localStorage.getItem('gita-last-reference');if(bookmark){const [c,v]=bookmark.split('.').map(Number);if(c&&v)selected={chapter:c,verse:v}}if(!verse()){const initial=corpus.find(v=>v.chapter_number===2&&v.verse_number===47);if(initial)selected={chapter:2,verse:47};else if(corpus[0])selected={chapter:corpus[0].chapter_number,verse:corpus[0].verse_number};}
 renderVerse();
}
document.querySelectorAll('.nav-item').forEach(b=>b.onclick=()=>show(b.dataset.view));document.querySelectorAll('button[data-view]').forEach(b=>b.onclick=()=>show(b.dataset.view));document.querySelectorAll('.text-link[data-view]').forEach(b=>b.onclick=()=>show(b.dataset.view));
$('#chapterSelect').onchange=e=>go(+e.target.value,1);$('#prevVerse').onclick=()=>{let a=rows(),i=a.findIndex(v=>v.verse_number===selected.verse);if(i>0)go(selected.chapter,a[i-1].verse_number);else if(selected.chapter>1)go(selected.chapter-1,Math.max(...corpus.filter(v=>v.chapter_number===selected.chapter-1).map(v=>v.verse_number)))};$('#nextVerse').onclick=()=>{let a=rows(),i=a.findIndex(v=>v.verse_number===selected.verse);if(i<a.length-1)go(selected.chapter,a[i+1].verse_number);else if(selected.chapter<18)go(selected.chapter+1,1)};
$('#continueBtn').onclick=()=>{show('read');go(2,47)};$('#copyVerse').onclick=async()=>{const v=verse();if(v)await navigator.clipboard?.writeText(cleanText(v.text));$('#copyVerse').innerHTML='✓ <span>Copied</span>';setTimeout(()=>$('#copyVerse').innerHTML='▢ <span>Copy Sanskrit</span>',1300)};$('#verseBookmark').onclick=toggleBookmark;$('#bookmarkTop').onclick=toggleBookmark;
$('#journal').addEventListener('input',e=>localStorage.setItem(`gita-note-${ref(selected.chapter,selected.verse)}`,e.target.value));$('#journal').addEventListener('blur',()=>localStorage.setItem('gita-last-reference',ref(selected.chapter,selected.verse)));
$('#listenVerse').onclick=()=>{show('listen');$('#audioHeading').scrollIntoView({behavior:'smooth',block:'center'})};$('#translationSelect')?.addEventListener('change',loadEnglishTranslation);
$('#readEnglish')?.addEventListener('click',()=>{const text=$('#englishTranslation')?.textContent||'';if(!('speechSynthesis'in window)||!text||text.startsWith('Loading')||text.startsWith('This English'))return;speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang='en';speechSynthesis.speak(utterance)});
$('#speakBtn').onclick=()=>{if(!('speechSynthesis'in window)){alert('Speech synthesis is not available in this browser.');return}speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(cleanText(verse()?.text||'')))};
$('#searchOpen').onclick=()=>{$('#searchDialog').showModal();$('#searchInput').focus()};$('#searchInput').oninput=e=>search(e.target.value);document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){e.preventDefault();$('#searchDialog').showModal();$('#searchInput').focus()}});

let readingNetwork=null;
const chapterColors=['#d7b36a','#99b995','#9cb4cc','#c59dd0','#e5a789','#e1c889','#8fbcb8','#d49d9d','#b2a4d6','#d4ad76','#b4c49b','#dcaa8e','#a8b9cf','#d6c29a','#aaa0ce','#8db5a8','#d0a9b9','#d7b36a'];
async function loadReadingNetwork(){if(readingNetwork)return readingNetwork;try{const r=await fetch('data/reading-network.json');if(!r.ok)throw Error('not found');readingNetwork=await r.json()}catch{readingNetwork={themes:[]}}return readingNetwork}
function renderLab(){
 if(!corpus.length)return;
 const counts=Array.from({length:18},(_,i)=>corpus.filter(v=>v.chapter_number===i+1).length),max=Math.max(...counts);
 $('#chapterBars').innerHTML=counts.map((n,i)=>`<button class="bar-row" data-ch="${i+1}" title="Open chapter ${i+1}: ${n} source records"><span>Ch ${String(i+1).padStart(2,'0')}</span><i><b style="width:${Math.round(n/max*100)}%;background:${chapterColors[i%chapterColors.length]}"></b></i><strong>${n}</strong></button>`).join('');
 $('#chapterBars').querySelectorAll('button').forEach(b=>b.onclick=()=>{show('read');go(+b.dataset.ch,1)});
 const freq=new Map();for(const v of corpus){for(const m of (v.word_meanings||'').split(/[;\n]+/)){const term=m.split(/[-—:]/)[0].trim().toLowerCase();if(term.length>2&&!/^(the|and|for|from|into|that|this|with|which|who|what|when|where|there|their|your|you|him|her|his|its|not|are|was|has|have|all|one|any|only|also|such)$/.test(term))freq.set(term,(freq.get(term)||0)+1)}}
 $('#termCloud').innerHTML=[...freq].sort((a,b)=>b[1]-a[1]).slice(0,24).map(([term,n])=>`<button class="term-chip" data-term="${term.replace(/"/g,'&quot;')}" title="${n} source gloss entries">${term}<small>${n}</small></button>`).join('');
 $('#termCloud').querySelectorAll('button').forEach(b=>b.onclick=()=>{$('#labSearch').value=b.dataset.term;$('#labField').value='gloss';searchLab()});
 renderNetwork();
}
function searchLab(){
 const q=$('#labSearch').value.trim().toLocaleLowerCase(),field=$('#labField').value,out=$('#labResults');if(q.length<2){out.innerHTML='';return}
 const matching=corpus.filter(v=>{const fields=field==='sanskrit'?[v.text]:field==='transliteration'?[v.transliteration]:field==='gloss'?[v.word_meanings]:[v.text,v.transliteration,v.word_meanings];return fields.some(x=>String(x||'').toLocaleLowerCase().includes(q))}).slice(0,30);
 out.innerHTML=matching.length?matching.map(v=>`<button class="lab-result" data-ch="${v.chapter_number}" data-v="${v.verse_number}"><strong>${v.chapter_number}.${v.verse_number}</strong><span>${cleanText(v.text).slice(0,95)}</span><small>${String(v.transliteration||'').replace(/\n/g,' ').slice(0,85)}</small></button>`).join(''):'<p>No matches in the selected fields of the preserved corpus.</p>';
 out.querySelectorAll('button').forEach(b=>b.onclick=()=>{show('read');go(+b.dataset.ch,+b.dataset.v)});
}
async function renderNetwork(){
 const {themes=[]}=await loadReadingNetwork(),svg=$('#readingNetwork');if(!svg)return;const cx=500,cy=310,R=218,rx=140,ry=36;let out='';
 for(let i=0;i<themes.length;i++){const t=themes[i],a=-Math.PI/2+i*2*Math.PI/themes.length,x=cx+R*Math.cos(a),y=cy+R*Math.sin(a);
  for(let j=0;j<t.refs.length;j++){const ar=a+Math.PI+(j-(t.refs.length-1)/2)*.17,vx=x+rx*Math.cos(ar),vy=y+ry*Math.sin(ar);out+=`<line class="network-edge" x1="${x}" y1="${y}" x2="${vx}" y2="${vy}" stroke="${t.color}"/><g class="network-verse" data-ref="${t.refs[j]}"><circle cx="${vx}" cy="${vy}" r="16"/><text x="${vx}" y="${vy+3}">${t.refs[j]}</text></g>`}
  out+=`<g class="network-theme" data-theme="${t.id}"><circle cx="${x}" cy="${y}" r="31" fill="${t.color}"/><text x="${x}" y="${y+48}">${t.label}</text></g>`;
 }
 svg.innerHTML=out;
 svg.querySelectorAll('.network-verse').forEach(n=>n.onclick=()=>{const [c,v]=n.dataset.ref.split('.').map(Number);go(c,v);show('read')});
 svg.querySelectorAll('.network-theme').forEach(n=>n.onclick=()=>{const t=themes.find(x=>x.id===n.dataset.theme);$('#networkDetail').innerHTML=`<strong>${t.label}</strong><span> · Curated reading path · </span>`+t.refs.map(ref=>`<button class="network-ref" data-ref="${ref}">${ref} →</button>`).join('');$('#networkDetail').querySelectorAll('button').forEach(b=>b.onclick=()=>{const [c,v]=b.dataset.ref.split('.').map(Number);go(c,v);show('read')})});
}
$('#askForm')?.addEventListener('submit',e=>{e.preventDefault();searchArchive($('#askInput').value)});
$('#labSearch')?.addEventListener('input',searchLab);$('#labField')?.addEventListener('change',searchLab);
loadCorpus();
if('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./sw.js').catch(()=>{});

