import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Alert, Button, Card, CardContent, CircularProgress, Paper, TextField, styled } from '@mui/material';
import HomeBar, { EnsureLoggedIn, HandleMessages, error } from '../styling/components.tsx';

function ProfilePage() {
    return (
    <EnsureLoggedIn>
        <HomeBar>
                <div className="container">
                    <h2>This is the profile page</h2>    
                </div>
        </HomeBar>
    </EnsureLoggedIn>
    );
}

export default ProfilePage;