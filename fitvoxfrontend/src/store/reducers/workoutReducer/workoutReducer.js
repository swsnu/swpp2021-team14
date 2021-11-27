import * as actionTypes from '../../actions/actionTypes'
const initState = {workoutList: null, workoutEntries: []}

export default function workoutReducer(state=initState, action){
    switch (action.type){
        case actionTypes.GET_WORKOUT_ENTRIES:{
            return {...state, workoutEntries: action.workoutEntries};
        }
        default:
            return state;
    }
}