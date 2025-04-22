import {useState} from 'react';
import PopupComp from './PopupComp';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import CustomButton from './CustomButton';

interface Props {
  get_user_id: () => number;
  check_func: (id: number, input: string) => Promise<[boolean, string]>;
  set_auth_status: (status: boolean) => void;
}

function TwoFactorAuthComp({get_user_id, check_func, set_auth_status}: Props) {
  const [numFails, setNumFails] = useState(0);
  const [errMsg, setErrMsg] = useState('');
  const [inputCode, setInputCode] = useState('');

  return (
    <PopupComp
      onClose={() => set_auth_status(false)}
      children={
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <Text>Plese input the verification code you received: </Text>
            <TextInput
              style={styles.input}
              value={inputCode}
              onChangeText={text => setInputCode(text)}
            />
          </View>
          <CustomButton
            title="Submit"
            color="green"
            onPress={async () => {
              const user_id = get_user_id();
              const [check_result, msg] = await check_func(user_id, inputCode);
              if (!check_result && msg !== '') {
                setErrMsg(msg);
              } else if (check_result) {
                set_auth_status(true);
              } else {
                setNumFails(numFails + 1);
                if (numFails < 5) {
                  setErrMsg(
                    `Invalid authorization code. ${
                      5 - numFails
                    } trials remaining`,
                  );
                } else {
                  set_auth_status(false);
                }
              }
            }}
          />
          {errMsg && <Text style={styles.errorText}>{`${errMsg}`}</Text>}
        </View>
      }
    />
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

export default TwoFactorAuthComp;
