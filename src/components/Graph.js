import React, { useState, useEffect } from 'react';
import './Graph.css';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {Chart, CategoryScale} from 'chart.js/auto'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'; 


const Graph = ({ chartData, chartType, scaleLevel, chartTitle, chartColor, mqttTopic, className }) => {
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
    let [scale, setScale] = useState(5);
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
    
    const handleScaleChange = (event) => {
        setScale(event.target.value);
    }
    const handleOperationChange = (event) => {
      setOperation(event.target.value);
    }
    const handleCheckboxChange = () => {
      setIncludeOutliers(!includeOutliers);
    }
    const convertArrayOfObjectsToCSV = (array) => {
      let result;
  
      const columnDelimiter = ',';
      const lineDelimiter = '\n';
      const keys = Object.keys(array[0]);
  
      result = '';
      result += keys.join(columnDelimiter);
      result += lineDelimiter;
  
      array.forEach(item => {
          let ctr = 0;
          keys.forEach(key => {
              if (ctr > 0) result += columnDelimiter;
  
              result += item[key];
  
              ctr++;
          });
          result += lineDelimiter;
      });
  
      return result;
    }
    const downloadCSV = (array) => {
      const link = document.createElement('a');
      let csv = convertArrayOfObjectsToCSV(array);
      if (csv == null) return;
  
      const blob = new Blob([csv]);
      const url = window.URL.createObjectURL(blob);
  
      link.setAttribute('href', url);
      link.setAttribute('download', 'export.csv');
      link.style.visibility = 'hidden';
  
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    const handleDownload = () => {
      const data = fetchedData.datasets[0].data.map((value, index) => ({
        label: fetchedData.labels[index],
        value
      }));
      downloadCSV(data);
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
        console.log(mqttTopic);
          axios.get("https://connect.weiss.land/api/data", {
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
              // Parse and filter the dates
              const labels = dates.map(date => {
                // Parse the date string into a Date object
                const parsedDate = new Date(date);

                // Get the hour from the Date object
                const hour = parsedDate.getUTCHours(); // Use getUTCHours to account for the "Z" timezone
                const timeString = parsedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', day: '2-digit' });

                // Return the time string if the hour is 0 (12 AM), 4, 8, etc. Otherwise, return an empty string.
                if (hour % 2 === 0) {
                  return timeString;
                }
                else {
                  return "";
                }
                
            });
              console.log(labels);
              console.log("Setting fetched data");
              setFetchedData({
                  labels: labels,
                  datasets: [
                      {
                          // label: mqttTopic,
                          label: mqttTopic === 'co2' ? "CO2 (ppm)" : mqttTopic === 'temp' ? "Temperature (C°)" : mqttTopic === 'hum' ? "Humidity (%)" : mqttTopic === 'light' ? "Light (lux)" : undefined,
                          data: values,
                          backgroundColor: '#0c7021',
                          borderColor: '#0c7021',
                          borderWidth: 1,
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
        maintainAspectRatio: true,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: chartColor === null ? 'black' : undefined,
            },
            ticks: {
              color: chartColor === null ? 'black' : undefined,
            },
            // check for 'co2' topic and set bounds accordingly
            min: mqttTopic === 'co2' || mqttTopic === 'temp' ? 0 : mqttTopic === 'hum' ? 0 : mqttTopic === 'light' ? 0 : undefined,
            max: mqttTopic === 'co2' ? 1500 : mqttTopic === 'temp' ? 40 : mqttTopic === 'hum' ? 100 : mqttTopic === 'light' ? 30000 : undefined,
          },
          x: {
            display: className === null ? false : true,
            grid: {
                color: chartColor === null ? 'black' : undefined,
              },
              ticks: {
                color: chartColor === null ? 'black' : undefined,
                stepSize: 1,
              },
          },
        },
        plugins: {
          title: {
            display: false,
            text: chartTitle,
            color: chartColor === null ? 'black' : undefined,
          },
          legend: {
            labels: {
              color: chartColor === null ? 'black' : undefined,
            },
          },
        },
      };
//<ChartComponent className='chart__graph' data={fetchedData} options={options} />
      return (
        <div className="chart__item">
            <ChartComponent className='chart__graph' data={fetchedData} options={options} />
            <div className='scale__section'>
              Select Scale
              <select className="chart__scale" value={scale} onChange={handleScaleChange}>
                  <option value={1}>1/5</option>
                  <option value={2}>2/5</option>
                  <option value={3}>3/5</option>
                  <option value={4}>4/5</option>
                  <option value={5}>5/5</option>
              </select>
            </div>
            <select className="chart__operation" value={operation} onChange={handleOperationChange}>
                <option value={1}>Mean</option>
                <option value={2}>Median</option>
                <option value={3}>Mode</option>
                <option value={4}>Max</option>
                <option value={5}>Min</option>
            </select>
            <div className="chart__operation-value">
              {operationValue}
            </div>
            <label className='outlier__label'>
              Include Outliers
                <input
                    className='outlier__box'
                    type="checkbox"
                    checked={includeOutliers}
                    onChange={handleCheckboxChange}
                />
            </label>
            <button className='download__button' onClick={handleDownload}>
              <FontAwesomeIcon icon={faDownload} />
            </button>
        </div>
    );
      // if (!fetchedData) {
      //   return <p>Loading...</p>
      // } else {
        
      // }
};

Chart.register(CategoryScale);

export default Graph;