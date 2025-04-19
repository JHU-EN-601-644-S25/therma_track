import {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import PopupComp from './PopupComp';
import CustomButton from './CustomButton';
import {API_BASE_URL} from './config_constants';
import utils from './utils';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import PatientConnectVerificationComp from './PatientConnectVerificationComp';

function DoctorPage({route}: {route: any}) {
  const {viewer_id} = route.params;

  const [connectPatient, setConnectPatient] = useState(false);
  const [checkPatient, setCheckPatient] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [dob, setDob] = useState('');
  const [patients, setPatients] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [message, setMessage] = useState('');
  const [verifier, setVerifier] = useState(false);
  const [patientName, setPatientName] = useState('');

  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updatePatientList = async () => {
    try {
      const patient_list = await fetch(
        `${API_BASE_URL}/doctor/check_patient/${viewer_id}`,
      );
      setPatients(await patient_list.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    updatePatientList();
  }, []);

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
      <View style={styles.buttonContainer}>
        <CustomButton
          onPress={() => {
            setCheckPatient(false);
            setConnectPatient(true);
          }}
          title="Connect Patient"
          color="gray"
        />
        <CustomButton
          onPress={() => {
            setCheckPatient(true);
            setConnectPatient(false);
            setMessage('');
            setErrorMsg('');
          }}
          title="Check Patient"
          color="gray"
        />
      </View>

      {connectPatient && (
        <PopupComp onClose={() => setConnectPatient(false)}>
          <View style={styles.inputOuterContainer}>
            <View style={styles.inputContainer}>
              <Text>patient id: </Text>
              <TextInput
                style={styles.input}
                value={patientId}
                onChangeText={setPatientId}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text>dob: </Text>
              <TextInput
                style={styles.input}
                value={dob}
                onChangeText={setDob}
              />
            </View>
            {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
            {message && <Text style={styles.messageText}>{message}</Text>}
            <CustomButton
              title="Connect"
              onPress={async () => {
                const [success, msg, name] = await utils.parseCheckPatient(
                  route.params.viewer_id.toString(),
                  patientId,
                  dob,
                );
                if (success) {
                  setErrorMsg('');
                  //  setMessage(`successfully connected to patient ${patientId}`);
                  setPatientName(name);
                  setVerifier(true);
                } else {
                  setErrorMsg(msg);
                }
              }}
              color="green"
            />
            {verifier && (
              <PatientConnectVerificationComp
                patient_name={patientName}
                set_verified_status={async val => {
                  if (val) {
                    await utils.ConnectPatient(viewer_id, patientId);
                    setMessage(
                      `successfully connected to patient ${patientName}`,
                    );
                    updatePatientList();
                  } else {
                    setMessage('');
                  }
                  setVerifier(false);
                }}
              />
            )}
          </View>
        </PopupComp>
      )}

      {checkPatient && (
        <PopupComp onClose={() => setCheckPatient(false)}>
          <FlatList
            data={patients}
            keyExtractor={(item: {patient_id: string; username: string}) =>
              item.patient_id
            }
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.patientItem}
                onPress={() =>
                  navigation.navigate('Patient', {
                    status: 'd',
                    viewer_id: viewer_id,
                    patient_id: Number(item.patient_id),
                  })
                }>
                <Text style={styles.patientName}>{item.username}</Text>
              </TouchableOpacity>
            )}
          />
        </PopupComp>
      )}

      <CustomButton
        onPress={() => navigation.goBack()}
        title="Log out"
        color="red"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
  },
  messageText: {
    color: 'green',
  },
  inputOuterContainer: {
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5', // Light gray background for a soft look
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20, // Add spacing between buttons
  },
  popupContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3, // Shadow for Android
  },
  flatListContainer: {
    marginTop: 16,
  },
  patientItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f1f1f1',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default DoctorPage;
