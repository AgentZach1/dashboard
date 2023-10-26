import React, { useState, useEffect } from 'react';
import Graph from './Graph';
import Stat from './Stat';
import './Graph.css';
import './Dashboard.css';
import axios from 'axios';

function Dashboard({sections}){

  const initialTopics = ['co2', 'temp', 'hum', 'light'];
  const [mqttTopics, setMqttTopics] = useState(initialTopics);
  const [sectionAMT, setSectionAMT] = useState(1);
  const [fetchedData, setFetchedData] = useState(null);

  useEffect(() => {
    if (Number(sections) <= 2 && Number(sections) > 0) {
      setSectionAMT(sections);
    }
  }, [sections]);
  

  const rotateGraphs = (selectedTopic) => {
    let newTopics = [...mqttTopics];
    const selectedIndex = newTopics.indexOf(selectedTopic);
    if (selectedIndex > -1) {
      newTopics.unshift(newTopics.splice(selectedIndex, 1)[0]); // push the removed element to the end of the array
    }
    setMqttTopics(newTopics);
  };

  function LeftSeparator() {
    return (<div className='left__separator'> </div>)
  };

  function RightSeparator() {
    return ( 
      <div className='right__separator'>
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
    ) 
  };

  function setSections() {
    if (sectionAMT === 2) {
      // return {LeftSeparator};{RightSeparator};
      return (
        <>
        <LeftSeparator />
        <RightSeparator />
        </>
      )
    }
    else if (sectionAMT === 1) {
      return (
        <RightSeparator />
      )
    }
  };

  return (
    <div className='dashboard'>
      <RightSeparator />
    </div>
  )
}

export default Dashboard;