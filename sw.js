/* ParkHere 오프라인 캐시 — 앱 셸을 저장해 지하 주차장(무신호)에서도 열리게 함 */
const CACHE = "parkhere-shell-v2";
const SHELL = ["./", "./index.html", "./manifest.json", "./icon-180.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks =>
    Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  // 페이지 본문은 네트워크 우선 — 새 버전이 바로 반영되고, 오프라인일 때만 캐시 사용
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match(e.request).then(r => r || caches.match("./index.html")))
    );
    return;
  }
  // 아이콘 등 나머지 자원은 캐시 우선
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    }))
  );
});
