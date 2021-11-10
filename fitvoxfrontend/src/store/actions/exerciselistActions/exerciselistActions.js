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