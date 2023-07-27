import React, { useState, useEffect } from 'react';
import './Graph.css';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {Chart, CategoryScale} from 'chart.js/auto'; 
import axios from 'axios';

const Graph = ({ chartData, chartType, scaleLevel, chartTitle, chartColor, mqttTopic }) => {
    let ChartComponent;
    let chartCheck;
    if (chartData == null) {
      let randomNumbersGraph = Array.from({length: 1000}, () => Math.floor(Math.random() * 1001) + 200);
      let timeLabelArray = Array.from({length: 1000}, () => 0);

      chartCheck = {
        labels: timeLabelArray,
        datasets: [
            {
                label: 'Default Graph (def)',
                data: randomNumbersGraph,
                backgroundColor: [
                    'white'
                ],
                borderColor: [
                    'black'
                ],
                borderWidth: 1,
                color: 'black'
            }
          ]
      };
    }
    else {
      chartCheck = chartData;
    }

    // States
    let [scale, setScale] = useState(1);
    let [fetchedData, setFetchedData] = useState(chartCheck);
    let [operation, setOperation] = useState("1");
    let [operationValue, setOperationValue] = useState("");
    let [includeOutliers, setIncludeOutliers] = useState(false); // New state

    switch (chartType) {
        case 'bar':
            ChartComponent = Bar;
            break;
        case 'line':
            ChartComponent = Line;
            break;
        case 'pie':
            ChartComponent = Pie;
            break;
        default:
            ChartComponent = Line;
    }

    if (scaleLevel <= 0 || scaleLevel > 5) {
        scale = 1;
    }
    
    const handleScaleChange = (event) => {
        setScale(event.target.value);
    }

    const handleOperationChange = (event) => {
      setOperation(event.target.value);
    }

    // Handle checkbox change
    const handleCheckboxChange = () => {
      setIncludeOutliers(!includeOutliers);
    }
    
    const getQ1 = (array) => {
      const mid = Math.floor(array.length / 4);
      const nums = [...array].sort((a, b) => a - b);
      return array.length % 4 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
    };
    
    const getQ3 = (array) => {
      const mid = Math.floor(3 * array.length / 4);
      const nums = [...array].sort((a, b) => a - b);
      return array.length % 4 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
    };
    
    const removeOutliers = (array) => {
      const Q1 = getQ1(array);
      const Q3 = getQ3(array);
      const IQR = Q3 - Q1;
      const lowerRange = Q1 - 1.5 * IQR;
      const upperRange = Q3 + 1.5 * IQR;
      return array.filter((x) => (x >= lowerRange) && (x <= upperRange));
    };
    
    const mean = array => {
      const numbers = includeOutliers ? array : removeOutliers(array);
      return numbers.reduce((a, b) => a + b) / numbers.length;
    };
    
    const median = array => {
      const numbers = includeOutliers ? array : removeOutliers(array);
      const mid = Math.floor(numbers.length / 2);
      const nums = [...numbers].sort((a, b) => a - b);
      return numbers.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
    };
    
    const mode = array => {
      const numbers = includeOutliers ? array : removeOutliers(array);
      return Object.entries(
        numbers.reduce(
          (counts, value) => ({ ...counts, [value]: (counts[value] || 0) + 1 }),
          {}
        )
      ).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
    };
    
    const max = array => {
      const numbers = includeOutliers ? array : removeOutliers(array);
      return Math.max(...numbers);
    };
    
    const min = array => {
      const numbers = includeOutliers ? array : removeOutliers(array);
      return Math.min(...numbers);
    };

    // IF MQTT topic is set then check the associated database value
    // Set the graph's "data" to the specific type and time_stamp or date
    useEffect(() => {
      const fetchData = () => {
      if (mqttTopic) {
          axios.get("/api/data", {
              params: {
                  topic: mqttTopic
              }
          }).then(response => {
              // console.log(response.data);
              let fetchedData = response.data;

              // Calculate the amount of data to be displayed based on the scale
              let sliceAmount = Math.ceil(fetchedData.length * (scale / 5));

              // Slice the data according to the calculated amount
              fetchedData = fetchedData.slice(-sliceAmount);

              const dates = fetchedData.map(item => item.date);
              const values = fetchedData.map(item => item.value);

              // Calculate the selected operation
              switch (operation) {
                case "1":
                  setOperationValue(`Mean: ${mean(values).toFixed(2)}`);
                  break;
                case "2":
                  setOperationValue(`Median: ${median(values).toFixed(2)}`);
                  break;
                case "3":
                  setOperationValue(`Mode: ${mode(values)}`);
                  break;
                case "4":
                  setOperationValue(`Max: ${max(values)}`);
                  break;
                case "5":
                  setOperationValue(`Min: ${min(values)}`);
                  break;
                default:
                  setOperationValue("");
              }

              console.log("Setting fetched data");
              setFetchedData({
                  labels: dates,
                  datasets: [
                      {
                          // label: mqttTopic,
                          label: mqttTopic === 'co2' ? "CO2 (ppm)" : mqttTopic === 'temp' ? "Temperature (C°)" : mqttTopic === 'hum' ? "Humidity (%)" : mqttTopic === 'light' ? "Light (lux)" : undefined,
                          data: values,
                      }
                  ]
              });
          }).catch(error => {
              console.error('Error fetching data: ', error);
          });
      }
    };
      fetchData();
      const intervalId = setInterval(fetchData, 45000); 
      // runs every 45 seconds or half the delay for the sensor to update

      return () => clearInterval(intervalId); // cleans up the interval on unmount
    }, [mqttTopic, scale, operation, includeOutliers]);

    const options = {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: chartColor,
            },
            ticks: {
              color: chartColor,
            },
            // check for 'co2' topic and set bounds accordingly
            min: mqttTopic === 'co2' || mqttTopic === 'temp' ? 0 : mqttTopic === 'hum' ? 0 : mqttTopic === 'light' ? 0 : undefined,
            max: mqttTopic === 'co2' ? 1200 : mqttTopic === 'temp' ? 40 : mqttTopic === 'hum' ? 100 : mqttTopic === 'light' ? 30000 : undefined,
          },
          x: {
            display: false,
            grid: {
                color: chartColor,
              },
              ticks: {
                color: chartColor,
              },
          },
        },
        plugins: {
          title: {
            display: false,
            text: chartTitle,
            color: chartColor,
          },
          legend: {
            labels: {
              color: chartColor,
            },
          },
        },
      };

    return (
        <div className="chart__item">
            <ChartComponent data={fetchedData} options={options} />
            Select Scale
            <select className="chart__scale" value={scale} onChange={handleScaleChange}>
                <option value={1}>1/5</option>
                <option value={2}>2/5</option>
                <option value={3}>3/5</option>
                <option value={4}>4/5</option>
                <option value={5}>5/5</option>
            </select>
            <select className="chart__scale" value={operation} onChange={handleOperationChange}>
                <option value={1}>Mean</option>
                <option value={2}>Median</option>
                <option value={3}>Mode</option>
                <option value={4}>Max</option>
                <option value={5}>Min</option>
            </select>
            <div className="chart__operation-value">
              {operationValue}
            </div>
            <label>
                <input
                    type="checkbox"
                    checked={includeOutliers}
                    onChange={handleCheckboxChange}
                />
                Include Outliers
            </label>
        </div>
    );
};

Chart.register(CategoryScale);

export default Graph;