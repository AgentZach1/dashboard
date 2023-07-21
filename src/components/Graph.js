import { React, useState } from 'react';
import './Graph.css';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {Chart, CategoryScale} from 'chart.js/auto'; 

const Graph = ({ chartData, chartType }) => {
    let ChartComponent;

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
    
    return (
        <div className="chart__item">
            <ChartComponent data={chartData} options={{ responsive: true }} />
        </div>
    );
};

Chart.register(CategoryScale);

export default Graph;