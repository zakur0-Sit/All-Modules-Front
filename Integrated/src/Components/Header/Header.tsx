import React, { useEffect, useState } from 'react';
import { Button } from '../Button/Button';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './Header.css';

interface Notification {
    id: number;
    message: string;
}

export const Header = () => {

    const [notif, setNotif] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch('http://localhost:9091/notifications');
                /*if (!response.ok) {
                    throw new Error('Network response was not ok');
                }*/
                const data = await response.json();

                if (Array.isArray(data.notificationList)) {
                    const mappedData: Notification[] = data.notificationList.map((item: any, index: number) => ({
                        id: index,
                        message: item.message
                    }));
                    setNotifications(mappedData);
                } else {
                    throw new Error('Data format is incorrect');
                }
            } catch (error: unknown) {
                /*if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('An unknown error occurred');
                }*/
            }
        };

        fetchNotifications();
    }, []);

    const handleNotif = () => {
        setNotif(!notif);
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const clearNotifications = async () => {
        try {
            const response = await fetch('http://localhost:9091/notifications/clearNotifications', {
                method: 'DELETE'
            });
            if (!response.ok) throw Error('Notifications could not be cleared');
        } catch (error) {
            console.error('Error clearing notifications:', error);
        }
    };

    return (
        <nav>
            <a href="#"><img src="img/ico/Logo.png" alt="logo" /></a>
            <ul>
                <li className="homeChores"><Link to="/">Home</Link></li>
                <li className="aboutChores"><a href="#">About</a></li>
                <li className="contactChores"><a href="#">Contact Us</a></li>
                <li className='notification'>
                    <div>
                        <img src="img/ico/bell.png" className='Bell' onClick={handleNotif}/>
                        {notif &&
                            <div className="NotifDropDown">
                                <div className='NotifHeader'>
                                    <div className='notifTitle'>Notifications</div>
                                    <button onClick={() => {setNotifications([]); clearNotifications()}}><b>Clear</b></button>
                                </div>
                                <div className="NotifContent">
                                    {notifications.length === 0 ? (
                                        <h3>No notifications</h3>
                                    ) : (
                                        notifications.map((notification, index) => (
                                            <div className="EachNot" key={index}>
                                                {
                                                    (notification.message.split(' ')[1] === 'chore' || notification.message.split(' ')[1] === 'chores') ? 
                                                    (<Link to='/chores'><p key={notification.id}>{notification.message}</p></Link>) :
                                                    (notification.message.split(' ')[1] === 'shopping') ?
                                                    (<Link to='/shopping-list'><p key={notification.id}>{notification.message}</p></Link>) :
                                                    (notification.message.split(' ')[1] === 'inventory') ?
                                                    (<Link to='/inventory'><p key={notification.id}>{notification.message}</p></Link>) :
                                                    <h3 key={notification.id}>{notification.message}</h3>
                                                }
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        }
                    </div>
                </li>
                <li className="dropdownChores">
                    <div className="menuChores"></div>
                    <div className="contentChores">
                        <div className="homeHideChores"><a href="/">Home</a></div>
                        
                        <Link to="/recipe">Recipe</Link>
                        <Link to="/menu">Meal Planning</Link>
                        <Link to="/shopping-list">Shopping Lists</Link>
                        <Link to="/inventory">Inventory</Link>
                        <Link to="/chores">Chores</Link>
                        <Link to="/preferences">Preferences</Link>

                        <div className="accountHideChores"><a href="/account"><Button text={"Account"}/></a></div>
                    </div>   
                </li>
                <li className="regBtnChores"><a href='/#/account'><Button text={"Account"}/></a></li> 
            </ul>                
        </nav>
    )
}
