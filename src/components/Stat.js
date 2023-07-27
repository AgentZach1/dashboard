import React, { useState, useEffect } from 'react';
import './Graph.css';
import axios from 'axios';

const Stat = ({mqttTopic}) => {

    let [statState, setStatState] = useState(0);
    let [text, setText] = useState("<Value/>");

    useEffect(() => {
        const fetchData = () => {
            if (mqttTopic) {
                axios.get("/api/data", {
                    params: {
                        topic: mqttTopic
                    }
                }).then(response => {
                    let fetchedData = response.data;
                    const values = fetchedData.map(item => item.value);
      
                    console.log("Setting fetched data");
                    setStatState(values[values.length - 1]);
                    setText(mqttTopic === 'co2' ? "CO2 (ppm)" : mqttTopic === 'temp' ? "Temperature (C°)" : mqttTopic === 'hum' ? "Humidity (%)" : mqttTopic === 'light' ? "Light (lux)" : "<Value/>",)
                }).catch(error => {
                    console.error('Error fetching data: ', error);
                });
            }
          };
            fetchData();
            const intervalId = setInterval(fetchData, 45000); 
            // runs every 45 seconds or half the delay for the sensor to update
      
            return () => clearInterval(intervalId); // cleans up the interval on unmount
    }, [mqttTopic]);
    
    return (
        <div className='stat_box'>
            {statState}
            <br></br>
            {text}
        </div>
    );
};

export default Stat;