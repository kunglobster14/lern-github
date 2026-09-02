const CACHE='my-english-v12';
const ASSETS=['./','./index.html','./styles.css?v=12','./enhancements.css?v=12','./game-lab.css?v=12','./learning-path.css?v=12','./enhancements.js?v=12','./app.js?v=12','./content-pack.js?v=12','./game-lab.js?v=12','./learning-path.js?v=12','./ai-status.js?v=12','./ai-output-safety.js?v=12','./mission-action-fix.js?v=12','./manifest.webmanifest?v=12','./app-icon.svg'];
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
