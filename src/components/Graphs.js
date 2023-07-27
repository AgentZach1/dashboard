import React, { useState, useEffect } from 'react';
import Graph from './Graph';
import Stat from './Stat';
import './Graph.css';
// import mqtt from 'mqtt/dist/mqtt';
// import Paho from 'paho-mqtt';

// const data = {
//     labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//     datasets: [
//         {
//             label: '# of Votes',
//             data: [12, 19, 3, 5, 2, 3],
//             backgroundColor: [
//                 'rgba(255, 99, 132, 0.2)',
//                 'rgba(54, 162, 235, 0.2)',
//                 'rgba(255, 206, 86, 0.2)',
//                 'rgba(75, 192, 192, 0.2)',
//                 'rgba(153, 102, 255, 0.2)',
//                 'rgba(255, 159, 64, 0.2)'
//             ],
//             borderColor: [
//                 'rgba(255, 99, 132, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(75, 192, 192, 1)',
//                 'rgba(153, 102, 255, 1)',
//                 'rgba(255, 159, 64, 1)'
//             ],
//             borderWidth: 1
//         }
//     ]
// };

function Graphs() {

  return (
    <div className='graphs'>
        <h1>Monitoring Information</h1>
        <div className='graphs__container'>
            <div className='graph__wrapper'>
                <ul className='graph__items'>
                    <Graph mqttTopic={'co2'} chartType='line' chartTitle='CO2 Over Time' chartColor='black' />
                    <div className='stat__wrapper'>
                        <ul className='stat__items'>
                            <Stat mqttTopic={'co2'} />
                            <Stat mqttTopic={'temp'} />
                        </ul>
                        <ul className='stat__items'>
                            <Stat mqttTopic={'hum'} />
                            <Stat mqttTopic={'light'} />
                        </ul>
                    </div>
                    <Graph mqttTopic={'temp'} chartType='line' />
                </ul>
                <ul className='graph__items'>
                    <Graph mqttTopic={'hum'} chartType='line' />
                    
                    <Graph mqttTopic={'light'} chartType='bar' />
                </ul>
            </div>   
        </div>
    </div>
  )
}

export default Graphs;