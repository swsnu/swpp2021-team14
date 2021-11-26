import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import * as actionTypes from '../store/actions/actionTypes'


const getLoginReducer = jest.fn(
    initialState =>(state=initialState, action) =>{
        switch (action.type){
            default:
                return {...initialState.login}
        }
    }
)


const history = createBrowserHistory()
const middlewares = [thunk, routerMiddleware(history)]

export const getMockStore = (initialState)=> {

    const loginReducer = getLoginReducer(initialState)

    const reducer = combineReducers({
        login: loginReducer,
        router: connectRouter(history)
    })

    const mockStore = createStore(reducer, applyMiddleware(...middlewares));
    return mockStore
}

export const stubInitialState = {
    login: { authenticated: true, currentUser: 'test' },
};