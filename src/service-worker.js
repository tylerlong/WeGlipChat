if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').then(registration => {
      console.info('Service Worker registered: ', registration)
    }).catch(registrationError => {
      console.error('Service Worker registration failed: ', registrationError)
    })
  })
}
