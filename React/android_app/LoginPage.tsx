import React from 'react';
import {View, StyleSheet} from 'react-native';
import LoginComp from './LoginComp';
import utils from './utils';

function LoginPage({navigation, route}) {
  return (
    <View style={styles.container}>
      <LoginComp
        nameClass="username"
        auxClass="password"
        buttonText="Login"
        onLoginSubmit={(identifier, aux) => {
          console.log(identifier, aux);
          navigation.navigate(identifier, aux);
        }}
        onAuxChecker={utils.handleLogin}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  signupText: {
    textDecorationLine: 'underline',
    textDecorationColor: 'blue',
    cursor: 'pointer',
    marginTop: 20,
  },
});

export default LoginPage;
