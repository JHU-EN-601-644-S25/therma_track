import CustomButton from './CustomButton';
import PopupComp from './PopupComp';
import {View, Text, StyleSheet} from 'react-native';

interface Props {
  patient_name: string;
  set_verified_status: (val: boolean) => void;
}

function PatientConnectVerificationComp({
  patient_name,
  set_verified_status,
}: Props) {
  return (
    <PopupComp
      onClose={() => {
        set_verified_status(false);
      }}
      children={
        <View>
          <Text>Are you sure you want to connect to {`${patient_name}`}?</Text>
          <CustomButton
            title="Connect"
            color="green"
            onPress={() => {
              set_verified_status(true);
            }}
          />
          <CustomButton
            title="Cancel"
            color="red"
            onPress={() => {
              set_verified_status(false);
            }}
          />
        </View>
      }
    />
  );
}

export default PatientConnectVerificationComp;
