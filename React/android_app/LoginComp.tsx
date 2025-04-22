<<<<<<< HEAD
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import CustomButton from "./CustomButton";
=======
import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
// Pressable
import CustomButton from './CustomButton';
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2

interface Props {
  nameClass: string;
  auxClass: string;
  buttonText: string;
<<<<<<< HEAD
  onLoginSubmit: (identifier: string, aux: object) => void;
  onAuxChecker: (
    name: string,
    aux: string
  ) => Promise<[boolean, string, { status: string; id: number }]>;
=======
  onLoginSubmit: (
    identifier: string,
    aux: {status: string; viewer_id: number; patient_id: number},
    image_src: string | null,
  ) => void;
  onAuxChecker: (
    name: string,
    aux: string,
  ) => Promise<[boolean, string, {status: string; id: number}, string | null]>;
  // onLoginSubmit: (identifier: string, aux: object) => void;
  // onAuxChecker: (
  //   name: string,
  //   aux: string
  // ) => Promise<[boolean, string, { status: string; id: number }]>;
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
}

function LoginComp({
  nameClass,
  auxClass,
  buttonText,
  onLoginSubmit,
  onAuxChecker,
}: Props) {
<<<<<<< HEAD
  const [name, setName] = useState("");
  const [aux, setAux] = useState("");
  const [error, setError] = useState("");
  //const [tries, setTries] = useState(0);
=======
  const [name, setName] = useState('');
  const [aux, setAux] = useState('');
  const [error, setError] = useState('');
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2

  return (
    <View style={styles.container}>
      {nameClass && (
        <View style={styles.inputContainer}>
          <Text>{nameClass}:</Text>
          <TextInput
            style={styles.input}
            value={name}
<<<<<<< HEAD
            onChangeText={(text) => setName(text)}
=======
            onChangeText={text => setName(text)}
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
            placeholder={`Enter your ${nameClass}`}
          />
        </View>
      )}
      {auxClass && (
        <View style={styles.inputContainer}>
          <Text>{auxClass}:</Text>
          <TextInput
            style={styles.input}
            value={aux}
            placeholder={`Enter your ${auxClass}`}
<<<<<<< HEAD
            secureTextEntry={auxClass.toLowerCase() === "password"}
            onChangeText={(text) => setAux(text)}
=======
            secureTextEntry={auxClass.toLowerCase() === 'password'}
            onChangeText={text => setAux(text)}
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
          />
        </View>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
<<<<<<< HEAD
      <Pressable
        style={styles.button}
        onPress={async () => {
          if ((!nameClass && !name) || (!auxClass && !aux)) {
            setError("Incomplete information");
            return;
          }
          const [result, pageName, userObj] = await onAuxChecker(name, aux);
          if (!result) {
            setError(pageName);
          } else {
            setError("");
            onLoginSubmit(pageName, userObj);
          }
        }}
      >
        <Text style={styles.buttonText}>{buttonText}</Text>
      </Pressable>
=======
      <CustomButton
        title={buttonText}
        color="green"
        onPress={async () => {
          if ((!nameClass && !name) || (!auxClass && !aux)) {
            setError('Incomplete information');
            return;
          }
          const [result, pageName, userObj, qrStr] = await onAuxChecker(
            name,
            aux,
          );
          if (!result) {
            setError(pageName);
          } else {
            setError('');
            onLoginSubmit(
              pageName,
              {
                status: userObj.status,
                viewer_id: userObj.id,
                patient_id: pageName === 'Patient' ? userObj.id : -1,
              },
              qrStr,
            );
          }
        }}
      />
      {/* <Pressable
        style={styles.button}
        onPress={async () => {
          if ((!nameClass && !name) || (!auxClass && !aux)) {
            setError('Incomplete information');
            return;
          }
          const [result, pageName, userObj, qrStr] = await onAuxChecker(
            name,
            aux,
          );
          if (!result) {
            setError(pageName);
          } else {
            setError('');
            onLoginSubmit(pageName, userObj, qrStr);
          }
        }}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </Pressable> */}
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
<<<<<<< HEAD
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
=======
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
  },
  inputContainer: {
    marginVertical: 10,
  },
  input: {
    height: 40,
<<<<<<< HEAD
    borderColor: "gray",
=======
    borderColor: 'gray',
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    width: 200,
  },
  errorText: {
<<<<<<< HEAD
    color: "red",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
=======
    color: 'red',
    marginTop: 10,
  },
  // button: {
  //   backgroundColor: '#007bff',
  //   paddingVertical: 10,
  //   paddingHorizontal: 20,
  //   borderRadius: 5,
  //   marginTop: 20,
  // },
  // buttonText: {
  //   color: 'white',
  //   fontSize: 16,
  // },
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
});

export default LoginComp;
