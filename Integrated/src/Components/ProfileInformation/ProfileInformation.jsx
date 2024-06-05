import './ProfileInformation.css';

export const ProfileInformation = () => {
    return(
        <div className="profile-container">
            <h2>Profile Information</h2>
            <form className="profile-form">
                <div className="form-row">
                    <div className="form-group">
                        <label>First Name:</label>
                        <input type="text" name="firstName" />
                    </div>
                    <div className="form-group">
                        <label>Last Name:</label>
                        <input type="text" name="lastName" />
                    </div>
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" />
                </div>
                <button type="submit" className='save-inf-button'>Save</button>
            </form>
        </div>
    )
}