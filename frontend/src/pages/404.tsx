import React from 'react';
import { Button, Typography, makeStyles } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {Paper} from '../styling/components.tsx';

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className={"container"}>

            <Typography variant="h1" >
                404
            </Typography>
            <Typography variant="h4" align="center">
                Oops! Page not found.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    // Handle button click event
                    navigate('/');
                }}
            >
                Go back to Home
            </Button>
        </div>
    );
};

export default NotFoundPage;