import React from 'react';
import {mount} from 'enzyme';
import { Provider } from 'react-redux';
import * as actionCreators from '../../store/actions/settingActions/settingActions';
import {createStore} from 'redux';
import thunk from 'redux-thunk';
import { applyMiddleware } from 'redux';
import { history } from '../../store/store';
import { Route, Switch, Router } from 'react-router-dom';
import { IconButton, Button } from '@mui/material'

import UserInfo from './UserInfo';

const stubInitialState = {
    workout: {
        workoutList : [
            {
                date: "20211207",
                info: {"Neck" : 3, "Trapezius": 4}
            },
            {
                date: "20211208",
                info: {"Neck": 3, "Trapezius": 2}
            }
        ]
    },
    statistics: {
        bodyInfo: [
            {
                date: "20211207",
                bodyFat: 21,
                bodyWeight: 80,
                skeletalMuscle: 40
            },
            {
                date: "20211208",
                bodyFat: 23,
                bodyWeight: 81,
                skeletalMuscle: 41
            }
        ]
    },
    exercise: {
        exerciseList: [
            {
                "muscleType": "Leg",
                "exerciseType": "Squat",
                "name": "Squat: Barbell",
                "hardness": "1;2;3;",
                "isFavorite": true,
                "tags": {
                    "tags": [
                        "#Barbell",
                    ]
                },
                "oneRms" : [{date: "20211207", value: 210},
                    {date: "20211208", value: 220}   
                ],
                "volumes" :[
                    {date: "20211207", value: 300},
                    {date: "20211208", value: 420}
                ]
            },
            {
                "muscleType": "Back",
                "exerciseType": "Dead Lift",
                "name": "Dead Lift: Barbell, Back",
                "hardness": "1;2;3;",
                "isFavorite": true,
                "tags": {
                    "tags": [
                        "#Barbell",
                        "#Back"
                    ]
                },
                "oneRms" : [],
                "volumes" :[]
            },
            {
                "muscleType": "Chest",
                "exerciseType": "Bench Press",
                "name": "Bench Press: Barbell",
                "hardness": "2;3;",
                "isFavorite": false,
                "tags": {
                    "tags": [
                        "#Barbell",
                    ]
                },
                "oneRms" : [{date: "20211207", value: 210},
                    {date: "20211208", value: 220}   
                ],
                "volumes" :[
                    {date: "20211207", value: 300},
                    {date: "20211208", value: 420}
                ]
            },
        ],
        muscleTypes: ["Neck", "Trapezius"],
        exerciseTypes: [
            {
                "muscleType": "Neck",
                "exerciseType": "Neck Raise"
            },
            {
                "muscleType": "Trapezius",
                "exerciseType": "Y-Raise"
            },
        ]
    },
};

const mockStore = createStore((state, action) => state,
                            stubInitialState,
                            applyMiddleware(thunk));

jest.mock('react-chartjs-2', () => ({
    Line: () => null,
}));

describe("Test <UserInfo/>", () => {
    let userInfo;

    beforeEach(() => {
        userInfo = (
            <Provider store = {mockStore}>
                <Router history = {history}>
                    <Switch>
                        <Route path = "/" exact component = {UserInfo}/>
                    </Switch>
                </Router>
            </Provider>
        )
    })

    it ('should render without errors', () => {
        const component = mount(userInfo)
        const instance = component.find(UserInfo.WrappedComponent).instance()
        expect(component.find("#user_info").length).toBe(3)
        expect(instance.state.oneRM_datas).toEqual([
            [ '210.00', '220.00' ],
            [ NaN, NaN ],
            [ '210.00', '220.00' ],
            [ '420.00', '440.00' ]
        ])
        expect(instance.state.volume_datas).toEqual([
            [ '300.00', '420.00' ],
            [ NaN, NaN ],
            [ '300.00', '420.00' ],
            [ '600.00', '840.00' ]
        ])
    })

    it ("should controll mode properly", () => {
        const component = mount(userInfo)
        const instance = component.find(UserInfo.WrappedComponent).instance()
        expect(component.find(Button).length).toBe(3);
        const summaryButton = component.find(Button).at(0)
        const bodyStatsButton = component.find(Button).at(1)
        const big3Button = component.find(Button).at(2)
        summaryButton.simulate('click')
        expect(instance.state.mode).toBe("Summary")
        bodyStatsButton.simulate('click')
        expect(instance.state.mode).toBe("Body Stats")
        big3Button.simulate("click")
        expect(instance.state.mode).toBe("Big 3")
        
        const oneRMButton = component.find('#one_rm_outlined').at(0)
        oneRMButton.simulate('click')
        expect(instance.state.chartType).toBe("one_rm")
        component.find("#one_rm_contained").at(0).simulate('click')
        expect(instance.state.chartType).toBe("one_rm")
        expect(component.find("#volume_outlined").length).toBe(5)

        const volButton = component.find("#volume_outlined").at(0)
        volButton.simulate('click')
        expect(instance.state.chartType).toBe("volume")
        component.find("#volume_contained").at(0).simulate('click')
        expect(instance.state.chartType).toBe("volume")
        expect(component.find("#one_rm_outlined").length).toBe(5)
    })

    it ('should handle go back button properly', () => {
        const spyGoback = jest.spyOn(history, 'goBack').mockImplementation(() => {})
        const component = mount(userInfo)
        const wrapper = component.find(IconButton).at(1)
        wrapper.simulate('click')
        expect(spyGoback).toHaveBeenCalledTimes(1)
        
    })

})