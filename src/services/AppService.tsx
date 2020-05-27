import moment from "moment";
import { isIosDevice } from "utils";
import MessageService from "./MessageService";

let _newServiceWorker: ServiceWorker | null = null;

export const AppService = {

  setNewServiceWorker(newServiceWorker: ServiceWorker | null) {
    _newServiceWorker = newServiceWorker;
  },
  
  checkForUpdate() {
    MessageService.notifyLastUpdateCheckDateTimeChanged(moment().format('YYYY-MM-DD HH:mm:ss'));

    if (isIosDevice) {
      alert(`You must close and re-open the app or browser tab to check for updates when running on an iOS device.\n\n:-(`);
    } else {
      if ('serviceWorker' in navigator) {
        console.log('checkForUpdate::\'serviceWorker\' in navigator = true');
        navigator.serviceWorker.ready.then(registration => {
          console.log('checkForUpdate::navigator.serviceWorker.ready().then()...');
          registration.update().then(() => {
            console.log('checkForUpdate::registration.update().then()::registration = ', registration);
            const serviceWorker = (registration.installing || registration.waiting);
            console.log('checkForUpdate::registration.update().then()::serviceWorker = ', serviceWorker);
            if (serviceWorker) {
              _newServiceWorker = (registration.installing || registration.waiting);
              MessageService.notifyIsUpdateAvailableChanged(true);
            }
          });
        })
        .catch(err => console.log('checkForUpdate::navigator.serviceWorker.ready().catch()', err))
      }
      else {
        console.log('checkForUpdate::\'serviceWorker\' NOT in navigator...');
      }
    }
  },

  installUpdate() {
    console.log('installUpdate::newServiceWorker = ', _newServiceWorker);
    if (_newServiceWorker) {
      _newServiceWorker.postMessage({ type: 'SKIP_WAITING' });
    } else {
      if ('serviceWorker' in navigator) {
        console.log('installUpdate::\'serviceWorker\' in navigator...');
        navigator.serviceWorker.ready.then(registration => {
          console.log('installUpdate::registration.ready().then()::registration = ', registration);
          const serviceWorker = (registration.installing || registration.waiting);
          console.log('installUpdate::registration.ready().then()::serviceWorker = ', serviceWorker);
          if (serviceWorker) {
            serviceWorker.postMessage({ type: 'SKIP_WAITING' });
          }
        })
      } else {
        console.log('installUpdate::\'serviceWorker\' NOT in navigator...');
      }
    }
    MessageService.notifyIsUpdateAvailableChanged(false);
    window.location.reload(true);
  }
}

export default AppService;
