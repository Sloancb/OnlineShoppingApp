import React, { useState } from 'react';
import HomeBar, { EnsureLoggedIn, HandleMessages } from '../styling/components.tsx';
import { Button } from '@mui/material';

function ProfilePage() {
    const [pageView, setPageView] = useState('checkout')
    return (
    <EnsureLoggedIn>
        <HandleMessages>
        <HomeBar>
           {pageView == "checkout" ?
           <>
            <h2>Checkout page</h2>
            <Button onClick={()=>{setPageView("payment")}}>Click mE1</Button>
           </>
           :
           <>
           {pageView == "payment" ? 
           <>
            <h2>Checkout page</h2>
            <Button onClick={()=>{setPageView("confirmation")}}>Click mE1</Button>
           </>
           :
           <h2>Confirmation page</h2>
           }
           </>
            }
        </HomeBar>
        </HandleMessages>
    </EnsureLoggedIn>
    );
}

export default ProfilePage;