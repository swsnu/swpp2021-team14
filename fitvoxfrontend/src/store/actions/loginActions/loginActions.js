import * as actionTypes from '../actionTypes';
import axios from 'axios';

export const getLogin_ = (data) => {
    return {
        type: actionTypes.LOGIN,
        authenticated: true,
        currentUser: data.name,
    };
};

export const getLogin = () => {
    return (dispatch) => {
        axios
            .put('/user/1', {
                email: 'swpp@snu.ac.kr',
                password: 'iluvswpp',
                name: 'Software Lover',
                logged_in: true,
            })
            .then((res) => dispatch(getLogin_(res.data)));
    };
};

export const getLogout_ = () => {
    return { type: actionTypes.LOGOUT, authenticated: false, currentUser: null };
};

export const getLogout = () => {
    return (dispatch) => {
        axios
            .put('/user/1', {
                email: 'swpp@snu.ac.kr',
                password: 'iluvswpp',
                name: 'Software Lover',
                logged_in: false,
            })
            .then((res) => dispatch(getLogout_()));
    };
};

export const maintainLogin = () => {
    return (dispatch) => {
        axios.get('/user/1').then((res) => {
            if (res.data.logged_in) return dispatch(getLogin_(res.data));
            else return dispatch(getLogout_());
        });
    };
};
