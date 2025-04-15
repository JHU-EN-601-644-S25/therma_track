import { API_BASE_URL } from "./config_constants";

const handleLogin = async (
  username: string,
  password: string
): Promise<[boolean, string]> => {
  if (username === "" || password === "") {
    return [false, "Please enter a username and password"];
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

    if (json_data.message === null) {
      return [
        true,
        (json_data.user_type === 1 ? "doctor/" : "patient/p/") + json_data.id,
      ];
    } else return [false, "Login failed: " + json_data.message];
  } catch (error) {
    alert("Login failed. Please try again.");
    return [false, "Log in failed. Error message: " + error];
  }
};

const parseConnectPatient = async (
  doctor_id: string,
  patient_id: string,
  dob: string
): Promise<[boolean, string]> => {
  try {
    const [year, month, day] = dob.split("-");

    const response = await fetch(`${API_BASE_URL}/doctor/connect_patient`, {
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
    });
    const json_data = await response.json();
    return json_data.message === null ? [true, ""] : [false, json_data.message];
  } catch (error) {
    return [false, "Error Message: " + error + ". Please try again later."];
  }
};

export default { handleLogin, parseConnectPatient };
