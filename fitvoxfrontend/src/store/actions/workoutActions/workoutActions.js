import * as actionTypes from '../actionTypes';
import axios from 'axios';

export const getWorkout_ = (data) =>{
    return {
        type: actionTypes.GET_WORKOUT_ENTRIES,
        workoutEntries: data
    }
}

export const getWorkout = (date) =>{
    const url = '/api/workout_detail/' + date + '/';
    return dispatch=>{
        axios.get(url).then(res=> dispatch(getWorkout_(res.data)))
    }
}

export const addWorkout = (date, id) =>{
    const data = {date, id};
    console.log(data);
    return dispatch=>{
        axios.post('/api/workout_entry/', data).then(res=>dispatch(getWorkout_()))
    }
}