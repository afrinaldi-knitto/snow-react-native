/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import messaging from '@react-native-firebase/messaging';
import notifee, {EventType} from '@notifee/react-native';
import {name as appName} from './app.json';
import {showNotification} from './src/utils/notificationUtils';

async function onMessageReceived(remoteMessage) {
  console.log(`remoteMessage : ${JSON.stringify(remoteMessage)}`);
  try {
    showNotification(
      remoteMessage.notification.title,
      remoteMessage.notification.body,
    );
  } catch (error) {
    console.log(`has error background notification : : ${error}`);
  }
}

messaging().setBackgroundMessageHandler(onMessageReceived);

notifee.onBackgroundEvent(async ({type, detail}) => {
  // handle background events
});

AppRegistry.registerComponent(appName, () => App);
