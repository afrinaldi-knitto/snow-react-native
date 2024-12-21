import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import notifee, {AuthorizationStatus} from '@notifee/react-native';

function App(): React.JSX.Element {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isWsConnected, setWsConnected] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    checkHasPermission();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

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

  const connectWebSocket = () => {
    if (ws.current) {
      ws.current.close();
    }

    ws.current = new WebSocket('ws://192.168.20.27:8180/');

    ws.current.onopen = () => {
      setWsConnected(true);
      console.log('WebSocket Connected');
    };

    ws.current.onclose = (e: any) => {
      setWsConnected(false);
      console.log(`WebSocket Closed: ${e.reason}`);
    };

    ws.current.onerror = (e: Event) => {
      setWsConnected(false);
      console.log('WebSocket Error: ', e);
    };

    ws.current.onmessage = e => {
      try {
        const data = JSON.parse(e.data);
        if (data.jumlah_data !== undefined) {
          setCounter(prevState => {
            showNotification(`${data.jumlah_data}`, prevState + 1);
            return prevState + 1;
          });
        }
      } catch (error: any) {
        console.error('Failed to parse message: ', error);
      }
    };
  };

  const disconnectWebSocket = () => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    setWsConnected(false);
    console.log('WebSocket Disconnected');
  };

  const showNotification = async (message: string, newcounter: number) => {
    const channelId = await notifee.createChannel({
      id: 'ws_channel',
      name: 'ws channel',
    });

    await notifee.displayNotification({
      title: `Notifikasi ke - ${newcounter}`,
      body: `MESSAGE SOCKET : ${message}`,
      android: {
        channelId,
      },
    });
  };

  return (
    <View style={styles.background}>
      {!hasPermission ? (
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.text}>Izinkan Notifikasi</Text>
        </TouchableOpacity>
      ) : isWsConnected ? (
        <TouchableOpacity
          style={[styles.button, styles.disconnectButton]}
          onPress={disconnectWebSocket}>
          <Text style={styles.text}>Disconnect</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={connectWebSocket}>
          <Text style={styles.text}>Connect</Text>
        </TouchableOpacity>
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
