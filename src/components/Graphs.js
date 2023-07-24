import React, { useState, useEffect } from 'react';
import Graph from './Graph';
import './Graph.css';
// import mqtt from 'mqtt/dist/mqtt';
// import Paho from 'paho-mqtt';

const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
        {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }
    ]
};

let randomNumbersCO2 = Array.from({length: 1000}, () => Math.floor(Math.random() * 1001) + 200);
let timeBack = 1;

let timeLabelTimes = 7;
let timeCount = timeBack * timeLabelTimes;

let timeLabelArray = Array.from({length: timeBack * timeLabelTimes}, () => timeCount--);

const CO2_data = {
    labels: timeLabelArray,
    datasets: [
        {
            label: 'Carbon Dioxide Levels (ppm)',
            data: randomNumbersCO2,
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
}

function Graphs() {
        
    const mqtt = require('mqtt/dist/mqtt');

    const url = 'ws://10.0.0.95:8080';

    const [CO2Data, setCO2Data] = useState([]);

    useEffect(() => {
        const options = {
            // Clean session
            clean: true,
            connectTimeout: 4000,
            // Authentication
            clientId: 'co2_sub',
            username: 'emqx_test',
            password: 'emqx_test'
          }
    
          const client  = mqtt.connect(url, options)
          client.on('connect', function () {
            console.log('Connected')
            // Subscribe to a topic
            client.subscribe('co2', function (err) {
              if (!err) {
                // Publish a message to a topic
                console.log("Subscribed to the 'co2' topic");
                // client.publish('test', 'Hello mqtt')
              }
            });
          });

          client.on('message', function (topic, message) {
            // Parse the incoming data
            const incomingData = JSON.parse(message.toString());

            // Add the new reading to the existing readings data
            const updatedCO2Data = [...CO2Data, incomingData];

            // Update the state
            setCO2Data(updatedCO2Data);
        });
    }, [CO2Data]);  // Add CO2Data as a dependency so that useEffect knows to re-run whenever CO2Data changes

    // Prepare the chart data
    const CO2ChartData = {
        labels: CO2Data.map((_, index) => `Reading ${index + 1}`),
        datasets: [
            {
                label: 'Carbon Dioxide Levels (ppm)',
                data: CO2Data,
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

  return (
    <div className='graphs'>
        <h1>Monitoring Information</h1>
        <div className='graphs__container'>
            <div className='graph__wrapper'>
                <ul className='graph__items'>
                    {CO2_data && <Graph chartData={CO2_data} chartType='line' chartTitle='CO2 Over Time' chartColor='black' />}
                    <Graph chartData={CO2ChartData} chartType='line' />
                    

                </ul>
                <ul className='graph__items'>
                    <Graph chartData={data} chartType='line' />
                    <Graph chartData={data} chartType='pie' />
                    <Graph chartData={data} chartType='bar' />
                </ul>
            </div>   
        </div>
    </div>
  )
}

export default Graphs;