import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {useState, useEffect} from 'react';
import {BarChart, LineChart} from 'react-native-chart-kit';
import {API_BASE_URL} from './config_constants';

interface Props {
  patient_id: number;
}

function PatientStatsComp({patient_id}: Props) {
  const [data, setData] = useState([]);
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/temperature/${patient_id}`);
        const json_data: {timestamp: string; temperature: number}[] =
          await res.json();

        const formatted_data = json_data
          .sort(
            (
              a: {timestamp: string; temperature: number},
              b: {timestamp: string; temperature: number},
            ) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
          )
          .map((entry: {timestamp: string; temperature: number}) => ({
            time_logged: new Date(entry.timestamp),
            temp_data: entry.temperature,
          }));
        const recent_50_data = formatted_data.slice(-50);

        const dates = recent_50_data.map(
          (d: {time_logged: Date}) => d.time_logged,
        );
        setMinDate(new Date(Math.min(...dates)).toISOString().split('T')[0]);
        setMaxDate(new Date(Math.max(...dates)).toISOString().split('T')[0]);
        console.log(recent_50_data);
        setData(recent_50_data);
      } catch (error) {
        console.error('Error fetching data:', error);
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
              (item: {time_logged: Date; temp_data: number}, index: number) =>
                index % 10 === 0
                  ? item.time_logged.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '',
            ),
            datasets: [
              {
                data: data.map(
                  (item: {time_logged: Date; temp_data: number}) =>
                    item.temp_data,
                ),
              },
            ],
          }}
          width={Dimensions.get('window').width - 40} // chart width
          height={300}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#f7f7f7',
            backgroundGradientTo: '#fff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#ff7300',
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
    alignItems: 'center',
  },
  container: {
    padding: 20,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default PatientStatsComp;
