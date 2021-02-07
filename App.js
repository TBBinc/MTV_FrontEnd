import * as React from 'react';
import { View, StyleSheet } from "react-native";
import Noti from './noti.js';
import Geo from './location.js';
import SignUpForm from './SignUpForm.js';

export default function App() {
  return (
    <View style={styles.container}>
      <SignUpForm/>
      <Geo/>
      {/* <Noti/> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    padding: 10,
  }
});

