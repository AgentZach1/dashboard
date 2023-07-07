import React from 'react';
import {Button} from './Button';
import './HeroSection.css';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import backVideo from '../videos/video-2.mp4';

function HeroSection() {
  return (
    <div className='hero-container'>
        <video src={backVideo} autoPlay loop muted />
        <h1>Adventure Awaits</h1>
        <p>What are you waiting for</p>
        <div className="hero-btns">
            <Button className='btns' buttonStyle='btn--outline' buttonSize='btn--large'>
                GET STARTED
            </Button>
            <Button className='btns' buttonStyle='btn--primary' buttonSize='btn--large'>
                WATCH TRAILER <FontAwesomeIcon icon={faPlayCircle}/>
            </Button>
        </div>
    </div>
  );
}

export default HeroSection;