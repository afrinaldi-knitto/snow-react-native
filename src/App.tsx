import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import messaging from '@react-native-firebase/messaging';
import notifee, {AuthorizationStatus} from '@notifee/react-native';
import {showNotification} from './utils/notificationUtils';

function App(): React.JSX.Element {
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  useEffect(() => {
    checkHasPermission();
    subscribeToTopic();

    const unSubscribeMessage = messaging().onMessage(async remoteMessage => {
      if (remoteMessage.notification?.title === undefined) {
        return;
      }

      try {
        showNotification(
          remoteMessage.notification?.title || '',
          remoteMessage.notification?.body || '',
        );
      } catch (error) {
        console.log(`has error foreground notification : ${error}`);
      }
    });

    return () => unSubscribeMessage();
  }, []);

  const subscribeToTopic = async () => {
    try {
      await messaging().subscribeToTopic('topicA');
      console.log('Success subscribe to topic');
    } catch (error) {
      console.error('Failed to subscribe to topic:', error);
    }
  };

  const checkHasPermission = async () => {
    const settings = await notifee.getNotificationSettings();

    if (settings.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
      console.log('Notification permissions are authorized');
      setHasPermission(true);
    } else {
      console.log('Notification permissions are not authorized');
      setHasPermission(false);
    }
  };

  const requestPermission = async () => {
    const settings = await notifee.requestPermission();
    if (settings.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
      setHasPermission(true);
      console.log('Permission granted');
    } else {
      setHasPermission(false);
      console.log('Permission denied');
    }
  };

  return (
    <View style={styles.background}>
      {!hasPermission ? (
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.text}>Izinkan Notifikasi</Text>
        </TouchableOpacity>
      ) : (
        <Text>Waching</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: 16,
    backgroundColor: '#1E88E5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disconnectButton: {
    backgroundColor: '#E53935',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default App;
