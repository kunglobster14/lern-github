(()=>{
  let readyPromise=null;
  const normalizeRow=(r,i)=>{
    if(Array.isArray(r))return [r[0]??i+1,r[1]??'',r[2]??'',r[3]??'',r[4]??'',r[5]??'',r[6]??''];
    if(r&&typeof r==='object')return [r.id??r.rank??i+1,r.word??r.english??'',r.part??r.pos??r.type??'',r.level??r.cefr??'',r.thai??r.translation??'',r.example??r.sentence??'',r.exampleThai??r.example_thai??r.sentenceThai??''];
    return null;
  };
  function parseRows(parsed){
    const source=Array.isArray(parsed)?parsed:(parsed?.rows||parsed?.data||parsed?.words||parsed?.items||[]);
    if(!Array.isArray(source))return [];
    return source.map(normalizeRow).filter(r=>r&&String(r[1]||'').trim());
  }
  async function gunzipBase64(b64){
    if(typeof DecompressionStream!=='function')throw new Error('gzip_not_supported');
    const clean=String(b64||'').replace(/\s+/g,'');
    if(!clean)throw new Error('oxford_pack_empty');
    const binary=atob(clean),bytes=new Uint8Array(binary.length);
    for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
    const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    return new Response(stream).text();
  }
  async function load(){
    if(Array.isArray(window.OXFORD3000_RAW)&&window.OXFORD3000_RAW.length>=3000){
      window.OXFORD3000_RAW=window.OXFORD3000_RAW.slice(0,3000);
      return window.OXFORD3000_RAW;
    }
    const text=await gunzipBase64(window.OXFORD3000_GZIP_B64||'');
    const parsed=JSON.parse(text);
    const rows=parseRows(parsed);
    if(rows.length<3000)throw new Error(`oxford_count_${rows.length}`);
    window.OXFORD3000_RAW=rows.slice(0,3000);
    window.OXFORD3000_META=Object.assign({name:'Oxford 3000™ Thai Study Edition',count:3000,levels:'A1-B2'},window.OXFORD3000_META||{});
    window.dispatchEvent(new CustomEvent('oxford3000-ready',{detail:{count:window.OXFORD3000_RAW.length}}));
    return window.OXFORD3000_RAW;
  }
  function ready(){if(!readyPromise)readyPromise=load().catch(err=>{readyPromise=null;throw err});return readyPromise}
  window.Oxford3000={ready,load,version:'v43'};
  window.ensureOxford3000=ready;
})();
