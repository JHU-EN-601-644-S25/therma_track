import CustomButton from './CustomButton';
import PopupComp from './PopupComp';
import {View, Text, StyleSheet, Image} from 'react-native';

interface Props {
  image_src: string | null;
  closePopup: () => void;
}

function TwoFactorAuthInitComp({image_src, closePopup}: Props) {
  return (
    <PopupComp
      onClose={() => closePopup()}
      children={
        <View style={styles.container}>
          <Text>Use the QRcode below to check in : </Text>
          {image_src && <Image src={image_src} alt="QR Code for 2FA setup" />}
          <CustomButton title="Close" color="green" onPress={closePopup} />
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

export default TwoFactorAuthInitComp;
