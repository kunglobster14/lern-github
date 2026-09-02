const CACHE='my-english-v15';
const ASSETS=['./','./index.html','./styles.css?v=15','./enhancements.css?v=15','./game-lab.css?v=15','./learning-path.css?v=15','./core3000-plan.css?v=15','./core3000-study.css?v=15','./enhancements.js?v=15','./app.js?v=15','./content-pack.js?v=15','./game-lab.js?v=15','./learning-path.js?v=15','./core3000-plan.js?v=15','./core3000-study.js?v=15','./ai-status.js?v=15','./ai-output-safety.js?v=15','./mission-action-fix.js?v=15','./manifest.webmanifest?v=15','./app-icon.svg'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.pathname.includes('/api/'))return;
  event.respondWith(fetch(event.request,{cache:'no-store'}).then(response=>{
    const copy=response.clone();
    caches.open(CACHE).then(cache=>cache.put(event.request,copy));
    return response;
  }).catch(()=>caches.match(event.request).then(match=>match||caches.match('./index.html'))));
});