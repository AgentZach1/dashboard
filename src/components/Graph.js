import { React, useState } from 'react';
import './Graph.css';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {Chart, CategoryScale} from 'chart.js/auto'; 

const Graph = ({ chartData, chartType, scaleLevel, chartTitle, chartColor }) => {
    let ChartComponent;

    let [scale, setScale] = useState(1);

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
          },
          x: {
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
            <ChartComponent data={chartData} options={options} />
            Select Scale
            <select className="chart__scale" value={scale} onChange={handleScaleChange}>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
            </select>
        </div>
    );
};

Chart.register(CategoryScale);

export default Graph;