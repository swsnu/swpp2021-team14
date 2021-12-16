import * as actionTypes from '../actionTypes';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export const getSetting_ = (data) => {
    return {
        type: actionTypes.GET_SETTING,
        hardness: data.hardness,
        breaktime: data.breaktime
    }
}

export const getSetting = () => {
    return (dispatch) => {
        axios
            .get('/api/psetting/')
            .then((res) => dispatch(getSetting_(res.data)));
    };
}

export const changeSetting_ = (data) => {
    return {
        type: actionTypes.CHANGE_SETTING,
        hardness: data.hardness,
        breaktime: data.breaktime
    }
}

export const changeSetting = (data) => {
    return (dispatch) => {
        axios.put('/api/psetting/', data).then(res => {
            alert("Changed Setting Saved!");
            dispatch(changeSetting_(res.data))
        }).catch(err => alert("Failed to Change setting!"))
    }
}