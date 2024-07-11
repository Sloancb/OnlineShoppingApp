import React from 'react';
import HomeBar, { EnsureLoggedIn, HandleMessages } from '../styling/components.tsx';

function ProfilePage() {
    return (
    <EnsureLoggedIn>
        <HandleMessages>
        <HomeBar>
            <div className="container">
                <h2>This is the Checkout page</h2>  
            </div>
        </HomeBar>
        </HandleMessages>
    </EnsureLoggedIn>
    );
}

export default ProfilePage;