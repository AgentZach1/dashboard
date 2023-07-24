import React from 'react';
import './Footer.css'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faLinkedin, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { SpikeIcon } from './SpikeIcon';

function Footer() {
  return (
    <div className='footer-container'>
        <section className='footer-subscription'>
            <p className='footer-subscription-heading'>
                What's up with you?
            </p>
        </section>
        <h2>Links</h2>
        <div className='footer-links'>
          
            <div className='footer-link-wrapper'>
                <div className='footer-link-items'>
                    <Link to='/dashboard'>Home</Link>
                </div>
                <div className='footer-link-items'>
                    <Link to='/dashboard/services'>Services</Link>
                </div>
                <div className='footer-link-items'>
                    <Link to='/dashboard/playground'>Playground</Link>
                </div>
                <div className='footer-link-items'>
                    <Link to='/dashboard/sign-up'>Sign-Up</Link>
                </div>
                <div className='footer-link-items'>
                    <Link to='/protected'>Protected</Link>
                </div>
            </div>
        </div>
        <section className='social-media'>
            <div className='social-media-wrap'>
                <div className='footer-logo'>
                    <Link to="/dashboard" className='social-logo'>
                        WEISS <SpikeIcon size={60} />
                    </Link>
                </div>
                <div className='social-icons'>
                    <a 
                    href="https://www.instagram.com/zachweighsin/"
                    target='_blank'
                    rel='noopener noreferrer'
                    className='social-icon-link instagram'>
                        <FontAwesomeIcon icon={faInstagram}/>
                    </a>
                    <a 
                    href="https://www.linkedin.com/in/zachary-weiss-a775361b9/"
                    target='_blank'
                    rel='noopener noreferrer'
                    className='social-icon-link linkedin'>
                        <FontAwesomeIcon icon={faLinkedin}/>
                    </a>
                    <a 
                    href="https://twitter.com/TheOneSnack" 
                    target='_blank'
                    rel='noopener noreferrer'
                    className='social-icon-link twitter'>
                        <FontAwesomeIcon icon={faTwitter}/>
                    </a>
                    <a 
                    href="https://www.youtube.com/channel/UC2uLyYrMq7bOh-zuhA0bfMg"
                    target='_blank'
                    rel='noopener noreferrer'
                    className='social-icon-link youtube'>
                        <FontAwesomeIcon icon={faYoutube}/>
                    </a>
                </div>
            </div>
        </section>
    </div>
  )
}

export default Footer