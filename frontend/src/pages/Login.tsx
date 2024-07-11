import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Card, CardContent, CircularProgress, Paper, TextField, Typography, styled } from '@mui/material';
import { HandleMessages, error } from '../styling/components.tsx';
import { getLogin } from '../API/customerAPI.ts';
import Person from '@mui/icons-material/Person';

function LoginPage() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<error>({isError : false, message:""});
    const handleLogin = ()=>{
        setLoading(true)
        getLogin({name, password})
        .then((loggedIn)=>{
            setLoading(false)
            if(loggedIn)
                navigate('/')
        })
    }
    useEffect(()=>{
        localStorage.clear()
    },[])
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
                        value={name}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setName(event.target.value);
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
                <br/>
                <Typography>Don't have an account? {<Link to={'../Register'}>Click here!</Link>}</Typography>
                {error.isError && <Alert severity="error">{error.message}</Alert>}
                </Paper>
        </div>
    );
}

export default LoginPage;