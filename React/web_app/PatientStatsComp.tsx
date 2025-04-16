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
}

function PatientStatsComp({ patient_id }: Props) {
  const [data, setData] = useState([]);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const temp_data = await fetch(
          `${API_BASE_URL}/temperature/${patient_id}`
        );
        const formatted_data = await temp_data.json();
        const sorted_data = formatted_data
          .sort(
            (
              a: { time_logged: string; temp_data: number },
              b: { time_logged: string; temp_data: number }
            ) =>
              new Date(a.time_logged).getTime() -
              new Date(b.time_logged).getTime()
          )
          .map((entry: { time_logged: string; temp_data: number }) => ({
            time_logged: new Date(entry.time_logged),
            temp_data: entry.temp_data,
          }));
        const recent_50_data = sorted_data.slice(-50);
        const dates = recent_50_data.map(
          (d: { time_logged: Date }) => d.time_logged
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
    (entry: { time_logged: Date; temp_data: number }) => entry.temp_data
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
              dataKey="time_logged"
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
              dataKey="temp_data"
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
