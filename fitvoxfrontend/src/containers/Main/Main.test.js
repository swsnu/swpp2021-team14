import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { connectRouter, ConnectedRouter } from 'connected-react-router';
import { Route, Redirect, Switch } from 'react-router-dom';
import {Button} from "@mui/material"

import Main from './Main';
import { getMockStore } from '../../test-utils/mocks';
import { history } from '../../store/store';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import StaticDatePicker from '@mui/lab/StaticDatePicker';


jest.mock('../../components/Calendar/Calendar', () => {
    return props => {
        return (
            <div className = "spyCalendar">
                {props.year}.{props.month}
            </div>
        );
    };
});


const stubInitialState = {
    year: 2021,
    month: 10,
};

const mockStore = getMockStore(stubInitialState);

describe('<Main />', () => {
    let main;
    beforeEach(() => {
        main = (
            <LocalizationProvider dateAdapter = {AdapterDateFns}>
                <Provider store ={mockStore}>
                    <ConnectedRouter history = {history}>
                        <Switch>
                            <Route path = "/" exact
                                component = {Main} />
                        </Switch>
                    </ConnectedRouter>
                </Provider>  
            </LocalizationProvider>
        );
    });

    it ('should render without error', () => {
        const component = mount(main);
        expect(component.find(".Main").length).toBe(3)
    })

    it ("should call clicking timeframe-statistics button", () => {
        const spyPush = jest.spyOn(history, 'push').mockImplementation(() => {})
        const component = mount(main);
        const wrapper = component.find(Button).at(1);
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

    it ('should handle staticDatePicker properly', () => {
        const component = mount(main)
        const date_picker = component.find(StaticDatePicker);
        const instance = component.find(Main.WrappedComponent).instance()
        date_picker.simulate('change', new Date(2021, 3, 1))
        //expect(instance.state.value).toEqual(new Date(2021, 3, 1))
    })
}) 