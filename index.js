/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import messaging from '@react-native-firebase/messaging';
import notifee, {EventType} from '@notifee/react-native';
import {name as appName} from './app.json';

async function onMessageReceived(message) {
  console.log(`ini message : ${JSON.stringify(message)}`);
  try {
    const channelId = await notifee.createChannel({
      id: 'ws_channel',
      name: 'ws channel',
    });

    await notifee.displayNotification({
      title: `${message.notification.title}`,
      body: `${message.notification.body}`,
      android: {
        channelId,
      },
    });
  } catch (error) {
    console.log(`ini error cuy : ${error}`);
  }
}

notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification} = detail;

  switch (type) {
    case EventType.UNKNOWN:
      console.log(`Background Unknown event: ${notification}`);
      break;
    case EventType.PRESS:
      console.log(`Background User pressed notification: ${notification}`);
      break;
    case EventType.DISMISSED:
      console.log(`Background User dismissed notification: ${notification}`);
      break;
    case EventType.ACTION_PRESS:
      console.log(`Background User pressed action: ${notification}`);
      break;
    case EventType.DELIVERED:
      console.log(
        `Background User delivered notification: ${notification.title}`,
      );
      break;
    case EventType.APP_BLOCKED:
      console.log(
        `Background User blocked notification: ${notification.title}`,
      );
      break;
    case EventType.CHANNEL_GROUP_BLOCKED:
      console.log(
        `Background User blocked channel group: ${notification.title}`,
      );
      break;
    case EventType.CHANNEL_BLOCKED:
      console.log(`Background User blocked channel: ${notification.title}`);
      break;
    case EventType.TRIGGER_NOTIFICATION_CREATED:
      console.log(
        `Background User triggered notification created: ${notification.title}`,
      );
      break;
    case EventType.FG_ALREADY_EXIST:
      console.log(`Background User already exist: ${notification.title}`);
      break;
    default:
      console.log('Background default boy');
      break;
  }
});

messaging().setBackgroundMessageHandler(onMessageReceived);

AppRegistry.registerComponent(appName, () => App);
