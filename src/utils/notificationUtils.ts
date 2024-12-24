import notifee from '@notifee/react-native';

export const showNotification = async (title: string, body: string) => {
  const channelId = await notifee.createChannel({
    id: 'notif_channel',
    name: 'notif channel',
  });

  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId,
    },
  });
};
