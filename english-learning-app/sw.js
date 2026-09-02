const CACHE='my-english-v11';
const ASSETS=['./','./index.html','./styles.css?v=11','./enhancements.css?v=11','./game-lab.css?v=11','./enhancements.js?v=11','./app.js?v=11','./content-pack.js?v=11','./game-lab.js?v=11','./ai-status.js?v=11','./ai-output-safety.js?v=11','./mission-action-fix.js?v=11','./manifest.webmanifest?v=11','./app-icon.svg'];
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
