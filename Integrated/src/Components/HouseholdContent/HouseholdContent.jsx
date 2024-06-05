import { HouseholdContext } from "../../HouseholdContext";
import { Button } from "../Button/Button";
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const HouseholdContent = () => {
    const [user, setUser] = useState(null);
    // const [username, setUsername] = useState('');
    // const [email, setEmail] = useState('');
    // const [oldPassword, setOldPassword] = useState('');
    // const [password, setpassword] = useState('');
    // const [errorMessage, setErrorMessage] = useState('');
    const { households } = useContext(HouseholdContext);
    const token = localStorage.getItem('jwtToken');
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('household'); 
    const [household, setHousehold] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [invitations, setInvitations] = useState([]);
    const [activeSection, setActiveSection] = useState(null);

    useEffect(() => {
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
            console.log(data);
            setInvitations(data);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });

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
    
            fetch("http://localhost:9091/api/v1/household/get-house" , {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setHousehold(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    const handleSectionClick = (section) => {
        setActiveSection(prevSection => prevSection === section ? null : section);
    };

    const handleAcceptInvite = (inviteId) => {
        fetch(`http://localhost:9091/api/v1/household/accept-invite/${inviteId}`, {
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
            console.log(data); // "Invite accepted"
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

    const handleDelete = () => {
        fetch(`http://localhost:9091/api/v1/household/remove-house`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // If the delete was successful, remove the household from the state
            console.log(response);
            setHousehold(null);
        })
        .catch(error => console.error('Error:', error));
    };

    const handleDeclineInvite = (inviteId) => {
        fetch(`http://localhost:9091/api/v1/household/decline-invite/${inviteId}`, {
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
            console.log(data); // "Invite declined"
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    };

    // const handleSumbit = (e) => {
    //     e.preventDefault();
    //     const sendUser = {email, username, password}
    //     const userUpdate = {user: sendUser, oldPassword}
    //     console.log(userUpdate)
    //     fetch("http://localhost:9091/account-security", {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${token}`,
    //         },
    //         credentials: 'include',
    //         body: JSON.stringify(userUpdate)
    //     }).then(response => {
    //         if (response.ok) {
    //             console.log('User updated succesfully');
    //             localStorage.removeItem('jwtToken');
    //             navigate('/signin');
    //         } else {
    //             throw new Error('The username and mail are already registered or the oldPassword is inccorect!')
    //         }
    //     }).catch(error => {
    //         setErrorMessage(error.message);
    //     });
    // }

    const handleLogout = (e) => {
        e.preventDefault();
        if (token != null) {
            console.log('User logged out successfully');
            localStorage.removeItem('jwtToken');
            navigate('/signin');
        }
    };

    const handleTabClick = (tab) => {
        if (tab === 'settings') {
            navigate('/account');
        } else {
            setActiveTab(tab);
        }
    };

    const arrayBufferToUrl = (buffer) => {
        const blob = new Blob([buffer]);
        const url = URL.createObjectURL(blob);
        return url;
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
                        <h4 onClick={() => handleTabClick('settings')}>Account Settings</h4>
                        <h4 onClick={() => handleTabClick('household')}>Household</h4>
                    </div>
                    <hr />
                    {activeTab === 'household' && (
                        <div className="household">
                            {household == null && (
                                <div className="invite">
                                    <a href="/#/addhousehold"><Button text={"Add new household"} /></a>
                                    <button onClick={() => setActiveSection(activeSection === 'viewInvitations' ? null : 'viewInvitations')}>
                                        View Invitations
                                    </button>
                                </div>
                                
                            )}
                            {household == null  && activeSection === 'viewInvitations' &&(
                                <div className="show-invitations">
                                     {invitations.map((invite, index) => (
                                        <div className="household-buttons" key={index}>
                                            <p className="invite-p" style={{ fontSize: '15px' }}>{`Invitation ${index + 1}`}</p>
                                            <button onClick={() => {
                                                handleAcceptInvite(invite.id);
                                                window.location.reload();
                                            }}>
                                                Accept
                                            </button>
                                            <button onClick={() => {
                                                handleDeclineInvite(invite.id);
                                                window.location.reload();
                                            }}>
                                                Decline
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {household &&(
                                <div className="household-content"> 
                                <div className="household-item" onClick={() => navigate('/household-manage')}>
                                    <h2>{household?.name}</h2>
                                    {/* <p>{household.address}</p>
                                    <p>{household.city}</p>
                                    <p>{household.country}</p> */}
                                    <p>{household?.description}</p>
                                </div>
                                <Button text="Delete" onClick={handleDelete} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};