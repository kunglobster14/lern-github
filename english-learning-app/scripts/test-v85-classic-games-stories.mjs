import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const read=n=>fs.readFileSync(new URL(`../${n}`,import.meta.url),'utf8');
for(const f of ['classic-games-v85.js','game-home-v85.js','story-depth-v85-data.js','story-integrity-v85.js','story-depth-v84.js']){const r=spawnSync(process.execPath,['--check',new URL(`../${f}`,import.meta.url).pathname],{encoding:'utf8'});assert.equal(r.status,0,`${f} syntax error: ${r.stderr||r.stdout}`)}
const games=read('classic-games-v85.js'),home=read('game-home-v85.js'),integrity=read('story-integrity-v85.js'),loader=read('story-depth-v84.js');
for(const id of ['match','builder','listen','sprint','rush','gap','translate','memory','dialog','spell','trap'])assert(games.includes(`${id}:[`),`missing classic game ${id}`);
for(const lvl of ['A1','A2','B1','B2','MIX'])assert(games.includes(`${lvl}:`),`missing level ${lvl}`);
assert(games.includes('noXP:true')&&games.includes('noMission:true')&&games.includes('classicStructure:true')&&games.includes('nonRepeatOxford:true'));
assert(home.includes('gameTypes:GAMES.length')&&home.includes('CLASSIC GAME LAB · 11 รูปแบบ'));
assert(integrity.includes('actualOxford(root)')&&integrity.includes("querySelectorAll('.story-authored-sentence')"));
assert(integrity.includes('glossaryFromActualStoryText:true')&&integrity.includes('randomPracticeRemoved:true'));
for(const f of ['story-depth-v85-data.js?v=85','story-integrity-v85.js?v=85','classic-games-v85.js?v=85','game-home-v85.js?v=85'])assert(loader.includes(f),`loader missing ${f}`);
const ctx={window:{}};vm.createContext(ctx);new vm.Script(read('story-depth-v85-data.js')).runInContext(ctx);const data=ctx.window.STORY_DEPTH_V85_MORE||{},titles=Object.keys(data);assert.equal(titles.length,25,'V85 must extend all 25 stories');
const finalTen=['The Girl Who Found a Map','The Underground Garden','Flight 207','The Snow Cabin',"The Photographer's Last Picture",'The Clock Tower Code','The Empty Stadium','The Island Without Phones','The Box from Bangkok','The Road Beyond the City'];
const words=t=>(String(t).match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;
for(const [title,blocks] of Object.entries(data)){assert(Array.isArray(blocks)&&blocks.length>0,`${title}: no V85 chapter`);if(finalTen.includes(title))assert(blocks.length>=2,`${title}: final ten needs at least 2 extra scenes`);for(const [en,th] of blocks){assert(words(en)>=65,`${title}: extra scene too short (${words(en)})`);assert(/[ก-๙]/.test(th),`${title}: Thai translation missing`)}}
console.log(JSON.stringify({ok:true,version:'v85',classicGames:11,levels:5,stories:titles.length,glossary:'actual-story-text',finalTenExtraScenes:2,noXP:true,noMission:true},null,2));