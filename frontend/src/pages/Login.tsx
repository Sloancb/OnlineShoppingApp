import React, { useState } from 'react';
import { request } from '../API/Requests.ts';
import config from '../config.json';
import { useNavigate } from "react-router-dom";
import { Alert, Button, Card, CardContent, CircularProgress, Paper, TextField, styled } from '@mui/material';
import { error } from '../styling/components.tsx';
// import {Paper} from '../styling/components.tsx';
function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<error>({isError : false, message:""});

    const handleLogin = () => {
        setLoading(true);
        request(config.endpoint.customers + '/login', 'POST', { email, password })
            .then((response) => {
                setLoading(false);
                if(response !== undefined)
                    navigate('/home');
            })
            .catch((error) => {
                // handle login error
                console.log("error", error);
                setLoading(false);
                setError({isError: true, message:error});
            });
    };
    const handleRegister = () => {
        setLoading(true);
        let name = email + "@gmail.com";
        request(config.endpoint.customers+'/Register', 'POST', { name, email, password })
            .then((response) => {
                // handle successful login
                console.log("response", response)
                setLoading(false);
            })
            .catch((error) => {
                // handle login error
                console.log("error", error);
                setLoading(false);
                setError({isError: true, message:error});
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
                    value={email}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setEmail(event.target.value);
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
                <Button onClick={handleRegister}>Register</Button>
            </div>
            <br/>
            {error.isError && <Alert severity="error">{error.message}</Alert>}
            </Paper>
        </div>
    );
}

export default Login;