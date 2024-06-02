import React, { useState } from 'react';
import { request } from '../API/Requests.ts';
import { useNavigate } from "react-router-dom";
import { Button, Card, CardContent, CircularProgress, Paper, TextField, styled } from '@mui/material';
// import {Paper} from '../styling/components.tsx';
function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const handleLogin = () => {
        setLoading(true);
        request('/login', 'POST', { username, password })
            .then((response) => {
                if(response !== undefined){
                    // handle successful login
                    console.log("response", response)
                    setLoading(false);
                    navigate('/home');
                }
            })
            .catch((error) => {
                // handle login error
                console.log("error", error);
                setLoading(false);

                //TODO: remove redirect
                navigate('/home');
            });
    };

    return (
        <div className="container">
            <Paper className={"paper"} elevation={3} >
            <h1>
                Login
                {loading && <CircularProgress size={20}  style={{textAlign:"center", padding:3}}/>}
            </h1>
            <div style={{display:"flex"}}>
                <TextField
                    label="Username"
                    value={username}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setUsername(event.target.value);
                    }}
                />
                <TextField
                    label="Password"
                    type='password'
                    value={password}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setPassword(event.target.value);
                    }}
                />
                <Button onClick={handleLogin}>Login</Button>
            </div>
            </Paper>
        </div>
    );
}

export default Login;