import * as actionTypes from '../actionTypes';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export const getWorkout_ = (data) => {
    return {
        type: actionTypes.GET_WORKOUT_ENTRIES,
        workoutEntries: data
    }
}

export const getWorkout = (date) => {
    const url = '/api/workout_detail/' + date + '/';
    return dispatch => {
        axios.get(url).then(res => dispatch(getWorkout_(res.data)))
    }
}

export const getBodyInfo_ = (data)=>{
    return {
        type: actionTypes.GET_BODY_INFO,
        bodyInfo: data
    }
}

export const getBodyInfo = () =>{
    return dispatch =>{
        axios.get('/api/body_info/').then(res=>dispatch(getBodyInfo_(res.data)))
    }
}

export const addBodyInfo = (data) =>{
    const url = '/api/workout_detail/' + data.date + '/';
    return dispatch =>{
        axios.put(url, data).then(res=>dispatch(getBodyInfo_(res.data)))
    }
}

export const addWorkout = (date, id) => {
    const data = {date, id};
    return dispatch => {
        axios.post('/api/workout_entry/', data).then(res => dispatch(getWorkout_(res.data)))
    }
}

export const deleteWorkout = (id) => {
    const url = '/api/workout_entry/' + id + '/';
    return dispatch => {
        axios.delete(url).then(res => dispatch(getWorkout_(res.data)))
    }
}


export const addSet = (data) => {
    return dispatch => {
        axios.post('/api/workout_set/', data).then(res => dispatch(getWorkout_(res.data)))
    }
}

export const editSet = (data) => {
    const url = '/api/workout_set/' + data.id + '/';
    return dispatch => {
        axios.put(url, data).then(res => dispatch(getWorkout_(res.data)))
    }
}

export const deleteSet = (id) => {
    return dispatch => {
        const url = '/api/workout_set/' + id + '/';
        axios.delete(url).then(res => {
            dispatch(getWorkout_(res.data))
        })
    }
}

export const checkVoicePartner = (id) =>{
    return dispatch=>{
        const url = '/api/voice_partner/' + id + '/';
        axios.put(url).then(res=>{
            dispatch(getWorkout_(res.data))
        })
    }
}

export const startVoicePartner_ = (data)=>{
    console.log(data)
    return {
        type:actionTypes.START_VOICE_PARTNER,
        data
    };
}

export const startVoicePartner = (date) =>{
    return dispatch=>{
        const url = '/api/voice_partner/' + date + '/';
        axios.get(url).then(res=>{
            dispatch(startVoicePartner_(res.data))
        })
    };
}