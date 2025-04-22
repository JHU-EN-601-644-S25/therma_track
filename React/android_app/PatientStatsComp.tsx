<<<<<<< HEAD
import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useState, useEffect } from "react";
import { BarChart, LineChart } from "react-native-chart-kit";
import { API_BASE_URL } from "./config_constants";

interface Props {
  patient_id: number;
}

function PatientStatsComp({ patient_id }: Props) {
  const [data, setData] = useState<{ time_logged: Date; temp_data: number }[]>(
    []
  );
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
=======
import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {useState, useEffect} from 'react';
import {BarChart, LineChart} from 'react-native-chart-kit';
import {API_BASE_URL} from './config_constants';

interface Props {
  patient_id: number;
  viewer_id: number;
}

function PatientStatsComp({patient_id, viewer_id}: Props) {
  const [data, setData] = useState<{time_logged: Date; temp_data: number}[]>(
    [],
  );
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2

  useEffect(() => {
    const fetchData = async () => {
      try {
<<<<<<< HEAD
        const res = await fetch(`${API_BASE_URL}/temperature/${patient_id}`);
        const json_data: { timestamp: string; temperature: number }[] =
=======
        const res = await fetch(`${API_BASE_URL}/temperature`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            patient_id: patient_id,
            viewer_id: viewer_id,
          }),
        });
        const json_data: {timestamp: string; temperature: number}[] =
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
          await res.json();

        const formatted_data = json_data
          .sort(
            (
<<<<<<< HEAD
              a: { timestamp: string; temperature: number },
              b: { timestamp: string; temperature: number }
            ) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          )
          .map((entry: { timestamp: string; temperature: number }) => ({
=======
              a: {timestamp: string; temperature: number},
              b: {timestamp: string; temperature: number},
            ) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
          )
          .map((entry: {timestamp: string; temperature: number}) => ({
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
            time_logged: new Date(entry.timestamp),
            temp_data: entry.temperature,
          }));
        const recent_50_data = formatted_data.slice(-50);

        const dates = recent_50_data.map(
<<<<<<< HEAD
          (d: { time_logged: Date }) => d.time_logged
        );

        const min = Math.min(...dates.map((d) => d.getTime()));
        const max = Math.max(...dates.map((d) => d.getTime()));
        //setMinDate(new Date(Math.min(...dates)).toISOString().split('T')[0]);
        //setMaxDate(new Date(Math.max(...dates)).toISOString().split('T')[0]);

        setMinDate(new Date(min).toISOString().split("T")[0]);
        setMaxDate(new Date(max).toISOString().split("T")[0]);
        console.log(recent_50_data);
        setData(recent_50_data);
      } catch (error) {
        console.error("Error fetching data:", error);
=======
          (d: {time_logged: Date}) => d.time_logged,
        );

        const min = Math.min(...dates.map(d => d.getTime()));
        const max = Math.max(...dates.map(d => d.getTime()));
        //setMinDate(new Date(Math.min(...dates)).toISOString().split('T')[0]);
        //setMaxDate(new Date(Math.max(...dates)).toISOString().split('T')[0]);

        setMinDate(new Date(min).toISOString().split('T')[0]);
        setMaxDate(new Date(max).toISOString().split('T')[0]);
        console.log(recent_50_data);
        setData(recent_50_data);
      } catch (error) {
        console.error('Error fetching data:', error);
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
      }
    };
    fetchData();
  }, [patient_id]);

  ////const temp_datas = data.map(
  // (entry: {time_logged: Date; temp_data: number}) => entry.temp_data,
  //);

  // Ensure there is valid data
  //const min_temp: number = temp_datas.length ? Math.min(...temp_datas) - 1 : 30;
  //const max_temp: number = temp_datas.length ? Math.max(...temp_datas) + 1 : 45;

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>
        {data.length === 0
          ? `No data stored currently. Waiting for more data on patient ${patient_id}`
          : `Patient Temperature Over Time: ${minDate} to ${maxDate}`}
      </Text>
      {data.length > 0 && (
        <LineChart
          style={styles.graph}
          data={{
            labels: data.map(
<<<<<<< HEAD
              (item: { time_logged: Date; temp_data: number }, index: number) =>
                index % 10 === 0
                  ? item.time_logged.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""
=======
              (item: {time_logged: Date; temp_data: number}, index: number) =>
                index % 10 === 0
                  ? item.time_logged.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '',
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
            ),
            datasets: [
              {
                data: data.map(
<<<<<<< HEAD
                  (item: { time_logged: Date; temp_data: number }) =>
                    item.temp_data
=======
                  (item: {time_logged: Date; temp_data: number}) =>
                    item.temp_data,
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
                ),
              },
            ],
          }}
<<<<<<< HEAD
          width={Dimensions.get("window").width - 40} // chart width
          height={300}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#f7f7f7",
            backgroundGradientTo: "#fff",
=======
          width={Dimensions.get('window').width - 40} // chart width
          height={300}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#f7f7f7',
            backgroundGradientTo: '#fff',
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
<<<<<<< HEAD
              r: "4",
              strokeWidth: "2",
              stroke: "#ff7300",
=======
              r: '4',
              strokeWidth: '2',
              stroke: '#ff7300',
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
            },
          }}
          bezier
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  graph: {
<<<<<<< HEAD
    alignItems: "center",
=======
    alignItems: 'center',
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
  },
  container: {
    padding: 20,
  },
  titleText: {
    fontSize: 20,
<<<<<<< HEAD
    fontWeight: "bold",
=======
    fontWeight: 'bold',
>>>>>>> 622d976407e07a875787ab88a0eaeaaff501a4f2
    marginBottom: 10,
  },
});

export default PatientStatsComp;
