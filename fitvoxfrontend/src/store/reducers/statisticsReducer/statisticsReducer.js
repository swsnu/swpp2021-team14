import * as actionTypes from '../../actions/actionTypes'
const initState = {bodyInfo: [], benchPress: [], squat: [], deadLift: []}

export default function statisticsReducer(state=initState, action){
    switch (action.type){
        case actionTypes.GET_BODY_INFO:{
            return {...state, bodyInfo: action.bodyInfo};
        }
        default:
            return state;
    }
}