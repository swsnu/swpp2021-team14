import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Route, Switch, Router } from 'react-router-dom';
import {Button, ButtonBase} from "@mui/material"

import Main from './Main';
import { history } from '../../store/store';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import StaticDatePicker from '@mui/lab/StaticDatePicker';

import {createStore} from 'redux';
import thunk from 'redux-thunk';
import { applyMiddleware } from 'redux';

import { IconButton } from '@mui/material';
import moment from 'moment';
import * as actionCreators from '../../store/actions/workoutActions/workoutActions'


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

describe('<Main />', () => {
    let main;
    beforeEach(() => {
        main = (
            <LocalizationProvider dateAdapter = {AdapterDateFns}>
                <Provider store ={mockStore}>
                    <Router history = {history}>
                        <Switch>
                            <Route path = "/" exact
                                component = {Main} />
                        </Switch>
                    </Router>
                </Provider>  
            </LocalizationProvider>
        );
    });

    beforeAll(() => {
        // add window.matchMedia
        // this is necessary for the date picker to be rendered in desktop mode.
        // if this is not provided, the mobile mode is rendered, which might lead to unexpected behavior
        Object.defineProperty(window, "matchMedia", {
          writable: true,
          value: (query) => ({
            media: query,
            // this is the media query that @material-ui/pickers uses to determine if a device is a desktop device
            matches: query === "(pointer: fine)",
            onchange: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            addListener: () => {},
            removeListener: () => {},
            dispatchEvent: () => false,
          }),
        });
    })
      
    afterAll(() => {
        delete window.matchMedia;
    });

    const enumerateDaysBetweenDates = function(startDate, endDate) {
        var dates = [];
    
        var currDate = moment(startDate).startOf('day');
        var lastDate = moment(endDate).startOf('day');
        dates.push(currDate.clone().format("YYYYMMDD"))
        while(currDate.add(1, 'days').diff(lastDate) < 0) {
            dates.push(currDate.clone().format("YYYYMMDD"));
        }
        return dates;
    };

    it ('should render without error', () => {
        const component = mount(main);
        expect(component.find(".Main").length).toBe(3)
    })

    it ("should call clicking timeframe-statistics button", () => {
        const spyPush = jest.spyOn(history, 'push').mockImplementation(() => {})
        const component = mount(main);
        const wrapper = component.find(IconButton).at(1);
        wrapper.simulate('click');
        expect(spyPush).toBeCalledWith("/time_stats")
    })

    it('should call workout button properly', () => {
        const spyPush = jest.spyOn(history, 'push').mockImplementation(() => {})
        const component = mount(main)
        const wrapper = component.find(Button).at(0);
        const value = new Date();
        let year = value.getFullYear();
        let month = value.getMonth() + 1;
        let date = value.getDate();
        if (month < 10) {
            month = "0"+month;
        }
        if (date < 10) {
            date = "0" + date;
        }
        wrapper.simulate('click')
        expect(spyPush).toBeCalledWith('/workout/' + year + month + date)
    })

    it ('should render workout page properly', () => {
        const spyPush = jest.spyOn(history, 'push').mockImplementation(() => {})
        const component = mount(main)
        const wrapper = component.find(Button).at(0);
        const instance = component.find(Main.WrappedComponent).instance()
        instance.setState({value: new Date(2021, 3, 1)})
        wrapper.simulate('click')
        expect(spyPush).toBeCalledWith("/workout/20210401")
    })

    it('should handle get workout button', () => {
        const component = mount(main)
        const instance = component.find(Main.WrappedComponent).instance()
        const wrapper = component.find(Button).at(1);
        instance.setState({value: new Date(2021, 11, 7)})
        wrapper.simulate('click')
        expect(instance.state.numSets[0]).toBe(3)
    })

    it ('should handle staticDatePicker properly', () => {
        const component = mount(main)
        const date_picker = component.find(StaticDatePicker);
        const instance = component.find(Main.WrappedComponent).instance()
        const button_asdf = date_picker.find(ButtonBase).at(4)
        button_asdf.simulate('click')
        const current_date = new Date()
        expect(instance.state.value.getFullYear()).toBe(current_date.getFullYear())
        expect(instance.state.value.getMonth()).toBe(current_date.getMonth())
        expect(instance.state.value.getDate()).toBe(1)
        date_picker.find(ButtonBase).at(0).simulate('click')
    })

    it('should handle get workout summary properly', () => {
        const spyGetWorkoutSummary = jest.spyOn(actionCreators, 'getWorkoutSummary').mockImplementation(() => {
            return (dispatch) => {}
        })
        const component = mount(main)
        const date_picker = component.find(StaticDatePicker);
        const instance = component.find(Main.WrappedComponent).instance()
        const current_date = new Date()
        const prev_month_button = date_picker.find(ButtonBase).at(2)
        prev_month_button.simulate('click')
        component.find(StaticDatePicker).find(ButtonBase).at(4).simulate('click')
        let startDate = new Date(current_date.getFullYear(), current_date.getMonth(), 1)
        let endDate = new Date(current_date.getFullYear(), current_date.getMonth() + 1, 1)
        let dataset = enumerateDaysBetweenDates(startDate, endDate)
        expect(spyGetWorkoutSummary).toBeCalledWith(dataset)
        expect(instance.state.prev_date.getMonth()).toEqual(current_date.getMonth() > 0 ? current_date.getMonth()-1 : 11)
    })
}) 