import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
// Pressable
import CustomButton from './CustomButton';

interface Props {
  nameClass: string;
  auxClass: string;
  buttonText: string;
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
}

function LoginComp({
  nameClass,
  auxClass,
  buttonText,
  onLoginSubmit,
  onAuxChecker,
}: Props) {
  const [name, setName] = useState('');
  const [aux, setAux] = useState('');
  const [error, setError] = useState('');

  return (
    <View style={styles.container}>
      {nameClass && (
        <View style={styles.inputContainer}>
          <Text>{nameClass}:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={text => setName(text)}
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
            secureTextEntry={auxClass.toLowerCase() === 'password'}
            onChangeText={text => setAux(text)}
          />
        </View>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    width: 200,
  },
  errorText: {
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
});

export default LoginComp;
