import React, { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet, AppState } from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView from "react-native-maps";

export default function Geo(props) {
  let latdata, longdata;
  if (props.coords != null) {
    console.log(props.show);
    let ob = JSON.parse(props.coords);
    latdata = ob.latdata;
    longdata = ob.longdata;
    console.log(props.coords.latdata);
    console.log(props.coords.longdata);
  }
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
    <View>
      {props.coords != null ? 
      <View style={styles.container}>
        <Text style={styles.title}>Your Vaccination Centre</Text>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0043,
            longitudeDelta: 0.0034,
          }}
        >
          <MapView.Marker
            coordinate={{ latitude: {latdata}, longitude: {longdata} }}
          />
        </MapView>
      </View>
      : null}
    </View>
  );
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 200,
    marginTop: 30,
  },
  map: {
    height: 250,
    width: 375,
    position: "absolute",
    top: 0,
    left: -5,
    right: 0,
    bottom: 0,
  },

  title: {
    fontSize: 35,
    marginBottom: 55,
  },
});
