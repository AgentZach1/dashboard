import React, { useState } from 'react';
import Graph from './Graph';
import Stat from './Stat';
import './Graph.css';
import './Dashboard.css';

function Dashboard() {

  const initialTopics = ['co2', 'temp', 'hum', 'light'];
  const [mqttTopics, setMqttTopics] = useState(initialTopics);

  const rotateGraphs = (selectedTopic) => {
    let newTopics = [...mqttTopics];
    const selectedIndex = newTopics.indexOf(selectedTopic);
    if (selectedIndex > -1) {
      newTopics.unshift(newTopics.splice(selectedIndex, 1)[0]); // push the removed element to the end of the array
    }
    setMqttTopics(newTopics);
  };

  return (
    <div className='dashboard'>
      <div className='left__separator'>

      </div>
      <div className='right__separator'>
        {/* <div className='control__section'>
            <button className='control__button'>Notes</button>
            <button className='control__button'>Monitor</button>
            <button className='control__button'>Chat</button>
        </div> */}
        <div className='graph__section'>
          <div className='graph__two'>
            <Graph mqttTopic={mqttTopics[1]} chartType='line' className={null} />
          </div>
          <div className='graph__three'>
            <Graph mqttTopic={mqttTopics[2]} chartType='line' className={null}/>
          </div>
          <div className='graph__four'>
            <Graph mqttTopic={mqttTopics[3]} chartType='line' className={null}/>
          </div>
          <div className='graph__one'>
            <Graph mqttTopic={mqttTopics[0]} chartType='line' className={'main'}/>
          </div>
          <div className='stat__section'>
            <ul className='stat__items__top'>
              <Stat mqttTopic="co2" onClick={() => rotateGraphs(initialTopics[0])}/>
              <Stat mqttTopic="temp" onClick={() => rotateGraphs(initialTopics[1])}/>
            </ul>
            <ul className='stat__items__bottom'>
              <Stat mqttTopic="hum" onClick={() => rotateGraphs(initialTopics[2])}/>
              <Stat mqttTopic="light" onClick={() => rotateGraphs(initialTopics[3])}/>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;