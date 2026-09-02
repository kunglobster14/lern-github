const CACHE='my-english-v9';
const ASSETS=['./','./index.html','./styles.css?v=9','./enhancements.css?v=9','./game-lab.css?v=9','./enhancements.js?v=9','./app.js?v=9','./content-pack.js?v=9','./game-lab.js?v=9','./ai-status.js?v=9','./ai-output-safety.js?v=9','./manifest.webmanifest?v=9','./app-icon.svg'];
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
