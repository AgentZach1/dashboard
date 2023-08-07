import React from 'react';
import {Button} from './Button';
import './HeroSection.css';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';

function HeroSection() {
  return (
    <div className='hero-container'>
        {/* <video src={backVideo} autoPlay loop muted /> */}
        <h1>What's up cutie?</h1>
        <p>Project Website</p>
        <div className="hero-btns">
            <Button className='btns' buttonStyle='btn--outline' buttonSize='btn--large' toGo='/dashboard/sign-up'>
                Sign up?
            </Button>
            <Button className='btns' buttonStyle='btn--primary' buttonSize='btn--large' toGo='/dashboard/sign-up'>
                L
            </Button>
        </div>
    </div>
  );
}

export default HeroSection;