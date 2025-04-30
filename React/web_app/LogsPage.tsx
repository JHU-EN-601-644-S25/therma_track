import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { API_BASE_URL } from "./config_constants";

interface LogEntry {
    log_id: number;
    user_id: number | null;
    action: string;
    status: string;
    timestamp: string;
    details: string;
}



function LogsPage() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [page, setPage] = useState(1);
    //const { id: doctorId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const doctorId = location.state?.doctorId;
    console.log("LogsPage mounted");

    
    useEffect(() => {
        const fetchLogs = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/logs?page=${page}&limit=50`);
            const data = await res.json();
            setLogs(data);
        } catch (err) {
            console.error("Failed to fetch logs", err);
        }
        };
        fetchLogs();
    }, [page]);

    const handleDownloadLogs = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/logs/download`);
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "audit_logs.csv";
          a.click();
          window.URL.revokeObjectURL(url);
        } catch (err) {
          console.error("Failed to download logs:", err);
        }
      };

    return (
        <div style={{ padding: "40px 24px" }}>
            <h2 style={{ marginBottom: "20px" }}>Audit Logs (Page {page})</h2>

            <div style={{ overflowY: "auto", maxHeight: "70vh", border: "1px solid #ccc", borderRadius: "8px" }}>
                <table style={{ borderCollapse: "collapse", width: "100%", fontSize: "14px" }}>
                    <thead>
                        <tr>
                          <th style={thStyle}>Log ID</th>
                          <th style={thStyle}>User ID</th>
                          <th style={thStyle}>Action</th>
                          <th style={thStyle}>Status</th>
                          <th style={thStyle}>Timestamp</th>
                          <th style={thStyle}>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log.log_id}>
                                <td style={tdStyle}>{log.log_id}</td>
                                <td style={tdStyle}>{log.user_id ?? "N/A"}</td>
                                <td style={tdStyle}>{log.action}</td>
                                <td style={tdStyle}>{log.status}</td>
                                <td style={tdStyle}>{new Date(log.timestamp).toLocaleString()}</td>
                                <td style={tdStyle}>{log.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: "1rem", display: "flex", gap: "10px" }}>
                <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
                <button onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
            <button
                style={{ marginTop: "20px" }}
                onClick={() => navigate(`/doctor/${doctorId}`)}
                >
                Back to Doctor Page
            </button>
            <button
                style={{ marginTop: "1rem" }}
                onClick={handleDownloadLogs}
                >
                Download Audit Logs (CSV)
            </button>
        </div>
    );
}
const thStyle = {
    border: "1px solid #ccc",
    padding: "8px",
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
};
  
const tdStyle = {
    border: "1px solid #ddd",
    padding: "8px",
};
  

export default LogsPage;