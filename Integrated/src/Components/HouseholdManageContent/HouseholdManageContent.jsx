import React, { useEffect, useContext, useState } from 'react';
import { Button } from '../Button/Button';
import './HouseholdManageContent.css';
import { HouseholdContext } from '../../HouseholdContext';
import { redirect, useNavigate } from 'react-router-dom';
import { ManageButton } from '../ManageButton/ManageButton';



export const Content = () => {
    const [activeTab, setActiveTab] = useState('security');
    const { households } = useContext(HouseholdContext);
    const [user, setUser] = useState(null);
    const token = localStorage.getItem('jwtToken');
    const navigate = useNavigate();
    const [role, setRole] = useState({});
    const [activeSection, setActiveSection] = useState(null);
    const [newMemberEmail, setNewMemberEmail] = useState('');

    const [exampleUsers, setExampleUsers] = useState([]);
    const [profileImage, setProfileImage] = useState(null);
    const [username, setUsername] = useState('');
    const [invitations, setInvitations] = useState([]);

    

    useEffect(() => {
        fetch("http://localhost:9091/account-security", {
            method: 'GET',
            credentials: 'include',
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setUser(data);
            if (data.photo) {
                const base64 = data.photo;
                const arrayBuffer = base64ToArrayBuffer(base64);
                setProfileImage(arrayBuffer);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

        fetch("http://localhost:9091/api/v1/household/get-invites", {
            method: 'GET',
            credentials: 'include',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            setInvitations(data);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });

        
        

        fetch('http://localhost:9091/api/v1/household/load-users', {
            method: 'GET',
            credentials: 'include', // include sessions
        })
            .then(response => response.json())
            .then(data => setExampleUsers(data));
    }, []);

    const handleInvite = (username) => {
        fetch(`http://localhost:9091/api/v1/household/invite-user/${username}`, {
            method: 'POST',
            credentials: 'include', // include sessions
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            console.log(data); // "User invited"
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    };

    function base64ToArrayBuffer(base64) {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }
    
    const handleLogout = (e) => {
        e.preventDefault();
        if (token != null) {
            console.log('User logged out successfully');
            localStorage.removeItem('jwtToken');
            navigate('/signin');
        }
    }

    const handleInputChange = (event) => {
        setUsername(event.target.value);
    };

    const handleTabClick = (tab) => {
        if(tab === 'setings') {
            navigate('/account');
        }
        else
            setActiveTab(tab);
    };

    const handleDeleteUser = (userId) => {
        fetch(`http://localhost:9091/api/v1/household/kick-user/${userId}`, {
            method: 'DELETE',
            credentials: 'include', // include sessions
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            console.log(data); // "User kicked"
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    };

    const handleManageRole = (userId, newRole) => {
        setRole(prevRole => ({ ...prevRole, [userId]: newRole }));
    };

    const handleSectionClick = (section) => {
        setActiveSection(prevSection => prevSection === section ? null : section);
    };
    const arrayBufferToUrl = (buffer) => {
        const blob = new Blob([buffer]);
        const url = URL.createObjectURL(blob);
        return url;
    };
    const handleLeaveHouse = () => {
        fetch(`http://localhost:9091/api/v1/household/leave-house`, {
            method: 'DELETE',
            credentials: 'include', // include sessions
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            console.log(data); // "User left the household"
            navigate('/account');
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    };

    return (
        <main>
            <div className="bg-img"></div>
            <div className="profile">
                <div className="content-info">
                <img className='account-img' src={profileImage ? arrayBufferToUrl(profileImage) : "img/account/account.jpg"} alt="account-img"/>
                    <p id='name'>{user?.username}</p>
                    <p id='role'>{user?.role}</p>
                    <a href="/#/signin" onClick={handleLogout}><Button text={"Log out"} /></a>
                </div>
                <div className="content-2">
                    <div className="chose">
                        <h4 onClick={() => handleTabClick('setings')}>Account Setings</h4>
                        <h4 onClick={() => handleTabClick('security')}>Household</h4>
                    </div>
                    <hr />
                    {activeTab === 'setings' && (
                        <div className="setings">
                            <p>Settings content has been removed.</p>
                        </div>
                    )}
                    {activeTab === 'security' && (
                        <div className="security">
                            <div className="top-buttons">
                                {!activeSection && (
                                    <>
                                        <button className="add-member-btn" onClick={() => handleSectionClick('addMember')}>Add New Member</button>
                                        <button className="add-member-btn" onClick={() => handleSectionClick('deleteHousehold')}>Delete Household</button>
                                        <button className="add-member-btn" onClick={() => handleSectionClick('viewInvitations')}>Leave Household</button>
                                    </>
                                )}
                                {activeSection === 'addMember' && (
                                <div className="add-member">
                                    <input 
                                        type="text" 
                                        placeholder="Enter name"
                                        onChange={handleInputChange}
                                    />
                                    <button 
                                        onClick={() => handleInvite(username)}
                                    >
                                        Send Invitation
                                    </button>
                                    <button onClick={() => setActiveSection(null)}>Close</button>
                                </div>
                            )}
                                {activeSection === 'deleteHousehold' && (
                                    <div className="delete-confirmation">
                                        <p style={{ fontSize: '10px' }}>Are you sure you want to delete?</p>
                                        <button style={{ width: '73px', height: '30px' }}>
                                            Yes
                                        </button>
                                        <button style={{ width: '73px', height: '30px' }}>
                                            No
                                        </button>
                                        <button onClick={() => setActiveSection(null)} style={{ marginLeft: '10px' }}>Close</button>
                                    </div>
                                )}
                                {activeSection === 'viewInvitations' && (
                                    <div className="delete-confirmation">
                                    <p style={{ fontSize: '14px' }}>Are you sure you want to leave this household?</p>
                                    <button onClick={handleLeaveHouse}>Yes</button>
                                    <button onClick={() => setActiveSection(null)}>No</button>
                                    </div>
                                )}
                            </div>
                            <div className="user-list">
                                <h2>Users list:</h2>
                                {exampleUsers.map((user) => {
                                console.log(user); // This will log the user object to the console
                                return (
                                    <div key={user.id} className="user-item">
                                        <p className='user-name'>{user.username}</p>
                                        <p className='user-role'>{user.role}</p>
                                        <div className="user-actions">
                                            <button style={{ backgroundColor: "red" }} className="delete-button" text={"Delete"} onClick={() => {
    handleDeleteUser(user.id);
    window.location.reload();
}}>Kick</button>
                                            <select value={role[user.id] || ''} onChange={(e) => handleManageRole(user.id, e.target.value)}>
                                                <option value="">Manage...</option>
                                                <option value="parent">Parent</option>
                                                <option value="child">Child</option>
                                            </select>
                                        </div>
                                    </div>
                                )
                            })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default Content;