import React, { useState } from 'react';
import {  useNavigate } from "react-router-dom";
import { Button, CircularProgress, Paper, TextField, } from '@mui/material';
import { postCustomer } from '../API/customerAPI.ts';

function RegisterPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const handleRegister = ()=>{
        setLoading(true)
        postCustomer({email, name, password})
        .then((isRegistered)=>{
            setLoading(false)
            if(isRegistered)
                navigate('/Login')

        })
    }
    return (
        <div className="container">
                <Paper className={"paper"} elevation={3} style={{width:'10lh', textAlign:'center'}} >
                <h1>
                    Register
                    {loading && <CircularProgress size={20}  />}
                </h1>
                <div className="Form">
                    <TextField
                        label="Email"
                        value={email}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setEmail(event.target.value);
                        }}
                    />
                </div>
                <div className="Form">
                    <TextField
                        label="Username"
                        value={name}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setName(event.target.value);
                        }}
                    />
                <br/>
                </div>
                <div className="Form">
                    <TextField
                        label="Password"
                        type='password'
                        value={password}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setPassword(event.target.value);
                        }}
                    />
                </div>
                <br/>
                <div>
                    <Button onClick={()=>{navigate('/Login')}}>Cancel</Button>
                    <Button onClick={handleRegister}>Register</Button>
                </div>
                </Paper>
        </div>
    );
}

export default RegisterPage;