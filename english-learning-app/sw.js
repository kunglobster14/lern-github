const CACHE='my-english-v44';
const ASSETS=[
  './','./index.html','./styles.css?v=33','./enhancements.css?v=33','./game-lab-v31.css?v=33','./learning-path.css?v=33','./learning-guide.css?v=33','./core3000-plan.css?v=44','./core3000-study.css?v=44','./core3000-library.css?v=44','./oxford3000-extra.css?v=44','./complete-course.css?v=33','./account-gate.css?v=33',
  './app.js?v=33','./enhancements.js?v=33','./content-pack.js?v=33','./game-lab-v31.js?v=33','./learning-path.js?v=33','./learning-guide.js?v=33',
  './oxford3000-pack-01.js?v=44','./oxford3000-pack-02.js?v=44','./oxford3000-pack-03.js?v=44','./oxford3000-pack-03b.js?v=44','./oxford3000-pack-04.js?v=44','./oxford3000-pack-05.js?v=44','./oxford3000-pack-06.js?v=44','./oxford3000-pack-07.js?v=44','./oxford3000-pack-08.js?v=44','./oxford3000-loader.js?v=44','./oxford3000-core.js?v=44','./core3000-study.js?v=44','./core3000-library.js?v=44','./oxford3000-practice.js?v=44','./oxford3000-stories.js?v=44','./core3000-plan.js?v=44',
  './learning-ui-v37.js?v=37','./complete-course.js?v=33','./vocab-unify.js?v=33','./ai-status.js?v=33','./ai-output-safety.js?v=33','./account-gate.js?v=33','./account-admin.js?v=33','./manifest.webmanifest?v=44','./icon.svg'
];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.pathname.includes('/api/'))return;event.respondWith(fetch(event.request,{cache:'no-store'}).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response}).catch(()=>caches.match(event.request).then(match=>match||caches.match('./index.html'))))});
