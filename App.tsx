import React, {useEffect, useRef} from 'react';
import {SafeAreaView, StatusBar, useColorScheme} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  let ws = useRef(new WebSocket('ws://192.168.20.27:8180/')).current;

  useEffect(() => {
    ws.onopen = () => {
      console.log('WS OPEN');
    };
    ws.onclose = (e: any) => {
      console.log(`WS CLOSE ${e.message}`);
    };
    ws.onerror = e => {
      console.log(`WS ERROR : ${e.message}`);
    };
    ws.onmessage = e => {
      console.log(`WS OK : ${e}`);
    };
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
    </SafeAreaView>
  );
}

export default App;
