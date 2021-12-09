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

const ResetPassword = (props) => {
    const classes = useStyles();
    const [email, setEmail] = useState('');


    const handleSubmit = e => {
        e.preventDefault();
        if (email==email){
            const data = {
                email
            }
            props.onResetPassword(data)
            props.history.push('/login')
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

            <div>
                <Button type="submit" variant="contained" >
                    Reset Password
                </Button>
            </div>
        </form>
    );
};

const mapDispatchToProps = (dispatch) =>{
    return {
        onResetPassword: (data) => dispatch(actionCreators.resetPassword(data))
    };
}

export default connect(null, mapDispatchToProps)(withRouter(ResetPassword));
