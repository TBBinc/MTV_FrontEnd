import * as React from 'react';
import { View, StyleSheet } from "react-native";
import Noti from './noti.js';
import Geo from './location.js';

export default function App() {
  return (
    <View style={styles.container}>
      <Noti/>
      <Geo/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    //paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    paddingBottom: 50,
  }
});

