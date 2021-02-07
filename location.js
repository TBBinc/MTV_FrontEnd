import React, { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet, AppState } from "react-native";
import Constants from "expo-constants";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView from "react-native-maps";
import Marker from "react-native-maps";

export default function Geo() {
  const [latitude, setLat] = useState(null);
  const [longitude, setLong] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);
    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
    }
    //FIX BUG WHERE USER CANT DENY LOCATION REQUEST
    _getLocation();
    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    //console.log("AppState", appState.current);
  };

  const _getLocation = async () => {
    try {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Allow access to location services to use this app");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLat(location.coords.latitude);
      setLong(location.coords.longitude);
      //console.log(location);
    } catch (error) {
      let status = Location.getProviderStatusAsync();
      if (!status.locationServicesEnabled) {
        setErrorMsg("Turn on location services to use this app");
      }
    }
  };

  const storeLocation = async () => {
    let locationObject = {};
    locationObject.lat = latitude;
    locationObject.long = longitude;
    try {
      await AsyncStorage.setItem("location", JSON.stringify(locationObject));
    } catch (error) {
      console.log("Error retrieving data" + error);
    }
  };

  if (errorMsg) {
    // alert(errorMsg);
  } else {
    storeLocation();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>Latitude = {latitude}</Text>
      <Text style={styles.paragraph}>Longitute = {longitude}</Text>
      <MapView style={styles.map}
          initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0,
              longitudeDelta: 0.0,
          }}
        >
        <MapView.Marker
            coordinate={{latitude: 37.78825,
            longitude: -122.4324}}
            title={"title"}
            description={"description"}
         />
      </MapView>
    </View>
  );
}

var styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#F5FCFF',
  },
    map: {
      position: 'absolute',
      top: 250,
      left: 0,
      right: 0,
      bottom: 0,
    }
});

