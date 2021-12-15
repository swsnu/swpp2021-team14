import React from 'react';
import {mount} from 'enzyme';
import { Provider } from 'react-redux';
import {history} from '../../store/store'
import {createStore} from 'redux';
import thunk from 'redux-thunk';
import { applyMiddleware } from 'redux';
import { Route, Switch, Router } from 'react-router-dom';
import TimeframeStatistics from './TimeframeStatistics';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';

import {ButtonBase, Paper, Chip, IconButton} from '@mui/material'
import moment from 'moment'

const stubInitialState = {
    workout: {
        workoutList : [
            {
                date: "20211207",
                info: {"Neck" : 3, "Chest": 4}
            },
            {
                date: "20211208",
                info: {"Neck": 3, "Back": 2, "Leg": 5}
            }
        ]
    },
    exercise: {
        exerciseList: [
            {
                "muscleType": "Neck",
                "exerciseType": "Neck Raise",
                "name": "Neck Raise",
                "hardness": "1;2;3;",
                "isFavorite": true,
                "tags": {
                    "tags": [
                        "#Neck_Raise",
                    ]
                }
            },
            {
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
                }
            },
            {
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
    year: 2021,
    month: 10,
};

const mockStore = createStore((state, action) => state,
                            stubInitialState,
                            applyMiddleware(thunk));

jest.mock('react-chartjs-2', () => ({
    Doughnut: () => null,
}));

describe("Test <TimeframeStatistics />", () => {
    let timeStats;

    beforeEach(() => {
        timeStats = (
            <LocalizationProvider dateAdapter = {AdapterDateFns}>
                <Provider store = {mockStore}>
                    <Router history = {history}>
                        <Switch>
                            <Route path = "/" exact component = {TimeframeStatistics}/>
                        </Switch>
                    </Router>
                </Provider>
            </LocalizationProvider>
        )
    })

    it ('should render without errors', () => {
        const component = mount(timeStats)
        expect(component.find('#time_stats').length).toBe(3)
    })
    
    it ('should render from mobile date picker properly', () => {
        const component = mount(timeStats)
        const wrapper = component.find('input').at(0)
        const instance = component.find(TimeframeStatistics.WrappedComponent).instance()
        wrapper.simulate('click')
        const first_button = component.find(Paper).at(1).find(ButtonBase).at(4)
        first_button.simulate('click')
        expect(instance.state.from_value.getDate()).toBe(1)
    })

    it ('should render to mobile date picker properly', () => {
        const component = mount(timeStats)
        const wrapper = component.find('input').at(1)
        const instance = component.find(TimeframeStatistics.WrappedComponent).instance()
        wrapper.simulate('click')
        const first_button = component.find(Paper).at(1).find(ButtonBase).at(4)
        first_button.simulate('click')
        expect(instance.state.to_value.getDate()).toBe(1)
    })

    it ('should render graph properly',  () => {
        const component = mount(timeStats)
        const wrapper = component.find(Chip).at(0)
        wrapper.simulate('click')
        const instance = component.find(TimeframeStatistics.WrappedComponent).instance()
        instance.setState({from_value: new Date(2021, 11, 1)})
        expect(instance.state.numSets[0]).toBe(6)
    })

    it ('should handle go back button properly', () => {
        const spyGoback = jest.spyOn(history, 'goBack').mockImplementation(() => {})
        const component = mount(timeStats)
        const wrapper = component.find(IconButton).at(1)
        wrapper.simulate('click')
        expect(spyGoback).toHaveBeenCalledTimes(1)
        
    })

    it('should maintain to date larger than from date', () => {
        const component = mount(timeStats)
        const instance = component.find(TimeframeStatistics.WrappedComponent).instance()
        const current_date = new Date()
        instance.setState({from_value: new Date(current_date.getFullYear(), current_date.getMonth() + 1, 1)})
        const wrapper2 = component.find('input').at(1)
        wrapper2.simulate('click')
        const second_button = component.find(Paper).at(1).find(ButtonBase).at(4)
        second_button.simulate('click')
        expect(instance.state.from_value.getDate()).toBe(current_date.getDate())
        expect(instance.state.to_value.getDate()).toBe(1)
    })

    it('should maintain from date smaller than to date', () => {
        const component = mount(timeStats)
        const instance = component.find(TimeframeStatistics.WrappedComponent).instance()
        const current_date = new Date()
        instance.setState({to_value: new Date(current_date.getFullYear()-1, current_date.getMonth(), 1)})
        const wrapper2 = component.find('input').at(0)
        wrapper2.simulate('click')
        const second_button = component.find(Paper).at(1).find(ButtonBase).at(5)
        second_button.simulate('click')
        expect(instance.state.from_value.getDate()).toBe(2)
        expect(instance.state.to_value.getDate()).toBe(4)
    })
})