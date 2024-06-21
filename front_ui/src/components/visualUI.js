import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { CDBContainer } from 'cdbreact';
import 'chart.js/auto';

const Chart = () => {
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Pressure (Pa)',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(194, 116, 222, 0.5)',
        borderColor: 'rgb(194, 116, 222)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(71, 88, 167, 0.5)',
        pointHoverBorderColor: 'rgb(71, 88, 167)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [],
      },
      {
        label: 'Speed (m/s)',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75, 192, 192, 0.5)',
        pointHoverBorderColor: 'rgb(75, 192, 192)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [],
      }
    ],
  });

  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Temperature (°C)',
        backgroundColor: 'rgba(194, 116, 161, 0.5)',
        borderColor: 'rgb(194, 116, 161)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(71, 225, 167, 0.5)',
        hoverBorderColor: 'rgb(71, 225, 167)',
        data: [],
      },
      {
        label: 'Humidity (%)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75, 192, 192, 0.5)',
        hoverBorderColor: 'rgb(75, 192, 192)',
        data: [],
      }
    ]
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const convertTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/list');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const results = await response.json();

        const newLabels = results.map(item => convertTimestamp(item.timestamp));
        const newTemperatureData = results.map(item => item.temperature);
        const newHumidityData = results.map(item => item.humidity);
        const newPressureData = results.map(item => item.pressure);
        const newSpeedData = results.map(item => item.speed);
        
        setLineChartData(prevData => ({
          ...prevData,
          labels: newLabels,
          datasets: [
            {
              ...prevData.datasets[0],
              data: newPressureData,
            },
            {
              ...prevData.datasets[1],
              data: newSpeedData,
            },
          ],
        }));

        setBarChartData(prevData => ({
          ...prevData,
          labels: newLabels,
          datasets: [
            {
              ...prevData.datasets[0],
              data: newTemperatureData,
            },
            {
              ...prevData.datasets[1],
              data: newHumidityData,
            },
          ],
        }));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching the data', error);
        setError(error.message);
        setLoading(false);
      }
    };

    const interval = setInterval(fetchData, 5000);

    fetchData();

    return () => clearInterval(interval);
  }, []);

  return (
    <CDBContainer>
      <h3>Leituras recebidas</h3>
      {loading && <p>Loading data...</p>}
      {error && <p>Error fetching data: {error}</p>}
      {!loading && !error && (
        <>
          <div className="chart-container" style={{ height: '200px', overflow: 'auto' }}>
            <Line 
              data={lineChartData} 
              options={{ 
                responsive: true,
                scales: {
                  y: {
                    ticks: {
                      callback: function(value) {
                        return value + ' Pa';
                      }
                    }
                  }
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function(tooltipItem) {
                        return tooltipItem.dataset.label + ': ' + tooltipItem.raw + ' Pa'; // Adjust unit for pressure
                      }
                    }
                  }
                }
              }} 
            />
          </div>
          <div className="chart-container" style={{ height: '200px', overflow: 'auto' }}>
            <Bar 
              data={barChartData} 
              options={{ 
                responsive: true,
                scales: {
                  y: {
                    ticks: {
                      callback: function(value) {
                        return value + ' °C'; // Adjust unit for temperature
                      }
                    }
                  }
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function(tooltipItem) {
                        const datasetLabel = tooltipItem.dataset.label;
                        const value = tooltipItem.raw;
                        if (datasetLabel === 'Temperature') {
                          return datasetLabel + ': ' + value + ' °C'; // Adjust unit for temperature
                        } else if (datasetLabel === 'Humidity') {
                          return datasetLabel + ': ' + value + ' %'; // Adjust unit for humidity
                        }
                        return datasetLabel + ': ' + value;
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </>
      )}
    </CDBContainer>
  );
};

export default Chart;