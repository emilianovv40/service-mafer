//Nombre del cache
const cacheName = 'proyecto';

//Archivos y recursos para almacenar en cache
const cacheAssets = [
    'index.html',
    'main.js', 
    'pagina1.html',
    'pagina2.html',
    'img/image1.png',
    'img/img1.1.jpg',
    'img/img1.jpg',
    'img/img2.jpg',
    'img/img3.jpg'
];

//Instalar el service worker
self.addEventListener('install', (event) => {
    console.log('Service Worker: Instalado');
    
    //Precarga de los recursos para guardar en cache
    event.waitUntil(
        caches.open(cacheName)
        .then((cache) => {
        console.log('Service Worker: Cacheado en archivos.');
        return cache.addAll(cacheAssets);
    })
    .then(() => self.skipWaiting())
    );
});

//Activar el Service Worker
self.addEventListener('activate' , (event) => {
console.log('service worker: Activado');

//Eliminar caches antiguas

event.waitUntil(
    caches.keys().then(cacheNames =>{
        return Promise.all (
            cacheNames.map(cache => {
                if (cache !== cacheName) {
                    console.log('Service Worker: Limpiando el cache antiguo');
                    return caches.delete(cache);
                }
            })
        );
    })
);
});

//Escuchamos el evento push para mostrar una notificacion
self.addEventListener('push',function(event) {
    console.log('[Service Worker] Push Recibido');
    console.log(`[Service Worker] Datos del Push: "${event.data.text()}"`);

    //Usamos Const para manejar y controlar las notifiaciones del service worker y la API Implementada.
    const title = 'No se duerman';
    const options = {
        body: event.data.text(),
        icon: 'icono.png',
        badge: 'insignia.png'
    };

    event.waitUntil(self.registration.showNotification(title, options));
})

//Manejamos peticiones 
self.addEventListener('fetch', (event) => {
    console.log('Service Worker: Fetching');
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request))
    );
});