const urlBase64ToUint8Array = function(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
          .replace(/-/g, '+')
          .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

window.addEventListener("load", async loadEvt => {
    const register = await navigator.serviceWorker.register('/www/sw.js');
    console.log("register", register);

    const pubKeyResponse = await fetch("/pubkey");
    const publicVapidKey = await pubKeyResponse.json();

    const triggerPush = document.querySelector('.trigger-push');
    async function triggerPushNotification() {
        const subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });

        await fetch('/subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    triggerPush.addEventListener('click', () => {
      triggerPushNotification().catch(error => console.error(error));
    });
});
