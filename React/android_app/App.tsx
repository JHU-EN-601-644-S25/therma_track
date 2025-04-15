import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginPage from './LoginPage';
import PatientPage from './PatientPage';
import DoctorPage from './DoctorPage';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Patient" component={PatientPage} />
        <Stack.Screen name="Doctor" component={DoctorPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
