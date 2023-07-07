import React from 'react';
import CardItem from './CardItem';
import './Cards.css';

function Cards() {
  return (
    <div className='cards'>
        <h1>Check out these epic destinations</h1>
        <div className='cards__container'>
            <div className='cards__wrapper'>
                <ul className='cards__items'>
                    <CardItem 
                    src='/images/ZachHeadshot.jpg' 
                    text='Link to my butt'
                    label='butt'
                    path='/butt'
                    />
                    <CardItem 
                    src='/images/ZachHeadshot.jpg' 
                    text='Link to something secret'
                    label='secret'
                    path='/secret'
                    />
                </ul>
                <ul className='cards__items'>
                    <CardItem 
                    src='/images/ZachHeadshot.jpg' 
                    text='Zach Face llllllllllllllllllllllllllllllllllllllllllllllllllllllllllll'
                    label='Adventure'
                    path='/services'
                    />
                    <CardItem 
                    src='/images/ZachHeadshot.jpg' 
                    text='Link to Playground'
                    label='Play'
                    path='/playground'
                    />
                    <CardItem 
                    src='/images/ZachHeadshot.jpg' 
                    text='Link to Protected (only go if you are authenticated)'
                    label='protected'
                    path='/protected'
                    />
                </ul>
                
            </div>   
        </div>
    </div>
  )
}

export default Cards