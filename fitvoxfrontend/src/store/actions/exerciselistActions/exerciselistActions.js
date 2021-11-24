import * as actionTypes from '../actionTypes';
import axios from 'axios';
import {createAccount_} from "../loginActions/loginActions";

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
    alert("Exercise Added Successfully!")
    return{
        type: actionTypes.ADD_EXERCISE
    }
}

export const addExercise = (data) =>{
    return (dispatch) =>{
        axios.post('/api/exercise_list/', data).then((res)=>dispatch(addExercise_()))
    }
}

export const checkFavorite = (id) =>{
    return dispatch =>{
        axios.put('/api/exercise_list/', id).then((res)=>dispatch(getExerciseList_(res.data)))
    }
}
