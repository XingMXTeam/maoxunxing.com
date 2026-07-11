const CACHE_VERSION = "20260711-2";

const CACHE_NAMES = {
  assets: `assets-${CACHE_VERSION}`,
  content: `content-${CACHE_VERSION}`,
  offline: `offline-${CACHE_VERSION}`,
};

const PRECACHE_FILES = [
  "/manifest.json",
  "/images/favicon/favicon-32x32.png",
  "/images/favicon/favicon-16x16.png",
  "/css/font.css",
  "/css/main.css",
  "/images/avatar.avif",
  "/en/404.html",
];

const OFFLINE_PAGE = "/en/404.html";

async function precacheFiles() {
  const cache = await caches.open(CACHE_NAMES.assets);
  await Promise.allSettled(
    PRECACHE_FILES.map(async (url) => {
      try {
        await cache.add(url);
      } catch (error) {
        console.warn("Unable to precache", url, error);
      }
    }),
  );
}

async function deleteOldCaches() {
  const currentNames = new Set(Object.values(CACHE_NAMES));
  const names = await caches.keys();
  await Promise.all(
    names
      .filter((name) => !currentNames.has(name))
      .map((name) => caches.delete(name)),
  );
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAMES.content);

  try {
    const response = await fetch(request);
    if (response && response.status < 400) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;

    const offline = await caches.match(OFFLINE_PAGE);
    if (offline) return offline;

    throw error;
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAMES.content);
  const cached = await cache.match(request);

  const networkRequest = fetch(request)
    .then(async (response) => {
      if (response && response.status < 400) {
        await cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  if (cached) {
    networkRequest.catch(() => null);
    return cached;
  }

  const response = await networkRequest;
  if (response) return response;

  throw new Error(`Unable to fetch ${request.url}`);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([precacheFiles(), self.skipWaiting()]),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([deleteOldCaches(), self.clients.claim()]),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const accept = request.headers.get("accept") || "";
  const isNavigation = request.mode === "navigate" || accept.includes("text/html");

  if (isNavigation) {
    // HTML must be network-first so newly deployed pages are not hidden by an
    // hour-old Service Worker response. The cached copy remains an offline fallback.
    event.respondWith(networkFirst(request));
    return;
  }

  if (new URL(request.url).origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request));
  }
});
