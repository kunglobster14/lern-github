(()=>{
const VERSION='v73-core500';
const WORDS=`a an the this that these those I you he she it we they me him her us them my your his our their who what where when why how yes no not all some any many much more most few little other another same different and but or because so if then than also only even very too just still already again always usually often sometimes never here there now today tomorrow yesterday be have do say tell speak talk ask answer know think understand remember forget learn study read write listen hear see look watch show find use need want like love hate prefer choose take give get make put keep bring buy pay sell cost go come leave arrive stay live work start finish stop wait help try call meet visit travel walk run drive ride fly sit stand open close turn move play eat drink cook sleep wake wash clean wear change grow happen become feel seem mean believe hope plan decide agree disagree explain describe compare follow lead win lose send receive check book order share join return spend save borrow lend carry hold break fix cut build create add remove improve practice pass fail enjoy worry relax smile laugh cry person people man woman boy girl child children baby friend family father mother dad mom parent son daughter brother sister husband wife partner teacher student doctor nurse customer guest visitor neighbor colleague boss manager worker team member name age job class group company school office home house room place country city town village street address phone email language English Thai time day week month year morning afternoon evening night hour minute second Monday Tuesday Wednesday Thursday Friday Saturday Sunday weekend date birthday early late before after during first last next past future soon schedule appointment holiday season spring summer autumn winter food water coffee tea milk juice bread rice meat chicken fish egg fruit vegetable breakfast lunch dinner meal menu bill table restaurant kitchen shop store market money cash card price cheap expensive size color black white red blue green yellow clothes shirt pants shoes bag key door window bed chair desk paper pen computer internet message photo music movie game sport exercise weather rain sun hot cold warm cool good bad big small long short new old young beautiful easy car bus train taxi bicycle bike plane airport station ticket passport hotel reservation map road way direction left right straight near far inside outside upstairs downstairs entrance exit trip journey luggage flight gate seat platform beach park hospital bank bathroom toilet pharmacy police building floor health healthy sick ill pain hurt head face eye ear nose mouth tooth teeth hand arm leg foot feet body heart medicine clinic problem accident kind nice polite friendly helpful honest quiet loud fast slow quick correct wrong true false free full empty dirty closed business meeting project task report file document information idea solution reason result example goal deadline update progress decision support service client budget risk`.split(' ');
const BANDS=[{"category":"function","from":0,"to":74},{"category":"verbs","from":74,"to":206},{"category":"people","from":206,"to":266},{"category":"time","from":266,"to":307},{"category":"daily","from":307,"to":387},{"category":"travel","from":387,"to":432},{"category":"health","from":432,"to":457},{"category":"adjectives","from":457,"to":477},{"category":"work","from":477,"to":500}];
const LEVEL_BANDS=[{level:'A1',from:1,to:54,count:220},{level:'A2',from:55,to:108,count:150},{level:'B1',from:109,to:162,count:90},{level:'B2',from:163,to:210,count:40}];
const category=i=>BANDS.find(b=>i>=b.from&&i<b.to)?.category||'core';
const DATA=WORDS.map((word,i)=>({word,category:category(i)}));
function spread(from,to,count,start){
 const slots=to-from+1,out=Array.from({length:slots},()=>[]);
 for(let i=0;i<count;i++)out[Math.min(slots-1,Math.floor(i*slots/count))].push(DATA[start+i]);
 return out;
}
let cursor=0;const INTRO={},FIRST={};
for(const b of LEVEL_BANDS){
 const rows=spread(b.from,b.to,b.count,cursor);cursor+=b.count;
 rows.forEach((row,i)=>{const d=b.from+i;INTRO[d]=row;row.forEach(x=>FIRST[x.word.toLowerCase()]=d)});
}
function review(day,n){
 const pool=DATA.filter(x=>(FIRST[x.word.toLowerCase()]||999)<day);if(!pool.length)return[];
 const out=[],seen=new Set();for(let i=0;i<pool.length&&out.length<n;i++){const x=pool[(day*7+i*13)%pool.length];if(!seen.has(x.word)){seen.add(x.word);out.push(x)}}return out;
}
function lesson(day){
 day=Math.max(1,Math.min(210,Number(day)||1));
 const n=day<55?4:day<109?5:day<163?6:8;
 return{lessonCode:`L${day}`,newWords:INTRO[day]||[],reviewWords:review(day,n)};
}
window.CORE_VOCAB_500_V73={version:VERSION,total:DATA.length,words:DATA,levelBands:LEVEL_BANDS};
window.getCoreVocabV73=lesson;
})();