import React, { useState } from "react";
import QRCode from "react-native-qrcode-svg";
import {
  Text,
  View,
  Button,
  Platform,
  StyleSheet,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignUpForm() {
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [age, setAge] = useState(null);
  const [healthCardNum, sethealthCardNum] = useState(null);
  const [uuid, setuuid] = useState(null);

  saveInfo = async () => {
    let storedObject = {};
    storedObject.firstName = firstName;
    storedObject.lastName = lastName;
    storedObject.age = age;
    storedObject.healthCardNum = healthCardNum;
    try {
      await AsyncStorage.setItem("allTextValue", JSON.stringify(storedObject));
      const infoValue = await AsyncStorage.getItem("allTextValue");
      let resObject = JSON.parse(infoValue);
      let fName = resObject.firstName;
      let lName = resObject.lastName;
      let age = resObject.age;
      let hCardNum = resObject.healthCardNum;
      console.log("\n" + "Start of Patient Info");
      console.log(fName);
      console.log(lName);
      console.log(age);
      console.log(hCardNum);
      let token = await AsyncStorage.getItem("pushToken");
      let tokenObject = JSON.parse(token);
      console.log(tokenObject);
      let locations = await AsyncStorage.getItem("location");
      let locationObject = JSON.parse(locations);
      console.log(locationObject.lat);
      console.log(locationObject.long);
      setFirstName("");
      setLastName("");
      setAge("");
      sethealthCardNum("");
      let latNum = parseFloat(locationObject.lat);
      let longNum = parseFloat(locationObject.lat);
      fetch("https://radiant-springs-33535.herokuapp.com/location", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latlocation: latNum,
          longlocation: longNum,
          age: parseInt(age),
          pushToken: tokenObject,
        }),
      })
        .then((response) => response.text())
        .then((responseData) => {
          console.log("POST Response -> " + responseData);
        });
    } catch (error) {
      console.log("Error retrieving data" + error);
    }
    alert(
      "Success! Please provide QRCode shown below at the beginning of your vaccination appointment. Thank you!"
    );
  };

  return (
    <View>
      <View style={styles.formData}>
        <TextInput
          style={styles.textInputs}
          placeholder="Enter first name"
          onChangeText={(text) => setFirstName(text)}
          value={firstName}
        />
        <TextInput
          style={styles.textInputs}
          placeholder="Enter last name"
          onChangeText={(text) => setLastName(text)}
          value={lastName}
        />
        <TextInput
          style={styles.textInputs}
          placeholder="Enter Age"
          onChangeText={(text) => setAge(text)}
          value={age}
          keyboardType={"number-pad"}
        />
        <TextInput
          style={styles.textInputs}
          placeholder="Enter Health Card Number"
          onChangeText={(text) => sethealthCardNum(text)}
          value={healthCardNum}
        />
        <Button title="Sign Up Here" onPress={() => saveInfo()} />
      </View>
      <View style={styles.qr} >
        <QRCode value="http://awesome.link.qr" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textInputs: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    margin: 5,
    paddingTop: 5,
    paddingLeft: 5,
  },

  qr: {
      
  },

  formData: {
    //margin:10,
  },
});
