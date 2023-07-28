import React from 'react';
import Graph from './Graph';
import Stat from './Stat';
import './Graph.css';
import './Dashboard.css';


function Dashboard() {
  return (
    <div className='dashboard'>
      <div className='left__separator'>

      </div>
      <div className='right__separator'>
        <div className='control__section'>

        </div>
        <div className='graph__section'>
          <div className='graph__two'>
            <Graph mqttTopic={'temp'} chartType='line' />
          </div>
          <div className='graph__three'>
            <Graph mqttTopic={'hum'} chartType='line' />
          </div>
          <div className='graph__four'>
            <Graph mqttTopic={'light'} chartType='line' />
          </div>
          <div className='graph__one'>
            <Graph mqttTopic={'co2'} chartType='line'/>
          </div>
          <div className='stat__section'>
            <ul className='stat__items__top'>
              <Stat mqttTopic={'co2'} />
              <Stat mqttTopic={'temp'} />
            </ul>
            <ul className='stat__items__bottom'>
              <Stat mqttTopic={'hum'} />
              <Stat mqttTopic={'light'} />
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;