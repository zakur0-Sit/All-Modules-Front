import React from 'react';
import {Button} from '../Button/Button';
import './Header.css';

export const Header = () => 
{
    return (
        <nav>
            <a href="#"><img src="img/ico/Logo.png" alt="logo" /></a>
            <ul>
                <li className='home'><a href="#">Home</a></li>
                <li className='about'><a href="#">About</a></li>
                <li className='contact'><a href="#">Contact Us</a></li>
                <li className='dropdown'>
                    <div className='menu'></div>
                    <div className="content">
                        <div className="home-hide"><a href="#">Home</a></div>
                        
                        <a href="#">Recipe</a>
                        <a href="#">Meal Planning</a>
                        <a href="/shopping-list">Shopping List</a>
                        <a href="#">Household</a>
                    </div>   
                </li>
                <li className='reg-btn'><a href='/#/account'><Button text={"Account"}/></a></li> 
            </ul>                
        </nav>
    )
}
