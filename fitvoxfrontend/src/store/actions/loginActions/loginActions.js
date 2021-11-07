import * as actionTypes from '../actionTypes';
import axios from 'axios';

export const getLogin_ = (data) => {
    return {
        type: actionTypes.LOGIN,
        authenticated: true,
        currentUser: data.name,
    };
};

export const getLogin = (data) => {
    return (dispatch) => {
        axios
            .post('/api/signin/', data)
            .then((res) => dispatch(getLogin_(res.data)))
            .catch((err) => {
                alert('Username or Password is Wrong')
            });
    };
};

export const getLogout_ = () => {
    return { type: actionTypes.LOGOUT, authenticated: false, currentUser: null };
};

export const getLogout = () => {
    return (dispatch) => {
        axios
            .get('/api/signout/')
            .then((res) => dispatch(getLogout_()));
    };
};

export const maintainLogin = () => {
    return (dispatch) => {
        axios.get('/api/isAuth/').then((res) => {
            if (res.data.authenticated) return dispatch(getLogin_(res.data));
            else return dispatch(getLogout_());
        });
    };
};

export const failCreateAccount_ = ()=>{
    return {
        type: actionTypes.FAILCREATEACCOUNT
    }
}

export const createAccount_ = ()=>{
    return {
        type: actionTypes.CREATEACCOUNT
    }
}

export const createAccount = (userData) =>{
    return (dispatch) =>{
        axios.post('/api/signup/', userData).then((res)=> dispatch(createAccount_()))
            .catch(err =>{
                alert("Username already exists!")
                dispatch(failCreateAccount_())
            })
    }
}