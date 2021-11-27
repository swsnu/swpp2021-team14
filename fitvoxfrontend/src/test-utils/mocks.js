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

const getstatisticsReducer = jest.fn(
    initialState => (state=initialState, action)=>{
        return {...initialState.statistics}
    }
);


const history = createBrowserHistory()
const middlewares = [thunk, routerMiddleware(history)]

export const getMockStore = (initialState)=> {

    const loginReducer = getLoginReducer(initialState);
    const workoutReducer = getworkoutReducer(initialState);
    const exerciseReducer = getexerciseReducer(initialState);
    const settingReducer = getsettingReducer(initialState);
    const statisticsReducer = getstatisticsReducer(initialState);

    const reducer = combineReducers({
        login: loginReducer,
        workout: workoutReducer,
        exercise: exerciseReducer,
        setting: settingReducer,
        statistics: statisticsReducer,
        router: connectRouter(history)
    })

    return createStore(reducer, applyMiddleware(...middlewares))
}

export const stubInitialState = {
    exercise: {
        exerciseList: [
            {
                "id": 0,
                "muscleType": "Neck",
                "exerciseType": "Neck Raise",
                "name": "Neck Raise",
                "hardness": "1;2;3;",
                "isFavorite": true,
                "tags": {
                    "tags": [
                        "#Neck_Raise",
                    ]
                },
                "oneRms": [
                    {
                        date: 20211126,
                        value: 120.0001
                    },
                    {
                        date: 20211125,
                        value: 130.0001
                    } 
                ],
                "volumes": [
                    {
                        date: 20211126,
                        value: 300
                    },
                    {
                        date: 20211125,
                        value: 240
                    }
                ]
            },
            {
                "id": 1,
                "muscleType": "Neck",
                "exerciseType": "Neck Raise",
                "name": "Neck Raise Side",
                "hardness": "1;2;3;",
                "isFavorite": true,
                "tags": {
                    "tags": [
                        "#Neck_Raise",
                        "#Side"
                    ]
                },
                "oneRms": [
                    {
                        date: 20211127,
                        value: 170
                    },
                    {
                        date: 20211125,
                        value: 170
                    },
                ],
                "volumes": [
                    {
                        date: 20211127,
                        value: 400
                    },
                    {
                        date: 20211125,
                        value: 420
                    },
                ]
            },
            {   
                "id": 2,
                "muscleType": "Trapezius",
                "exerciseType": "Y-Raise",
                "name": "Y-Raise: Dumbbell",
                "hardness": "2;3;",
                "isFavorite": false,
                "tags": {
                    "tags": [
                        "#Dumbbell",
                    ]
                }
            },
        ],
    }
};