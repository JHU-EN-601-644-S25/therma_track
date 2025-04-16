import React from "react";
import { View, StyleSheet } from "react-native";
import LoginComp from "./LoginComp";
import utils from "./utils";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

function LoginPage({
  navigation,
  route,
}: {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}) {
  return (
    <View style={styles.container}>
      <LoginComp
        nameClass="username"
        auxClass="password"
        buttonText="Login"
        onLoginSubmit={(identifier, aux) => {
          console.log("Navigating to:", identifier, aux);
          (navigation as any).navigate(identifier, aux);
        }}
        onAuxChecker={(name, aux) => utils.handleLogin(name, aux)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  signupText: {
    textDecorationLine: "underline",
    textDecorationColor: "blue",
    cursor: "pointer",
    marginTop: 20,
  },
});

export default LoginPage;
