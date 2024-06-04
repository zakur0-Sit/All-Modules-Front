import React, { useEffect, useContext, useState, useRef} from 'react';
import { Button } from '../Button/Button';
import './AccountContent.css';
import { HouseholdContext } from '../../HouseholdContext';
import { Navigate, useNavigate } from 'react-router-dom';

export const Content = () => 
{
    const [activeTab, setActiveTab] = useState('setings');
    const { households } = useContext(HouseholdContext);
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [password, setpassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const token = localStorage.getItem('jwtToken');
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetch("http://localhost:9091/account-security", {
            method: 'GET',
            credentials: 'include',
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setUser(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, []);

    const handleSumbit = (e) => {
        e.preventDefault();
        const sendUser = {email, username, password}
        const userUpdate = {user: sendUser, oldPassword}
        console.log(userUpdate)
        fetch("http://localhost:9091/account-security", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
            body: JSON.stringify(userUpdate)
        }).then(response => {
            if (response.ok) {
                console.log('User updated succesfully');
                localStorage.removeItem('jwtToken');
                navigate('/signin');
            } else {
                throw new Error('The username and mail are already registered or the oldPassword is inccorect!')
            }
        }).catch(error => {
            setErrorMessage(error.message);
        });
    }

    const handleLogout = (e) => {
        e.preventDefault();
       if (token != null) {
        console.log('User logged out successfully');
        localStorage.removeItem('jwtToken');
        navigate('/signin');
       }
    }

    const handleTabClick = (tab) => 
    {
        if (tab === 'security') {
            navigate('/household');
        } else {
            setActiveTab(tab);
        }
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileImageClick = () => {
        fileInputRef.current.click();
    };

    return (
        <main>
            <div className="bg-img"></div>
            <div className="profile">
                <div className="content-info">
                    <img className='account-img' src={profileImage || "img/account/account.jpg"} alt="account-img" onClick={handleProfileImageClick} />
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleProfileImageChange}
                    />
                    <p id='name'>{user?.username}</p>
                    <p id='role'>{user?.role}</p>
                    <a href="/#/signin" onClick={handleLogout}><Button text={"Log out"}/></a>
                </div>
                <div className="content-2">
                    <div className="chose">
                        <h4 onClick={() => handleTabClick('setings')}>Account Settings</h4>
                        <h4 onClick={() => handleTabClick('security')}>Household</h4>
                    </div>
                    <hr />
                    {activeTab === 'setings' && (
                        <div className="setings">
                        <form className='setings-form' onSubmit={handleSumbit}>
                            <div className="element">
                                <label>Username</label>
                                <input type="text" name='username' placeholder={user?.username} onChange={e => setUsername(e.target.value)}/>
                            </div>                            
                            <div className="element">
                                <label>Email</label>
                                <input type="email" name='email' placeholder={user?.email} onChange={e => setEmail(e.target.value)}/>
                            </div>
                            <div className="element">
                                <label>Old Password</label>
                                <input type="password" name='oldPassword' placeholder='********' onChange={e => setOldPassword(e.target.value)} required/>
                            </div>
                            <div className="element">
                                <label>New Password</label>
                                <input type="password" name='password' placeholder='********' onChange={e => setpassword(e.target.value)}/>
                            </div>
                            <div className="update-button-container">
                                <Button className="update-button" text={"Update changes"} type="submit"/>
                            </div>
                        </form>
                        {errorMessage && <p className='error-message'>{errorMessage}</p>}
                        <p className='warning'>* Warning: If you update your account details, you will be logged out.</p>
                    </div>
                    )}
                </div>
            </div>
        </main>
    )
}
