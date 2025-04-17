import { API_BASE_URL } from "./config_constants";

const handleLoginCheck = async (
  user_id: number,
  user_input: string
): Promise<[boolean, string]> => {
  if (user_input === "") {
    return [false, "Please enter a valid authentication code"];
  }
  try {
    const response = await fetch(`${API_BASE_URL}/login_checker`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user_id,
        input_code: user_input,
      }),
    });

    const json_data = await response.json();
    return [json_data.auth_check, ""];
  } catch (error) {
    alert("Login failed. Please try again.");
    return [false, "Log in failed. Error message: " + error];
  }
};

const handleLogin = async (
  username: string,
  password: string
): Promise<[boolean, string, number, string | null]> => {
  if (username === "" || password === "") {
    return [false, "Please enter a username and password", -1, ""];
  }
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
        json_data.user_type === 1 ? "doctor/" : "patient/p/",
        json_data.id,
        json_data.qr_code,
      ];
    } else return [false, "Login failed: " + json_data.message, -1, ""];
  } catch (error) {
    alert("Login failed. Please try again.");
    return [false, "Log in failed. Error message: " + error, -1, ""];
  }
};

const parseCheckPatient = async (
  doctor_id: string,
  patient_id: string,
  dob: string
): Promise<[boolean, string, string]> => {
  try {
    const [year, month, day] = dob.split("-");

    const response = await fetch(
      `${API_BASE_URL}/doctor/check_connect_patient`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctor_id: doctor_id,
          patient_id: patient_id,
          year: parseInt(year),
          month: parseInt(month),
          day: parseInt(day),
        }),
      }
    );
    const json_data = await response.json();
    return json_data.message === null
      ? [true, "", json_data.patient_name]
      : [false, json_data.message, ""];
  } catch (error) {
    return [false, "Error Message: " + error + ". Please try again later.", ""];
  }
};

const ConnectPatient = async (
  doctor_id: string,
  patient_id: string
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/doctor/connect_patient`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        doctor_id: doctor_id,
        patient_id: patient_id,
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
