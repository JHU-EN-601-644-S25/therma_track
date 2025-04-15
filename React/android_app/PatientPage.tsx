import {View, StyleSheet} from 'react-native';
import CustomButton from './CustomButton';
import PatientStatsComp from './PatientStatsComp';

function PatientPage({navigation, route}) {
  return (
    <View style={styles.container}>
      <PatientStatsComp patient_id={route.params.id} />
      <CustomButton
        title={route.params.status === 'p' ? 'Log out' : 'Return'}
        onPress={() => navigation.goBack()}
        color="green"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});

export default PatientPage;
