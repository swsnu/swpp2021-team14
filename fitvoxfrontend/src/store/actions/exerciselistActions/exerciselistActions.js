import * as actionTypes from '../actionTypes';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export const getExerciseList_ = (data) => {
    return {
        type: actionTypes.GET_EXERCISE_LIST,
        exerciseList: data
    }
}

export const getExerciseList = () => {
    return (dispatch) => {
        axios.get('/api/exercise_list/').then((res) => dispatch(getExerciseList_(res.data)))
    }
}

export const addExercise_ = () =>{
    return{
        type: actionTypes.ADD_EXERCISE
    }
}

export const addExercise = (data) =>{
    return (dispatch) =>{
        axios.post('/api/exercise_list/', data).then((res)=>dispatch(addExercise_()))
    }
}

export const changeTags = (data) => {
    return dispatch => {
        axios.put('/api/exercise_list/', data).then((res) => dispatch(getExerciseList_(res.data)))
    }
}

export const checkFavorite = (data) =>{
    return dispatch =>{
        axios.put('/api/exercise_list/', data).then((res)=>dispatch(getExerciseList_(res.data)))
    }
}
