import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class WebPushService {
  isSubscribed = new BehaviorSubject<boolean>(false);
  swReg: ServiceWorkerRegistration;

  constructor() { }

  register() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      console.log('Service Worker and Push is supported');

      navigator.serviceWorker.register('service-worker.js')
      .then((swReg) => {
        console.log('Service Worker is registered', swReg);
        this.swReg = swReg;

        // Set the initial subscription value
        swReg.pushManager.getSubscription()
        .then((subscription) => {
          const subscribed = !(subscription === null);
          this.isSubscribed.next(subscribed);

          // updateSubscriptionOnServer(subscription);

          if (subscribed) {
            console.log('User IS subscribed.');
          } else {
            console.log('User is NOT subscribed.');
          }
        });
      })
      .catch(function(error) {
        console.error('Service Worker Error', error);
      });
    } else {
      console.warn('Push messaging is not supported');
    }
  }

  subscribe() {
    const applicationServerPublicKey = 'BJPMaDrbRiUzH8IeMvRMn7CcxFMIQzTEB1j62Kn' +
    'gB5irgMhB9TPgcmMjwB7t1aRkUKDwzz9MMH3ASEKLKX_mqjk';

    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    this.swReg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
    .then((subscription) => {
      console.log('User is subscribed.');

      this.isSubscribed.next(true);
    })
    .catch(function(err) {
      console.log('Failed to subscribe the user: ', err);
    });
  }

  unsubscribe() {
    this.swReg.pushManager.getSubscription()
    .then((subscription) => {
      if (subscription) {
        console.log('unsubscribing', subscription);
        return subscription.unsubscribe()
          .then(successful => {
            console.log('unsubscription result:', successful);
            return successful;
          })
          .catch(err => {
            console.log('unsubscription failed', err);
          });
      }
    })
    .catch(function(error) {
      console.log('Error unsubscribing', error);
    })
    .then(() => {
      // updateSubscriptionOnServer(null);

      console.log('User is unsubscribed.');
      this.isSubscribed.next(false);

      // updateBtn();
    });
  }
}

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
