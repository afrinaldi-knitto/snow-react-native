/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import {name as appName} from './app.json';

async function onMessageReceived(message) {
    console.log(`ini message : ${JSON.stringify(message)}`);
    await notifee.displayNotification({
        title: `${message.notification.title}`,
        body: `${message.notification.body}`,
        android: {
          channelId: 'fcm',
        },
      });
}

messaging().setBackgroundMessageHandler(onMessageReceived);

AppRegistry.registerComponent(appName, () => App);
