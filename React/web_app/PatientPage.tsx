import PatientStatsComp from "./PatientStatsComp";
import { useParams, useNavigate } from "react-router-dom";

function PatientPage() {
  const { status, id } = useParams();
  const navigate = useNavigate();
  return (
    <div
      className="fixed-center"
      style={{ display: "flex", flexDirection: "column" }}
    >
      {id && <PatientStatsComp patient_id={id} />}
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
