import React from 'react';
import CardItem from './CardItem';
import './Cards.css';
import ZachFace from '../images/ZachHeadshot.jpg';

function Cards() {
  return (
    <div className='cards'>
        <h1>My links</h1>
        <div className='cards__container'>
            <div className='cards__wrapper'>
                <ul className='cards__items'>
                    <CardItem 
                    src={ZachFace} 
                    text='Link to my butt'
                    label='butt'
                    path='/dashboard/butt'
                    />
                    <CardItem 
                    src={ZachFace}  
                    text='Link to something secret'
                    label='secret'
                    path='/dashboard/secret'
                    />
                </ul>
                <ul className='cards__items'>
                    <CardItem 
                    src={ZachFace} 
                    text='Zach Face llllllllllllllllllllllllllllllllllllllllllllllllllllllllllll'
                    label='Adventure'
                    path='/dashboard/services'
                    />
                    <CardItem 
                    src={ZachFace} 
                    text='Link to Playground'
                    label='Play'
                    path='/dashboard/playground'
                    />
                    <CardItem 
                    src={ZachFace} 
                    text='Link to Protected (only go if you are authenticated)'
                    label='protected'
                    path='/dashboard/protected'
                    />
                </ul>
                
            </div>   
        </div>
    </div>
  )
}

export default Cards;