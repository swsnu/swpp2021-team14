import * as actionTypes from '../actionTypes';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

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

export const reset_password = (email) => async dispatch =>{
    const config = {
        headers:{
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ email });

    try {
        await axios.post(`/auth/users/reset_password/`, body, config);
        dispatch({
            type: actionTypes.PASSWORD_RESET_SUCCESS
        });
    } catch (err) {
        dispatch({
            type: actionTypes.PASSWORD_RESET_FAIL
        });
    }
}

export const reset_password_confirm = (uid, token, new_password, re_new_password) => async dispatch => {
    const config = {
        headers:{
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ uid, token, new_password, re_new_password});

    try {
        await axios.post(`/auth/users/reset_password_confirm/`, body, config);
        dispatch({
            type: actionTypes.PASSWORD_RESET_CONFIRM_SUCCESS
        });
    } catch (err) {
        dispatch({
            type: actionTypes.PASSWORD_RESET_CONFIRM_FAIL
        });
    }
}