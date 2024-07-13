import React, { useState } from 'react';
import {  useNavigate } from "react-router-dom";
import { Button, Checkbox, CircularProgress, FormControlLabel, FormGroup, Grid, Paper, TextField, } from '@mui/material';
import { postCustomer } from '../API/customerAPI.ts';
import { postStaff } from '../API/staffAPI.ts';

function RegisterPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    //staff Info
    const [job_title, setJob_title] = useState('');
    const [salary, setSalary] = useState('');
    const [staffCode, setStaffCode] = useState('');
    const [isStaff, setIsStaff] = useState(false);

    const [loading, setLoading] = useState(false);
    const handleRegister = ()=>{
        if(!isStaff){
            setLoading(true)
            postCustomer({email, name, password})
            .then((isRegistered)=>{
                setLoading(false)
                if(isRegistered)
                    navigate('/Login')
            })
        } else {
            handleStaffRegister()
        }
    }
    const handleStaffRegister = ()=>{
        setLoading(true)
        postStaff({email, name, password, job_title, salary})
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
                <Grid container spacing={0}>
                    <Grid item xs ={6}>
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
                </Grid>
                {!isStaff ?
                    <Grid item xs ={6}>
                    <div className="Form">
                        {/* Add new input fields for the payment billing information */}
                        <TextField
                            label="Other information?"
                            type='password'
                            value={password}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setPassword(event.target.value);
                            }}
                        />
                    </div>
                    </Grid>
                :
                    <Grid item xs ={6}>
                        <div className="Form">
                            <TextField
                                label="Job Title"
                                value={job_title}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setJob_title(event.target.value);
                                }}
                            />
                        </div>
                        <div className="Form">
                            <TextField
                                label="Salary"
                                value={salary}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setSalary(event.target.value);
                                }}
                            />
                        </div>
                        <div className="Form">
                            <TextField
                                label="Staff Code"
                                value={staffCode}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setStaffCode(event.target.value);
                                }}
                            />
                        </div>
                    </Grid>
                }
                </Grid>
                </div>
                <div>
                    <Button onClick={()=>{navigate('/Login')}}>Cancel</Button>
                    <Button onClick={handleRegister}>Register</Button>
                </div>
                
                <div>
                    <FormControlLabel control={<Checkbox onClick = {()=>{setIsStaff(!isStaff)}} checked = {isStaff}/>} label="Are you a Staff Member?" />
                </div>
                </Paper>
        </div>
    );
}

export default RegisterPage;