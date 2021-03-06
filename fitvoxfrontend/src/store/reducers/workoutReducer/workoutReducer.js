import * as actionTypes from '../../actions/actionTypes'

const initState = {workoutList: [], workoutEntries: [], voicePartner:[], wav: null}

export default function workoutReducer(state=initState, action){
    switch (action.type){
        case actionTypes.GET_WORKOUT_ENTRIES:{
            return {...state, workoutEntries: action.workoutEntries};
        }
        case actionTypes.START_VOICE_PARTNER:{
            return {...state, voicePartner: action.data};
        }
        case actionTypes.END_VOICE_PARTNER:{
            return {...state, voicePartner: []}
        }
        case actionTypes.GET_WORKOUT_SUMMARY:{
            return {...state, workoutList: action.data}
        }
        default:
            return state;
    }
}