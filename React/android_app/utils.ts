<<<<<<< HEAD
import { API_BASE_URL } from "./config_constants";

const handleLogin = async (
  username: string,
  password: string
): Promise<[boolean, string, { status: string; id: number }]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const json_data: { message: any; user_type: number; id: number } =
      await response.json();
    console.log(json_data);

    if (json_data.message === null) {
      console.log("login success");
      return [
        true,
        json_data.user_type === 1 ? "Doctor" : "Patient",
        {
          status: json_data.user_type === 1 ? "d" : "p",
          id: json_data.id,
        },
      ];
    } else {
      return [
        false,
        "Login failed: " + json_data.message,
        { status: "", id: 0 },
      ];
    }
  } catch (error) {
    return [
      false,
      "Log in failed. Error message: " + error,
      { status: "", id: 0 },
=======
import {API_BASE_URL} from './config_constants';

const handleLoginCheck = async (
  user_id: number,
  user_input: string,
): Promise<[boolean, string]> => {
  if (user_input === '') {
    return [false, 'Please enter a valid authentication code'];
  }
  try {
    const response = await fetch(`${API_BASE_URL}/login_checker`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user_id,
        input_code: user_input,
      }),
    });

    const json_data = await response.json();
    return [json_data.auth_check, ''];
  } catch (error) {
    return [false, 'Log in failed. Error message: ' + error];
  }
};

const handleLogin = async (
  username: string,
  password: string,
): Promise<[boolean, string, {status: string; id: number}, string | null]> => {
  if (username === '' || password === '') {
    return [
      false,
      'Please enter a username and password',
      {
        status: '',
        id: -1,
      },
      '',
    ];
  }
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const json_data = await response.json();
    console.log(json_data);

    if (json_data.message === null) {
      return [
        true,
        json_data.user_type === 1 ? 'Doctor' : 'Patient',
        {
          status: json_data.user_type === 1 ? 'd' : 'p',
          id: json_data.id,
        },
        json_data.qr_code,
      ];
    } else
      return [
        false,
        'Login failed: ' + json_data.message,
        {status: '', id: -1},
        '',
      ];
  } catch (error) {
    //  alert('Login failed. Please try again.');
    return [
      false,
      'Log in failed. Error message: ' + error,
      {status: '', id: -1},
      '',
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
    ];
  }
};

<<<<<<< HEAD
const parseConnectPatient = async (
  doctor_id: string,
  patient_id: string,
  dob: string
): Promise<[boolean, string]> => {
  // Check for valid month, day, year
  try {
    const [year, month, day] = dob.split("-");
    const response = await fetch(`${API_BASE_URL}/doctor/connect_patient`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
=======
const parseCheckPatient = async (
  doctor_id: string,
  patient_id: string,
  dob: string,
): Promise<[boolean, string, string]> => {
  try {
    const [year, month, day] = dob.split('-');

    const response = await fetch(
      `${API_BASE_URL}/doctor/check_connect_patient`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctor_id: doctor_id,
          patient_id: patient_id,
          year: parseInt(year),
          month: parseInt(month),
          day: parseInt(day),
        }),
      },
    );
    const json_data = await response.json();
    return json_data.message === null
      ? [true, '', json_data.patient_name]
      : [false, json_data.message, ''];
  } catch (error) {
    return [false, 'Error Message: ' + error + '. Please try again later.', ''];
  }
};

const ConnectPatient = async (
  doctor_id: string,
  patient_id: string,
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/doctor/connect_patient`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
      },
      body: JSON.stringify({
        doctor_id: doctor_id,
        patient_id: patient_id,
<<<<<<< HEAD
        year: parseInt(year, 10),
        month: parseInt(month, 10),
        day: parseInt(day, 10),
      }),
    });
    const json_data: { message: any } = await response.json();
    return json_data.message === null ? [true, ""] : [false, json_data.message];
  } catch (error) {
    return [false, "Log in failed. Error message: " + error];
  }
};

export default { handleLogin, parseConnectPatient };
=======
      }),
    });
    const json_data = await response.json();
    return json_data.message === null ? true : false;
  } catch (error) {
    return false;
  }
};

export default {
  handleLogin,
  handleLoginCheck,
  parseCheckPatient,
  ConnectPatient,
};
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
