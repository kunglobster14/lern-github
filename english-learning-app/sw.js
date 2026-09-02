const CACHE='my-english-v14';
const ASSETS=['./','./index.html','./styles.css?v=14','./enhancements.css?v=14','./game-lab.css?v=14','./learning-path.css?v=14','./core3000-plan.css?v=14','./core3000-study.css?v=14','./enhancements.js?v=14','./app.js?v=14','./content-pack.js?v=14','./game-lab.js?v=14','./learning-path.js?v=14','./core3000-plan.js?v=14','./core3000-study.js?v=14','./ai-status.js?v=14','./ai-output-safety.js?v=14','./mission-action-fix.js?v=14','./manifest.webmanifest?v=14','./app-icon.svg'];
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