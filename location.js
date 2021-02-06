import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
      (async () => {
        let locationEnabled = await Location.hasServicesEnabledAsync();
        if (!locationEnabled){
          alert("Turn on your location services to use this app");
        }
        else{
          let { status } = await Location.requestPermissionsAsync();
          if (status === 'granted') {
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
          }
          else{
            //setErrorMsg('Permission to access location was denied');
            alert('Allow access to location services to use this app');
          }
        }
      })();
  }, []);

  let text = 'Waiting..';
  // if (errorMsg) {
  //   text = errorMsg;
  // } else 
  if (location) {
    console.log(location);
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
});
