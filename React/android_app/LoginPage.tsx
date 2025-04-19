import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import LoginComp from './LoginComp';
import utils from './utils';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import TwoFactorAuthComp from './TwoFactorAuthComp';
import TwoFactorAuthInitComp from './TwoFactorAuthInitComp';

function LoginPage({
  navigation,
  route,
}: {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [initVerifier, setInitVerifier] = useState(false);
  const [verifier, setVerifier] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [auxData, setAuxData] = useState({
    viewer_id: -1,
    patient_id: -1,
    status: '',
  });

  return (
    <View style={styles.container}>
      <LoginComp
        nameClass="username"
        auxClass="password"
        buttonText="Login"
        onLoginSubmit={(identifier, aux, img_src) => {
          setImgSrc(img_src);
          if (img_src) {
            setInitVerifier(true);
          } else {
            setVerifier(true);
          }
          console.log('Navigating to:', identifier, aux);
          setIdentifier(identifier);
          setAuxData(aux);
        }}
        onAuxChecker={utils.handleLogin}
      />
      {initVerifier && (
        <TwoFactorAuthInitComp
          image_src={imgSrc}
          closePopup={() => {
            setInitVerifier(false);
            setVerifier(true);
          }}
        />
      )}
      {verifier && (
        <TwoFactorAuthComp
          get_user_id={() => auxData.viewer_id}
          check_func={utils.handleLoginCheck}
          set_auth_status={status => {
            if (status) {
              (navigation as any).navigate(identifier, auxData);
            }
            setVerifier(false);
          }}
        />
      )}
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
