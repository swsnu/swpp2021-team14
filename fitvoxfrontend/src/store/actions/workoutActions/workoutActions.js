import * as actionTypes from '../actionTypes';
import axios from 'axios';

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

export const addWorkout = (date, id) => {
    const data = {date, id};
    return dispatch => {
        axios.post('/api/workout_entry/', data).then(res => dispatch(getWorkout_(res.data)))
    }
}

export const addSet = (data) => {
    return dispatch => {
        axios.post('/api/workout_set/', data).then(res => dispatch(getWorkout_(res.data)))
    }
}

export const editSet = (data) => {
    return dispatch => {
        axios.put('/api/workout_set/', data).then(res => dispatch(getWorkout_(res.data)))
    }
}

export const deleteSet = (id) =>{
    console.log(id)
    return dispatch => {
        const url = '/api/workout_set/'+ id;
        axios.delete(url).then(res => dispatch(getWorkout_(res.data)))
    }
}