import { useState, useEffect } from "react";
import utilsFuncs from "./utils";
import PopupComp from "./PopupComp";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "./config_constants";

function DoctorPage() {
  const { id } = useParams();
  const [connectPatient, setConnectPatient] = useState(false);
  const [checkPatient, setCheckPatient] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [dob, setDob] = useState("");
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const updatePatientList = async () => {
    try {
      const patient_list = await fetch(
        `${API_BASE_URL}/doctor/check_patient/${id}`
      );
      const res = await patient_list.json();
      setPatients(res);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    updatePatientList();
  }, []);

  return (
    <div
      className="fixed-center"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <div>
        <button
          className="spaced"
          onClick={() => {
            setCheckPatient(false);
            setConnectPatient(true);
          }}
        >
          Connect Patient
        </button>
        <button
          className="spaced"
          onClick={() => {
            setConnectPatient(false);
            setCheckPatient(true);
          }}
        >
          Check Patient
        </button>
      </div>
      {connectPatient && (
        <PopupComp
          onClose={() => {
            setConnectPatient(false);
            setMessage("");
            setError("");
            setPatientId("");
          }}
          children={
            <div>
              <div className="spaced">
                <label>patient id : </label>
                <input
                  value={patientId}
                  onChange={(e) => {
                    setPatientId(e.target.value);
                  }}
                />
              </div>
              <div className="spaced">
                <label>dob : </label>
                <input
                  value={dob}
                  placeholder="YYYY-MM-DD"
                  onChange={(e) => {
                    setDob(e.target.value);
                  }}
                />
              </div>
              {error && <p style={{ color: "red" }}>{error}</p>}
              {message && <p style={{ color: "green" }}>{message}</p>}
              <button
                className="spaced"
                onClick={async () => {
                  const [result, errorMsg] =
                    await utilsFuncs.parseConnectPatient(
                      id ? id : "",
                      patientId,
                      dob
                    );
                  if (!result) setError(errorMsg);
                  else {
                    setMessage(
                      `successfully connected to patient ${patientId}`
                    );
                    updatePatientList();
                  }
                }}
              >
                Connect
              </button>
            </div>
          }
        />
      )}
      {checkPatient && (
        <PopupComp
          onClose={() => setCheckPatient(false)}
          children={
            <ul className="space-y-2">
              {patients.map(
                (patient: { patient_id: number; username: string }) => (
                  <li
                    key={patient.patient_id}
                    className="p-3 border rounded-lg bg-gray-100"
                  >
                    <button
                      className="font-semibold"
                      onClick={() => {
                        navigate(`/patient/d${id}/${patient.patient_id}`);
                      }}
                    >
                      {patient.username}
                    </button>
                  </li>
                )
              )}
            </ul>
          }
        />
      )}
      <button className="spaced" onClick={() => navigate("/")}>
        Log out
      </button>
    </div>
  );
}

export default DoctorPage;
