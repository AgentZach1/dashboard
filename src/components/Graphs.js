import React, { useState, useEffect } from 'react';
import Graph from './Graph';
import './Graph.css';


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




function Graphs() {
    const [readings, setReadings] = useState(null);


    useEffect(() => {
        // Fetch the readings from the API
        fetch('http://localhost:5000/readings')
            .then(res => res.text())
            .then(data => {
                console.log(data);  // Add this line to log the raw data
                const transformedData = {
                    labels: data.map((item, index) => `Reading ${index + 1}`),
                    datasets: [{
                        label: 'CO2 Readings',
                        data: data.map(item => item.carbon_dioxide),
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                };
                console.log(transformedData);  // And this line to log the transformed data
                setReadings(transformedData);
            })
            .catch(err => {
                console.error(err);  // This will log any errors that occur
                alert(err);  // This will alert any errors that occur
            });
    }, []);

  return (
    <div className='graphs'>
        <h1>Monitoring Information</h1>
        <div className='graphs__container'>
            <div className='graph__wrapper'>
                <ul className='graph__items'>
                    {readings && <Graph chartData={readings} chartType='line' />}
                    <Graph chartData={data} chartType='bar' />
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