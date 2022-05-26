// bring in dependencies
import { useState } from 'react';
import { MenuItems } from './MenuItems';
import './Navbar.scss';

// bring in redux

// bring in components

// bring in actions

// bring in functions and hooks

// set initial state

const Navbar = () => {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <nav className='navbar'>
            <div className='navbar-logo'>
                <a href='/'>
                    <i className='far fa-address-card mr-1 text-primary-light-7'></i>B-Card's
                </a>
            </div>

            <div className='menu-icon' onClick={handleClick}>
                <i className={open ? 'fas fa-times' : 'fas fa-bars'}></i>
            </div>

            <div className={`navbar-links ${open ? 'active' : ''}`}>
                <ul className={``}>
                    {MenuItems.map((item, idx) => {
                        return (
                            <li key={idx}>
                                <a className={item.className} href={item.url}>
                                    {item.title}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
