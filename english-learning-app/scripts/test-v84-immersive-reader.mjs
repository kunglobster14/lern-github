import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const read=n=>fs.readFileSync(new URL(`../${n}`,import.meta.url),'utf8');
const files=Array.from({length:5},(_,i)=>`story-depth-v84-${i+1}.js`);
const ctx={window:{}};vm.createContext(ctx);
for(const f of files)new vm.Script(read(f),{filename:f}).runInContext(ctx);
const more=ctx.window.STORY_DEPTH_V84_MORE||{};
const titles=Object.keys(more);
const classic=read('oxford3000-stories.js');
const classicTitles=[...classic.matchAll(/\{title:`([^`]+)`/g)].map(m=>m[1]);
assert.equal(classicTitles.length,25,'classic reader must expose 25 titles');
assert.equal(new Set(classicTitles).size,25,'classic titles must be unique');
assert.equal(titles.length,25,'V84 must add story-specific content to all 25 stories');
assert.deepEqual(new Set(titles),new Set(classicTitles),'V84 titles must match the classic 25-story reader');
const countWords=t=>(String(t).match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;
for(const [i,title] of classicTitles.entries()){
  const blocks=more[title];
  assert(Array.isArray(blocks),`${title}: missing V84 blocks`);
  const minBlocks=i<15?4:6;
  assert(blocks.length>=minBlocks,`${title}: expected >=${minBlocks} V84 blocks, got ${blocks.length}`);
  let words=0;
  for(const [n,pair] of blocks.entries()){
    assert(Array.isArray(pair)&&pair.length===2,`${title} block ${n+1}: must be bilingual pair`);
    const [en,th]=pair;
    assert(countWords(en)>=20,`${title} block ${n+1}: English scene too short`);
    assert(/[ก-๙]/.test(String(th)),`${title} block ${n+1}: Thai translation missing`);
    words+=countWords(en);
  }
  assert(words>=(i<15?120:180),`${title}: V84 added content too short (${words} words)`);
}
const runtime=read('story-depth-v84.js'),audio=read('oxford3000-story-speed-v84.js'),games=read('vocab-games-v80.js'),home=read('simplified-home-v80.js'),index=read('index.html'),sw=read('sw.js');
for(const f of [...files,'story-depth-v84.js','oxford3000-story-speed-v84.js']){const c=spawnSync(process.execPath,['--check',new URL(`../${f}`,import.meta.url).pathname],{encoding:'utf8'});assert.equal(c.status,0,`${f} syntax error: ${c.stderr||c.stdout}`)}
for(const marker of ['v84-immersive-reader','patchIntro','normalizeOldHighlights','intro.querySelector(\'p\')?.remove()','#f8fafc','#7dd3fc','maxHighlightedWordsPerBlock:4','finalTenIntense:true','noGlobalMutationObserver:true'])assert(runtime.includes(marker),`runtime missing ${marker}`);
assert(!runtime.includes('new MutationObserver('),'V84 runtime must not add a global mutation observer');
for(const marker of ["slow:{label:'ช้ามาก',rate:.45}","medium:{label:'ช้า',rate:.65}","fast:{label:'ค่อนข้างช้า',rate:.82}",'v84-slower-stable-audio','englishVoice()','noGlobalMutationObserver:true'])assert(audio.includes(marker),`audio missing ${marker}`);
assert(!audio.includes('new MutationObserver('),'V84 audio must not add a global mutation observer');
for(const id of ['match','listen','sprint','rush','translate','memory','spell','trap'])assert(games.includes(`${id}:`)||games.includes(`['${id}'`)||games.includes(`${id}:[`),`game type ${id} missing`);
for(const lvl of ['A1','A2','B1','B2','MIX'])assert(games.includes(`${lvl}:`),`game level ${lvl} missing`);
for(const marker of ['nonRepeatCycle:true','persistentCycle:true','myEnglishV2.v80GameCycle'])assert(games.includes(marker),`game cycle marker ${marker} missing`);
assert(home.includes('gameDifficultyInsideGames:true'),'game difficulty must remain inside games');
for(let i=1;i<=5;i++){const asset=`story-depth-v84-${i}.js?v=84`;assert(index.includes(asset),`index missing ${asset}`);assert(sw.includes(`./${asset}`),`SW missing ${asset}`)}
for(const asset of ['story-depth-v84.js?v=84','oxford3000-story-speed-v84.js?v=84','vocab-games-v80.js?v=81']){assert(index.includes(asset),`index missing ${asset}`);assert(sw.includes(`./${asset}`),`SW missing ${asset}`)}
assert(!index.includes('oxford3000-story-speed.js?v=83'),'old narration runtime must not execute');
assert(sw.includes("const CACHE='my-english-v84-immersive1'"),'fresh V84 service-worker cache missing');
assert(index.includes("document.documentElement.classList.add('account-locked')"),'registration must remain closed');
console.log(JSON.stringify({ok:true,version:'v84-immersive-reader',stories:titles.length,first15MinAddedBlocks:4,final10MinAddedBlocks:6,contrast:'high',narrationSpeeds:['0.45x','0.65x','0.82x'],gameTypes:8,gameLevels:['A1','A2','B1','B2','MIX'],gamesPreserved:true},null,2));
