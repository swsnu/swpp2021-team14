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

import {ButtonBase, Paper, TextField} from '@mui/material'
import {OutlinedInput} from '@mui/material'

let stubInitialState = {}

const mockStore = createStore((state, action) => state,
                            stubInitialState,
                            applyMiddleware(thunk));

describe("Test <TimeframeStatistics />", () => {
    let timeStats;

    beforeEach(() => {
        timeStats = (
            <LocalizationProvider dateAdapter = {AdapterDateFns}>
                <Provider store = {mockStore}>
                    <Router history = {history}>
                        <Route path = "/" exact component = {TimeframeStatistics}/>
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

})