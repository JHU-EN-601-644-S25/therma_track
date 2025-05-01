import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "./config_constants";

interface Props {
  patient_id: string;
  viewer_id: string;
}

function PatientStatsComp({ patient_id, viewer_id }: Props) {
  const [data, setData] = useState([]);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const temperature = await fetch(`${API_BASE_URL}/temperature`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patient_id: patient_id,
            viewer_id: viewer_id,
          }),
        });
        console.log(typeof patient_id, typeof viewer_id)

        const formatted_data = await temperature.json();
        console.log(formatted_data);
        if (!Array.isArray(formatted_data)) {
          console.error("Expected array but got:", formatted_data);
          return;
        }
        const sorted_data = formatted_data
          .sort(
            (
              a: { timestamp: string; temperature: number },
              b: { timestamp: string; temperature: number }
            ) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          )
          .map((entry: { timestamp: string; temperature: number }) => ({
            timestamp: new Date(entry.timestamp),
            temperature: entry.temperature,
          }));
        const recent_50_data = sorted_data.slice(-50);
        const dates = recent_50_data.map(
          (d: { timestamp: Date }) => d.timestamp
        );
        setMinDate(new Date(Math.min(...dates)).toISOString().split("T")[0]);
        setMaxDate(new Date(Math.max(...dates)).toISOString().split("T")[0]);

        setData(recent_50_data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [patient_id]);

  const temp_datas = data.map(
    (entry: { timestamp: Date; temperature: number }) => entry.temperature
  );

  // Ensure there is valid data
  const min_temp: number = temp_datas.length ? Math.min(...temp_datas) - 1 : 30;
  const max_temp: number = temp_datas.length ? Math.max(...temp_datas) + 1 : 45;

  return (
    <div>
      <h2>
        {data.length === 0
          ? "No data stored currently. Waiting for more data"
          : `Patient Temperature Over Time: ${minDate} to ${maxDate}`}
      </h2>
      {data.length > 0 && (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) =>
                value.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }
              tick={{ fontSize: 12 }}
              interval={10}
            />
            <YAxis
              domain={[min_temp, max_temp]}
              label={{ value: "°C", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#ff7300"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default PatientStatsComp;
