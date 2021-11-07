import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import * as actionCreators from '../../store/actions/index'
import {withRouter} from "react-router";
import {connect} from "react-redux";

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

    const handleSubmit = e => {
        e.preventDefault();
        if(password==passwordchk&&password.length>=6){
            const data = {
                email,
                password,
                username,
                'hardness': 'home training',
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

const mapStateToProps = (state) =>{
    return {
        accountCreated: state.login.createAccount
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CreatAccount));