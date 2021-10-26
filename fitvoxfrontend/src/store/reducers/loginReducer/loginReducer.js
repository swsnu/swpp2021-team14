import * as actionTypes from '../../actions/actionTypes';

const initState = { authenticated: false };

export default function loginReducer(state = initState, action) {
    const{type, authenticated, currentUser} = action;
    switch (type) {
        case actionTypes.LOGIN: {
            return {...state, authenticated, currentUser};
        }
        case actionTypes.LOGOUT: {
            return {...state, authenticated, currentUser};
        }
        default:
            return state;
    }
}