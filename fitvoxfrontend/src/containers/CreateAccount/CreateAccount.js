import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import * as actionCreators from '../../store/actions/index'
import {withRouter} from "react-router";
import {connect} from "react-redux";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing(3),

        '& .MuiTextField-root': {
            margin: theme.spacing(3),
            width: '270px',
        },
        '& .MuiButtonBase-root': {
            margin: theme.spacing(1),
        },
    },
}));

const CreatAccount = (props) => {
    const classes = useStyles();
    // create state variables for each input
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');
    const [passwordchk, setChk] = useState('');
    const [username, setUsr] = useState('');
    const [hardness, setHard] = useState('');

    const handleSubmit = e => {
        e.preventDefault();
        if(password==passwordchk&&password.length>=6){
            const data = {
                email,
                password,
                "name": username,
                "hardness" : hardness,
                "logged_in": false
            }
            props.onCreateAccount(data)
            props.history.push('/login')
        }
        else if(password.length<6){
            alert("Password is too short!");
        }
        else if(password!=passwordchk){
            alert("Passwords doesn't match! Please check again")
        }

    };
    
    const handleChange = (event) => {
        setHard(event.target.value);
    };

    return (
        <form className={classes.root} onSubmit={handleSubmit}>
            <TextField
                label="Email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <TextField
                label="Password"
                type="password"
                required
                value={password}
                onChange={e => setPass(e.target.value)}
            />
            <TextField
                label="Confirm Password"
                type="password"
                required
                value={passwordchk}
                onChange={e => setChk(e.target.value)}
            />
            <TextField
                label="Username"
                required
                value={username}
                minLength="2"
                onChange={e => setUsr(e.target.value)}
            />
            <FormControl sx={{ m: 1, width: 270 }}>
            <InputLabel id="demo-simple-select-label">Hardness</InputLabel>
            <Select
                labelId="hardness"
                id="hardness"
                value={hardness}
                label="Hardness"
                onChange={handleChange}
            >
                <MenuItem value={1}>Home Training</MenuItem>
                <MenuItem value={2}>Gym Beginner</MenuItem>
                <MenuItem value={3}>Expert</MenuItem>
            </Select>
            </FormControl>

            <div>
                <Button type="submit" variant="contained" >
                    Create Account
                </Button>
            </div>
        </form>
    );
};

const mapDispatchToProps = (dispatch) =>{
    return {
        onCreateAccount: (data) => dispatch(actionCreators.createAccount(data))
    };
}

export default connect(null, mapDispatchToProps)(withRouter(CreatAccount));
