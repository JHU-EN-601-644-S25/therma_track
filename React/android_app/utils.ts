import {API_BASE_URL} from './config_constants';

const handleLogin = async (
  username: string,
  password: string,
): Promise<[boolean, string, {status: string; id: number}]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username, password}),
    });

    const json_data: {message: any; user_type: number; id: number} =
      await response.json();
    console.log(json_data);

    if (json_data.message === null) {
      console.log('login success');
      return [
        true,
        json_data.user_type === 1 ? 'Doctor' : 'Patient',
        {status: 'p', id: json_data.id},
      ];
    } else {
      return [false, 'Login failed: ' + json_data.message, {status: '', id: 0}];
    }
  } catch (error) {
    return [
      false,
      'Log in failed. Error message: ' + error,
      {status: '', id: 0},
    ];
  }
};

const parseConnectPatient = async (
  doctor_id: string,
  patient_id: string,
  dob: string,
): Promise<[boolean, string]> => {
  // Check for valid month, day, year
  try {
    const [year, month, day] = dob.split('-');
    const response = await fetch(`${API_BASE_URL}/doctor/connect_patient`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        doctor_id: doctor_id,
        patient_id: patient_id,
        year: parseInt(year, 10),
        month: parseInt(month, 10),
        day: parseInt(day, 10),
      }),
    });
    const json_data: {message: any} = await response.json();
    return json_data.message === null ? [true, ''] : [false, json_data.message];
  } catch (error) {
    return [false, 'Log in failed. Error message: ' + error];
  }
};

export default {handleLogin, parseConnectPatient};
