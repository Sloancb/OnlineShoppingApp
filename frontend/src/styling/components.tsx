import { Button, Card, CardContent, CircularProgress, TextField, Paper as basePaper, styled } from '@mui/material';

export const Paper = styled(basePaper)(({ theme }) => ({
    padding: theme.spacing(2),
    elevation: 10,
    ...theme.typography.body2,
    textAlign: 'center', 
  }));