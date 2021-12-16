import * as actionTypes from '../../actions/actionTypes';

const initState = { hardness: null, minute: 1, second: 0}

export default function settingReducer(state = initState, action) {
    const{type, hardness, breaktime} = action;
    switch (type) {
        case actionTypes.GET_SETTING: {
            const second = breaktime%60;
            const minute = (breaktime-second)/60;
            return {...state, hardness, second, minute};
        }
        case actionTypes.CHANGE_SETTING: {
            const second = breaktime%60;
            const minute = (breaktime-second)/60;
            return {...state, hardness, second, minute};
        }
        default:
            return state;
    }
}