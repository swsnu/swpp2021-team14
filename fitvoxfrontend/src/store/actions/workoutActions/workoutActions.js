import * as actionTypes from '../actionTypes';
import axios from 'axios';

export const getWorkout_ = (data) =>{
    return {
        type: actionTypes.GET_WORKOUT,
        workouts: data
    }
}

export const getWorkout = () =>{
    return dispatch=>{
        axios.get('/api/workout_detail/').then(res=> dispatch(getWorkout_(res.data)))
    }
}