import React, { useState } from "react";
import QRCode from "react-native-qrcode-svg";
import { Text, View, Button, StyleSheet, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

export default function SignUpForm() {
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [age, setAge] = useState(null);
  const [healthCardNum, sethealthCardNum] = useState(null);
  const [formJson, setFormJson] = useState("state");

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
      let formData = JSON.stringify({
        firstName: fName,
        lastName: lName,
        age: age,
        healthCardNum: hCardNum,
        pushToken: tokenObject,
      });
      const hashedForm = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        formData
      );
      setFormJson(hashedForm);
    } catch (error) {
      console.log("Error retrieving data" + error);
    }
    alert(
      "Registration Complete! Please provide your QR Code shown here at the beginning of your vaccination appointment. Thank you!"
    );
  };
  return (
    <View>
      {formJson == "state" ? (
        <View>
          <Text h1 style={styles.title}>
            My Vax
          </Text>
          <View style={styles.formContent}>
            <TextInput
              style={styles.textInputs}
              placeholder="Enter first name"
              onChangeText={(text) => setFirstName(text)}
              value={firstName}
              placeholderTextColor={"black"}
            />
            <TextInput
              style={styles.textInputs}
              placeholder="Enter last name"
              onChangeText={(text) => setLastName(text)}
              value={lastName}
              placeholderTextColor={"black"}
            />
            <TextInput
              style={styles.textInputs}
              placeholder="Enter Age"
              onChangeText={(text) => setAge(text)}
              value={age}
              keyboardType={"number-pad"}
              placeholderTextColor={"black"}
            />
            <TextInput
              style={styles.textInputs}
              placeholder="Enter Health Card Number"
              onChangeText={(text) => sethealthCardNum(text)}
              value={healthCardNum}
              placeholderTextColor={"black"}
            />
          </View>
          <View style={styles.button}>
            <Button title="Register Here" onPress={() => saveInfo()} />
          </View>
        </View>
      ) : (
        <View style={styles.qr}>
          <Text h1 style={styles.qrTitle}>
            Your QR Code
          </Text>
          <QRCode value={formJson} size={300} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({

  title: {
    fontSize: 50,
    left: 110,
    marginBottom: 5,
  },

  qrTitle: {
    fontSize: 35,
    left: 50,
    marginBottom: 5,
  },

  textInputs: {
    height: 40,
    borderColor: "black",
    borderWidth: 1,
    margin: 8,
    paddingTop: 6,
    paddingLeft: 5,
  },

  button: {
    margin: 8,
    marginTop: 3,
  },

  qr: {
    marginLeft: 32,
    marginBottom: 50,
    paddingBottom: 20,
  },

  formContent: {
    marginBottom: 15,
  },
});
