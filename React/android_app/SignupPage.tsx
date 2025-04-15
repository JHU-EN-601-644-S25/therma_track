import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import LoginComp from "./LoginComp";
import { useNavigation } from "@react-navigation/native";
import utilsFuncs from "./utils";

function SignupPage() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <LoginComp
        nameClass="username"
        auxClass="password"
        buttonText="Signup"
        onLoginSubmit={(identifier, aux) =>
          navigation.navigate(identifier, aux)
        }
        onAuxChecker={utilsFuncs.handleSignup}
      />
      <TouchableOpacity
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          })
        }
      >
        <Text style={styles.signupText}>Already have an account?</Text>
      </TouchableOpacity>
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
    cursor: "pointer", // This won't work in React Native, but you can style it for interaction.
    marginTop: 20,
  },
});

export default SignupPage;
