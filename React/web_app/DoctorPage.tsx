<<<<<<< HEAD
import { useState, useEffect } from "react";
=======
import { useState, useEffect, useRef } from "react";
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
import utilsFuncs from "./utils";
import PopupComp from "./PopupComp";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "./config_constants";
import PatientConnectVerificationComp from "./PatientConnectVerificationComp";

function DoctorPage() {
  const { id } = useParams();
  const [connectPatient, setConnectPatient] = useState(false);
  const [checkPatient, setCheckPatient] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [dob, setDob] = useState("");
  const [patients, setPatients] = useState([]);
  const [verifier, setVerifier] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
<<<<<<< HEAD
  
  console.log("DoctorPage loaded, id =", id);

=======
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const logoutAfterInactivity = () => {
      timerRef.current = setTimeout(() => {
        alert("Session timed out due to inactivity");
        navigate("/");
      }, 1 * 60 * 1000);
    };

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      logoutAfterInactivity();
    };

    const events = ["mousemove", "keydown", "click"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    logoutAfterInactivity();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, []);
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2

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

<<<<<<< HEAD
  const handleViewLogs = () => {
    console.log("View Logs clicked");
    navigate("/logs", { state: { doctorId: id } });
  };


=======
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
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
<<<<<<< HEAD
        
        <button
          className="spaced"
          onClick={handleViewLogs}>View Logs
        </button>
        

=======
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
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
              {!verifier && message && (
                <p style={{ color: "green" }}>{message}</p>
              )}
              <button
                className="spaced"
                onClick={async () => {
                  const [result, errorMsg, name] =
                    await utilsFuncs.parseCheckPatient(
                      id ? id : "",
                      patientId,
                      dob
                    );
                  if (!result) setError(errorMsg);
                  else {
                    setError("");
                    setMessage(
                      `successfully connected to patient ${patientId}`
                    );
                    setPatientName(name);
                    setVerifier(true);
                  }
                }}
              >
                Connect
              </button>
              {verifier && (
                <div>
                  <PatientConnectVerificationComp
                    patient_name={patientName}
                    set_verified_status={async (val) => {
                      if (val) {
                        await utilsFuncs.ConnectPatient(
                          id ? id : "",
                          patientId
                        );
                        updatePatientList();
                      } else {
                        setMessage("");
                      }
                      setVerifier(false);
                    }}
                  />
                </div>
              )}
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
