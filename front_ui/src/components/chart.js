import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { CDBContainer } from 'cdbreact';
import 'chart.js/auto';

const Chart = () => {
  const [dashboard1Data, setDashboard1Data] = useState({
    lineChartData: {
      labels: [],
      datasets: [
        {
          label: 'Temperature (ºC)',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(194, 116, 161, 0.5)',
          borderColor: 'rgb(194, 116, 161)',
          data: [],
        },
        {
          label: 'Humidity (%)',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgb(75, 192, 192)',
          data: [],
        },
      ],
    },
    barChartData: {
      labels: [],
      datasets: [
        {
          label: 'Temperature (ºC)',
          backgroundColor: 'rgba(194, 116, 161, 0.5)',
          borderColor: 'rgb(194, 116, 161)',
          data: [],
        },
        {
          label: 'Humidity (%)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgb(75, 192, 192)',
          data: [],
        },
      ],
    },
    stats: {
      temperature: { avg: 0, min: 0, max: 0 },
      humidity: { avg: 0, min: 0, max: 0 },
    },
  });

  const [dashboard2Data, setDashboard2Data] = useState({
    lineChartData: {
      labels: [],
      datasets: [
        {
          label: 'Current (A)',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(255, 193, 7, 0.5)',
          borderColor: 'rgb(255, 193, 7)',
          data: [],
        },
        {
          label: 'Voltage (V)',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(0, 123, 255, 0.5)',
          borderColor: 'rgb(0, 123, 255)',
          data: [],
        },
      ],
    },
    barChartData: {
      labels: [],
      datasets: [
        {
          label: 'Current (A)',
          backgroundColor: 'rgba(255, 193, 7, 0.5)',
          borderColor: 'rgb(255, 193, 7)',
          data: [],
        },
        {
          label: 'Voltage (V)',
          backgroundColor: 'rgba(0, 123, 255, 0.5)',
          borderColor: 'rgb(0, 123, 255)',
          data: [],
        },
      ],
    },
    stats: {
      current: { avg: 0, min: 0, max: 0 },
      voltage: { avg: 0, min: 0, max: 0 },
    },
  });

  const [dashboard3Data, setDashboard3Data] = useState({
    lineChartData: {
      labels: [],
      datasets: [
        {
          label: 'Pressure (Pa)',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          data: [],
        },
        {
          label: 'Speed (RPM)',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgb(54, 162, 235)',
          data: [],
        },
      ],
    },
    barChartData: {
      labels: [],
      datasets: [
        {
          label: 'Pressure (Pa)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          data: [],
        },
        {
          label: 'Speed (Pa)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgb(54, 162, 235)',
          data: [],
        },
      ],
    },
    stats: {
      pressure: { avg: 0, min: 0, max: 0 },
      speed: { avg: 0, min: 0, max: 0 },
    },
  });

  const convertTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString();
  };

  const calculateStats = (data) => {
    const avg = data.reduce((acc, val) => acc + val, 0) / data.length;
    const min = Math.min(...data);
    const max = Math.max(...data);
    return { avg, min, max };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/list');
        const results = await response.json();

        const newLabels = results.map(item => convertTimestamp(item.timestamp));
        const newTemperatureData = results.map(item => item.temperature);
        const newHumidityData = results.map(item => item.humidity);
        const newCurrentData = results.map(item => item.current);
        const newVoltageData = results.map(item => item.voltage);
        const newPressureData = results.map(item => item.pressure);
        const newSpeedData = results.map(item => item.speed);

        const temperatureStats = calculateStats(newTemperatureData);
        const humidityStats = calculateStats(newHumidityData);
        const currentStats = calculateStats(newCurrentData);
        const voltageStats = calculateStats(newVoltageData);
        const pressureStats = calculateStats(newPressureData);
        const speedStats = calculateStats(newSpeedData);

        setDashboard1Data(prevData => ({
          ...prevData,
          lineChartData: {
            ...prevData.lineChartData,
            labels: newLabels,
            datasets: [
              {
                ...prevData.lineChartData.datasets[0],
                data: newTemperatureData,
              },
              {
                ...prevData.lineChartData.datasets[1],
                data: newHumidityData,
              },
            ],
          },
          barChartData: {
            ...prevData.barChartData,
            labels: newLabels,
            datasets: [
              {
                ...prevData.barChartData.datasets[0],
                data: newTemperatureData,
              },
              {
                ...prevData.barChartData.datasets[1],
                data: newHumidityData,
              },
            ],
          },
          stats: {
            temperature: temperatureStats,
            humidity: humidityStats,
          },
        }));

        setDashboard2Data(prevData => ({
          ...prevData,
          lineChartData: {
            ...prevData.lineChartData,
            labels: newLabels,
            datasets: [
              {
                ...prevData.lineChartData.datasets[0],
                data: newCurrentData,
              },
              {
                ...prevData.lineChartData.datasets[1],
                data: newVoltageData,
              },
            ],
          },
          barChartData: {
            ...prevData.barChartData,
            labels: newLabels,
            datasets: [
              {
                ...prevData.barChartData.datasets[0],
                data: newCurrentData,
              },
              {
                ...prevData.barChartData.datasets[1],
                data: newVoltageData,
              },
            ],
          },
          stats: {
            current: currentStats,
            voltage: voltageStats,
          },
        }));

        setDashboard3Data(prevData => ({
          ...prevData,
          lineChartData: {
            ...prevData.lineChartData,
            labels: newLabels,
            datasets: [
              {
                ...prevData.lineChartData.datasets[0],
                data: newPressureData,
              },
              {
                ...prevData.lineChartData.datasets[1],
                data: newSpeedData,
              },
            ],
          },
          barChartData: {
            ...prevData.barChartData,
            labels: newLabels,
            datasets: [
              {
                ...prevData.barChartData.datasets[0],
                data: newPressureData,
              },
              {
                ...prevData.barChartData.datasets[1],
                data: newSpeedData,
              },
            ],
          },
          stats: {
            pressure: pressureStats,
            speed: speedStats,
          },
        }));

      } catch (error) {
        console.error('Error fetching the data', error);
      }
    };

    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ flex: 1 }}>
        <CDBContainer>
          <h3 className="mt-5">Dashboard: Temperature and Humidity</h3>
          <div className="chart-container" style={{ height: '400px', overflow: 'auto' }}>
            <Line data={dashboard1Data.lineChartData} options={{ responsive: true }} />
          </div>
          <div className="chart-container" style={{ height: '400px', overflow: 'auto' }}>
            <Bar data={dashboard1Data.barChartData} options={{ responsive: true }} />
          </div>
        </CDBContainer>
      </div>
      <div style={{ flex: 0.5 }}>
        <CDBContainer>
          <h4>Temperature Statistics</h4>
          <table className="stats-table">
            <tbody>
              <tr>
                <td>Average:</td>
                <td>{dashboard1Data.stats.temperature.avg.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Min:</td>
                <td>{dashboard1Data.stats.temperature.min.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Max:</td>
                <td>{dashboard1Data.stats.temperature.max.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          <h4>Humidity Statistics</h4>
          <table className="stats-table">
            <tbody>
              <tr>
                <td>Average:</td>
                <td>{dashboard1Data.stats.humidity.avg.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Min:</td>
                <td>{dashboard1Data.stats.humidity.min.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Max:</td>
                <td>{dashboard1Data.stats.humidity.max.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </CDBContainer>
      </div>
      <div style={{ flex: 1 }}>
        <CDBContainer>
          <h3 className="mt-5">Dashboard: Current and Voltage</h3>
          <div className="chart-container" style={{ height: '400px', overflow: 'auto' }}>
            <Line data={dashboard2Data.lineChartData} options={{ responsive: true }} />
          </div>
          <div className="chart-container" style={{ height: '400px', overflow: 'auto' }}>
            <Bar data={dashboard2Data.barChartData} options={{ responsive: true }} />
          </div>
        </CDBContainer>
      </div>
      <div style={{ flex: 0.5 }}>
        <CDBContainer>
          <h4>Current Statistics</h4>
          <table className="stats-table">
            <tbody>
              <tr>
                <td>Average:</td>
                <td>{dashboard2Data.stats.current.avg.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Min:</td>
                <td>{dashboard2Data.stats.current.min.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Max:</td>
                <td>{dashboard2Data.stats.current.max.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          <h4>Voltage Statistics</h4>
          <table className="stats-table">
            <tbody>
              <tr>
                <td>Average:</td>
                <td>{dashboard2Data.stats.voltage.avg.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Min:</td>
                <td>{dashboard2Data.stats.voltage.min.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Max:</td>
                <td>{dashboard2Data.stats.voltage.max.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </CDBContainer>
      </div>
      <div style={{ flex: 1 }}>
        <CDBContainer>
          <h3 className="mt-5">Dashboard: Pressure and Speed</h3>
          <div className="chart-container" style={{ height: '400px', overflow: 'auto' }}>
            <Line data={dashboard3Data.lineChartData} options={{ responsive: true }} />
          </div>
          <div className="chart-container" style={{ height: '400px', overflow: 'auto' }}>
            <Bar data={dashboard3Data.barChartData} options={{ responsive: true }} />
          </div>
        </CDBContainer>
      </div>
      <div style={{ flex: 0.5 }}>
        <CDBContainer>
          <h4>Pressure Statistics</h4>
          <table className="stats-table">
            <tbody>
              <tr>
                <td>Average:</td>
                <td>{dashboard3Data.stats.pressure.avg.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Min:</td>
                <td>{dashboard3Data.stats.pressure.min.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Max:</td>
                <td>{dashboard3Data.stats.pressure.max.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          <h4>Speed Statistics</h4>
          <table className="stats-table">
            <tbody>
              <tr>
                <td>Average:</td>
                <td>{dashboard3Data.stats.speed.avg.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Min:</td>
                <td>{dashboard3Data.stats.speed.min.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Max:</td>
                <td>{dashboard3Data.stats.speed.max.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </CDBContainer>
      </div>
    </div>
  );
};

export default Chart;