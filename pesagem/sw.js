// Pesagem CD — abre sem internet (guarda a tela). Rede primeiro; sem rede, usa a cópia guardada.
// As chamadas pra Edge Function NÃO passam por aqui (a fila offline mora no IndexedDB da página).
const CACHE = 'pesagem-v1'
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', './index.html', './manifest.json'])).then(() => self.skipWaiting())) })
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())) })
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url)
  if (e.request.method !== 'GET' || u.origin !== location.origin) return
  e.respondWith(fetch(e.request).then((r) => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then((x) => x.put(e.request, c)) } return r }).catch(() => caches.match(e.request).then((r) => r || caches.match('./index.html'))))
})
