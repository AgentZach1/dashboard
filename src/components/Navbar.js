import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBars } from '@fortawesome/free-solid-svg-icons';
import { SpikeIcon } from './SpikeIcon';
import './Navbar.css';
import {Button} from './Button';

function Navbar() {
  const [click, setClick] = useState(false);

  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);

  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if(window.innerWidth <= 960) {
        setButton(false);
    } else {
        setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener('resize', showButton);


  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.pageYOffset > window.innerHeight * 0.3) {
        navbar.classList.add('navbar-hide');
    } else {
        navbar.classList.remove('navbar-hide');
    }
    
    });

  return (
    <>
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/dashboard" className="navbar-text" onClick={closeMobileMenu}>
                    WEISS DASHBOARD
                </Link>
                <Link to="/dashboard" className="navbar-logo" onClick={closeMobileMenu}>
                    <SpikeIcon size={60} />
                </Link>
                <div className='menu-icon' onClick={handleClick}>
                    <FontAwesomeIcon icon={click ? faTimes : faBars} />
                </div>
                <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                    <li className={click ? 'nav-item active' : 'nav-item'}>
                        <Link to='/dashboard' className={click ? 'nav-links active' : 'nav-links'} onClick={closeMobileMenu}>
                            Monitor
                        </Link>
                    </li>
                    <li className={click ? 'nav-item active' : 'nav-item'}>
                        <Link to='/dashboard/notes' className={click ? 'nav-links active' : 'nav-links'} onClick={closeMobileMenu}>
                            Notes
                        </Link>
                    </li>
                    <li className={click ? 'nav-item active' : 'nav-item'}>
                        <Link to='/dashboard/chat' className={click ? 'nav-links active' : 'nav-links'} onClick={closeMobileMenu}>
                            Chat
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    </>
  )
}

export default Navbar;