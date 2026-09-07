import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const read=n=>fs.readFileSync(new URL(`../${n}`,import.meta.url),'utf8');
const ctx={window:{}};vm.createContext(ctx);
for(let i=1;i<=5;i++)new vm.Script(read(`story-pack-v80-${i}.js`),{filename:`story-pack-v80-${i}.js`}).runInContext(ctx);
const stories=Array.from({length:5},(_,i)=>ctx.window[`STORY_PACK_V80_${i+1}`]).flat();
assert.equal(stories.length,25,'must retain exactly 25 new story assets');
assert.deepEqual(stories.map(x=>x.id),Array.from({length:25},(_,i)=>i+1),'story ids must be 1-25');
const cats=new Set(stories.map(x=>x.category));for(const c of ['Fantasy','Thriller','Adventure','Sci-Fi','Supernatural'])assert(cats.has(c),`missing story category ${c}`);
for(const s of stories){const wc=(s.text.match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;assert(wc>=150&&wc<=200,`${s.id} ${s.title} must be 150-200 words, got ${wc}`);assert.equal(wc,s.wordCount,`${s.title} stored wordCount mismatch`)}
const lib=read('story-library-v80.js'),games=read('vocab-games-v80.js'),home=read('simplified-home-v80.js'),classic=read('oxford3000-stories.js'),speed=read('oxford3000-story-speed.js'),depthData=read('story-depth-v81.js'),depthSafe=read('story-depth-v83.js'),index=read('index.html'),sw=read('sw.js');
for(const marker of ['v80-story-library','25 ORIGINAL STORIES','Oxford 3000','wordRange:[150,200]'])assert(lib.includes(marker),`missing V80 story marker ${marker}`);
for(const marker of ['v80-vocab-games','v81-vocab-games','A1','A2','B1','B2','MIX','nonRepeatCycle:true','persistentCycle:true','noXP:true','myEnglishV2.v80GameCycle','poolCount'])assert(games.includes(marker),`missing games marker ${marker}`);
for(const marker of ['v80-simplified-home','v81-stories-games-home','v83-clean-stable-home','classicOxfordReader:true','translations:true','audioSpeed:true','oxford3000:true','oxfordMenuRestored:true','openCore3000Library','gameDifficultyInsideGames:true','globalMutationObserver:false','LOCAL · STORIES + GAMES'])assert(home.includes(marker),`missing home marker ${marker}`);
for(const marker of ['STORY_COUNT=25','WORDS_PER_STORY=120','openOxford3000Stories','แปลทั้งเรื่อง','Oxford Practice'])assert(classic.includes(marker),`classic Oxford reader missing ${marker}`);
for(const marker of ['slow:{label:\'ช้า\',rate:.6}','medium:{label:\'กลาง\',rate:.9}','fast:{label:\'เร็ว\',rate:1.15}','data-story-speed','v82-ios-story-audio'])assert(speed.includes(marker),`story narration speed missing ${marker}`);
for(const marker of ['v81-story-depth','The Midnight Train','The River Race','sentencesPerExpansion:12','bilingual:true','classicReaderCompatible:true'])assert(depthData.includes(marker),`V81 expansion source missing ${marker}`);
const expansionTitles=[...depthData.matchAll(/^'([^']+)':\[/gm)].map(x=>x[1]);assert.equal(expansionTitles.length,15,'expansion source must contain 15 classic stories');
for(const marker of ['v83-story-depth-safe','safeObserver:true','guardedTextMutation:true','story-depth-v81.js?v=81','classicReaderCompatible:true'])assert(depthSafe.includes(marker),`V83 safe depth missing ${marker}`);
for(let i=1;i<=5;i++){const s=`story-pack-v80-${i}.js?v=80`;assert(index.includes(s),`index missing ${s}`);assert(sw.includes(`./${s}`),`SW missing ${s}`)}
for(const s of ['story-library-v80.js?v=80','story-depth-v83.js?v=83','vocab-games-v80.js?v=81','simplified-home-v80.js?v=83','oxford3000-story-speed.js?v=83'])assert(index.includes(s),`index missing ${s}`);
for(const s of ['./story-depth-v81.js?v=81','./story-depth-v83.js?v=83','./vocab-games-v80.js?v=81','./simplified-home-v80.js?v=83','./oxford3000-story-speed.js?v=83'])assert(sw.includes(s),`SW missing ${s}`);
assert(!index.includes('<script src="story-depth-v81.js?v=81"></script>'),'buggy V81 expansion runtime must not execute');
assert(index.indexOf('story-depth-v83.js?v=83')>index.indexOf('oxford3000-story-speed.js?v=83'),'safe story depth must load after speed support');
assert(index.indexOf('vocab-games-v80.js?v=81')<index.indexOf('simplified-home-v80.js?v=83'),'games must load before simplified home');
assert(sw.includes("const CACHE='my-english-v73-institute1'"),'service worker must preserve compatible cache name');
assert(index.includes("document.documentElement.classList.add('account-locked')"),'registration must remain closed');
console.log(JSON.stringify({ok:true,version:'v83-stories-games',visibleStories:25,classicReader:true,translation:true,narrationSpeeds:['0.60x','0.90x','1.15x'],oxfordTotal:3000,expandedClassicStories:15,safeExpansionRuntime:true,gameLevels:['A1','A2','B1','B2','MIX'],noScore:true,noMission:true,noLessonsInUI:true},null,2));
