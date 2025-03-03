import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import CustomButton from "./CustomButton";

interface Props {
  nameClass: string;
  auxClass: string;
  buttonText: string;
  onLoginSubmit: (identifier: string, aux: object) => void;
  onAuxChecker: (
    name: string,
    aux: string
  ) => Promise<[boolean, string, object]>;
}

function LoginComp({
  nameClass,
  auxClass,
  buttonText,
  onLoginSubmit,
  onAuxChecker,
}: Props) {
  const [name, setName] = useState("");
  const [aux, setAux] = useState("");
  const [error, setError] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text>{nameClass}: </Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />
      </View>
      <View style={styles.inputContainer}>
        <Text>{auxClass}: </Text>
        <TextInput
          style={styles.input}
          secureTextEntry={auxClass === "password"}
          value={aux}
          onChangeText={setAux}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <CustomButton
        onPress={async () => {
          if (!name || !aux) {
            setError("Incomplete information");
            return;
          }
          const [result, errorMsg, aux_data] = await onAuxChecker(name, aux);
          if (!result) setError(errorMsg);
          else onLoginSubmit(errorMsg, aux_data);
        }}
        title={buttonText}
        color="green"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    width: 200,
  },
  errorText: {
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
});

export default LoginComp;
