import * as React from 'react';
import { View, StyleSheet, Text } from "react-native";
import Noti from './noti.js';
import SignUpForm from './SignUpForm.js';

export default function App() {
  return (
    <View style={styles.container}>
      <SignUpForm/>
      {/* <Geo/> */}
      <Noti/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#78C980",
    padding: 10,
  }
});

