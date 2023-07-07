import React from 'react';
import { Button } from './Button';
import './Footer.css'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faLinkedin, faTwitter, faTypo3, faYoutube } from '@fortawesome/free-brands-svg-icons';



function Footer() {
  return (
    <div className='footer-container'>
        <section className='footer-subscription'>
            <p className='footer-subscription-heading'>
                Join the Adventure newsletter to receive our best deals.
            </p>
            <p className='footer-subscription-text'>
                You can unsub anytime.
            </p>
            <div className='input-areas'>
                <form>
                    <input className='footer-input' type='email' name='email' placeholder='Your Email'/>
                    <Button buttonStyle='btn--outline'>Subscribe</Button>
                </form>
            </div>
        </section>
        <div className='footer-links'>
            <div className='footer-link-wrapper'>
                <div className='footer-link-items'>
                    <h2>About Me</h2>
                    <Link to='/sign-up'>How it works</Link>
                    <Link to='/'>Testimonials</Link>
                    <Link to='/services'>Services</Link>
                    <Link to='/protected'>File Server</Link>
                    <Link to='/playground'>Playground</Link>
                </div>
            </div>
            <div className='footer-link-wrapper'>
                <div className='footer-link-items'>
                    <h2>Contact Me</h2>
                    <Link to='/'>Instagram</Link>
                    <Link to='/'>Snapchat</Link>
                    <Link to='/'>Twitter</Link>
                    <Link to='/'>Youtube</Link>
                </div>
            </div>
        </div>
        <section className='social-media'>
            <div className='social-media-wrap'>
                <div className='footer-logo'>
                    <Link to="/" className='social-logo'>
                        TRVL <FontAwesomeIcon icon={faTypo3}/>
                    </Link>
                </div>
                <small className='website-rights'>TRVL c 2020 (idc)</small>
                <div className='social-icons'>
                    <Link 
                    to="/"
                    target='_blank'
                    aria-label='Instagram'
                    className='social-icon-link instagram'>
                        <FontAwesomeIcon icon={faInstagram}/>
                    </Link>
                    <Link 
                    to="/"
                    target='_blank'
                    aria-label='LinkedIn'
                    className='social-icon-link linkedin'>
                        <FontAwesomeIcon icon={faLinkedin}/>
                    </Link>
                    <Link 
                    to="/"
                    target='_blank'
                    aria-label='Twitter'
                    className='social-icon-link twitter'>
                        <FontAwesomeIcon icon={faTwitter}/>
                    </Link>
                    <Link 
                    to="/"
                    target='_blank'
                    aria-label='Youtube'
                    className='social-icon-link youtube'>
                        <FontAwesomeIcon icon={faYoutube}/>
                    </Link>
                </div>
            </div>
        </section>
    </div>
  )
}

export default Footer