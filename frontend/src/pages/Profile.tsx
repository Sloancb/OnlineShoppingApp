import React from 'react';

import HomeBar, { EnsureLoggedIn, sendMessage } from '../styling/components.tsx';

function ProfilePage() {
    return (
    <EnsureLoggedIn>
        <HomeBar>            
            <div className="container">
                <h2>This is the profile page</h2>    
                <button onClick={()=>{sendMessage('success', "Test success message")}}>send success message</button>
            </div>
        </HomeBar>
    </EnsureLoggedIn>
    );
}

export default ProfilePage;