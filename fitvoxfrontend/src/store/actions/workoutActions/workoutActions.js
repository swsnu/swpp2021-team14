import * as actionTypes from '../actionTypes';
import axios from 'axios';

export const getWorkout_ = (data) =>{
    return {
        type: actionTypes.GET_WORKOUT,
        workouts: data
    }
}

export const getWorkout = (date) =>{
    const url = '/api/workout_detail/' + date + '/';
    return dispatch=>{
        axios.get(url).then(res=> dispatch(getWorkout_(res.data)))
    }
}