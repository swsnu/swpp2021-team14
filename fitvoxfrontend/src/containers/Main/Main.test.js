import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { connectRouter, ConnectedRouter } from 'connected-react-router';
import { Route, Redirect, Switch } from 'react-router-dom';

import Main from './Main';
import { getMockStore } from '../../test-utils/mocks';
import { history } from '../../store/store';

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
            <Provider store ={mockStore}>
                <ConnectedRouter history = {history}>
                    <Switch>
                        <Route path = "/" exact
                            component = {Main} />
                    </Switch>
                </ConnectedRouter>
            </Provider>
        );
    });

    it ('should call clicking prev', () => {
        const component = mount(main);
        const wrapper = component.find('button').at(0);
        const MainInstance = component.find(Main.WrappedComponent).instance();
        for (let i = stubInitialState.month -1; i> 0; i--){
            wrapper.simulate('click');
            expect(MainInstance.state.year).toEqual(2021);
            expect(MainInstance.state.month).toEqual(i);
        }
        wrapper.simulate('click');
        expect(MainInstance.state.year).toEqual(2020);
        expect(MainInstance.state.month).toEqual(12);
        wrapper.simulate('click');
        expect(MainInstance.state.year).toEqual(2020);
        expect(MainInstance.state.month).toEqual(11);
    });

    it ('should call clicking next', () => {
        const component = mount(main);
        const wrapper = component.find('button').at(1);
        const MainInstance = component.find(Main.WrappedComponent).instance();
        for (let i = stubInitialState.month + 1; i <= 12; i++){
            wrapper.simulate('click');
            expect(MainInstance.state.year).toEqual(2021);
            expect(MainInstance.state.month).toEqual(i);
        }
        wrapper.simulate('click');
        expect(MainInstance.state.year).toEqual(2022);
        expect(MainInstance.state.month).toEqual(1);
        wrapper.simulate('click');
        expect(MainInstance.state.year).toEqual(2022);
        expect(MainInstance.state.month).toEqual(2);
    });

    it ("should call clicking timeframe-statistics button", () => {
        const mockClick = jest.fn();
        const component = mount(main);
        console.log(component);
        const wrapper = component.find(".timeframe-statistics-button");
        wrapper.simulate('click');
        expect(mockClick).toHaveBeenCalledTimes(0);
    })
}) 