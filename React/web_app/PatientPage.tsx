import { useRef, useEffect } from "react";
import PatientStatsComp from "./PatientStatsComp";
import { useParams, useNavigate } from "react-router-dom";

function PatientPage() {
  const { status, id } = useParams();
  const navigate = useNavigate();

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

  return (
    <div
      className="fixed-center"
      style={{ display: "flex", flexDirection: "column" }}
    >
      {id && (
        <PatientStatsComp
          patient_id={id}
          viewer_id={status.charAt(0) === "p" ? id : status.substring(1)}
        />
      )}
      {status &&
        (status.charAt(0) === "p" ? (
          <button className="spaced" onClick={() => navigate("/")}>
            Log out
          </button>
        ) : (
          <button
            className="spaced"
            onClick={() => navigate(`/doctor/${status.substring(1)}`)}
          >
            Return
          </button>
        ))}
    </div>
  );
}

export default PatientPage;
