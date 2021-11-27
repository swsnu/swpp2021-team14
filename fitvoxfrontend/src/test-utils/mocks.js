import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk from "redux-thunk";
import {connectRouter, routerMiddleware} from "connected-react-router";
import {createBrowserHistory} from "history";


const getLoginReducer = jest.fn(
    initialState =>(state=initialState, action) =>{
        switch (action.type){
            default:
                return {...initialState.login}
        }
    }
);

const getworkoutReducer = jest.fn(
    initialstate => (state=initialstate, action)=>{
        return {...initialstate.workout}
    }
);

const getexerciseReducer = jest.fn(
    initialstate=>(state=initialstate, action)=>{
        return {...initialstate.exercise}
    }
);

const getsettingReducer = jest.fn(
    initialState => (state=initialState, action)=>{
        return {...initialState.setting}
    }
);

const history = createBrowserHistory()
const middlewares = [thunk, routerMiddleware(history)]

export const getMockStore = (initialState)=> {

    const loginReducer = getLoginReducer(initialState);
    const workoutReducer = getworkoutReducer(initialState);
    const exerciseReducer = getexerciseReducer(initialState);
    const settingReducer = getsettingReducer(initialState);

    const reducer = combineReducers({
        login: loginReducer,
        workout: workoutReducer,
        exercise: exerciseReducer,
        setting: settingReducer,
        router: connectRouter(history)
    })

    return createStore(reducer, applyMiddleware(...middlewares))
}

export const stubInitialState = {
    login: { authenticated: true, currentUser: 'test' },
};