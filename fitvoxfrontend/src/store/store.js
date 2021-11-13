import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
//import { stubInitialState } from '../test-utils/mocks';
//import { composeWithDevTools } from "redux-devtools-extension";

import reducer from './reducers'

export const history = createBrowserHistory();
const rootReducer = combineReducers({
    ...reducer,
    router: connectRouter(history),
});

export const middlewares = [thunk, routerMiddleware(history)]

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer,
    composeEnhancers(
        applyMiddleware(...middlewares)));

export default store;
//export const mockStore = createStore(rootReducer, stubInitialState, composeWithDevTools(applyMiddleware(thunk)));
