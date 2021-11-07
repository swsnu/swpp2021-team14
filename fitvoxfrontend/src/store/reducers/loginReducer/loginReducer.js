import * as actionTypes from '../../actions/actionTypes';

const initState = { authenticated: false, createAccount: true };

export default function loginReducer(state = initState, action) {
    const{type, authenticated, currentUser} = action;
    switch (type) {
        case actionTypes.LOGIN: {
            return {...state, authenticated, currentUser};
        }
        case actionTypes.LOGOUT: {
            return {...state, authenticated, currentUser};
        }
        case actionTypes.CREATEACCOUNT:{
            return {...state, createAccount: true}
        }
        case actionTypes.FAILCREATEACCOUNT:{
            return {...state, createAccount: false}
        }
        default:
            return state;
    }
}