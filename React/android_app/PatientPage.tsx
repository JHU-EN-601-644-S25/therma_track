import {View, StyleSheet, Text} from 'react-native';
import CustomButton from './CustomButton';
import PatientStatsComp from './PatientStatsComp';
import {useEffect, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

function PatientPage({route}: {route: any}) {
  console.log(route.params);
  const {viewer_id, patient_id} = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const logout = () => {
      navigation.navigate('Login');
    };
    timerRef.current = setTimeout(logout, 1 * 60 * 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.container}>Welcome, Patient {viewer_id}</Text>
      <PatientStatsComp patient_id={patient_id} viewer_id={viewer_id} />
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
