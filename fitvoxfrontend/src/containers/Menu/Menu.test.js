import React from 'react';
import {mount, shallow} from 'enzyme';
import Menu from "./Menu";
import { Provider } from 'react-redux';
import { Button, Box } from '@mui/material';
import { history } from '../../store/store';
import { Route, Switch, Router } from 'react-router-dom';
import {createStore} from 'redux';
import thunk from 'redux-thunk';
import { applyMiddleware } from 'redux';


const stubInitialState = {
    onToggle: true,
    page: ""
}
const mockStore = createStore((state, action) => state, stubInitialState, applyMiddleware(thunk));
describe("Test <Menu/>", () => {
    let menu;
    const makeMenu = (pageName) => {
        menu = (
            <Provider store = {mockStore}>
                <Router history = {history}>
                    <Menu page = {pageName}/>
                </Router>
            </Provider>
        )
    }
    it ('should render without error', () => {
        makeMenu("")
        const component = mount(menu);
        const wrapper = component.find('.Menu');
        expect(wrapper.length).toBe(3);
    })

    it ('should redirect to several pages', () => {
        const spyPush = jest.spyOn(history, 'push');
        makeMenu("");
        const component = mount(menu);
        const wrapper = component.find(Button).at(0);
        const instance = component.find(Menu.WrappedComponent).instance();
        wrapper.simulate('click');
        expect(instance.state.onToggle).toBe(true);
        expect(component.find(Button).length).toBe(6);
        const main_button = component.find(Button).at(2)
        const setting_button = component.find(Button).at(3)
        const info_button = component.find(Button).at(4)
        const exercise_list_button = component.find(Button).at(5);
        main_button.simulate('click')
        expect(spyPush).toBeCalledWith('/main')
        setting_button.simulate('click')
        expect(spyPush).toBeCalledWith('/setting')
        info_button.simulate('click')
        expect(spyPush).toBeCalledWith('/user-info')
        exercise_list_button.simulate('click')
        expect(spyPush).toBeCalledWith('/exercise_list')
        wrapper.simulate('click');
        expect(instance.state.onToggle).toBe(false);
    })

    it('should render 3 buttons for main page', () => {
        makeMenu('main')
        const component = mount(menu);
        const wrapper = component.find(Button).at(0);
        wrapper.simulate('click');
        expect(component.find(Button).length).toBe(5);
    })

    it('should render 3 buttons for setting page', () => {
        makeMenu('setting')
        const component = mount(menu);
        const wrapper = component.find(Button).at(0);
        wrapper.simulate('click');
        expect(component.find(Button).length).toBe(5);
    })

    it('should render 3 buttons for user information page', () => {
        makeMenu('info')
        const component = mount(menu);
        const wrapper = component.find(Button).at(0);
        wrapper.simulate('click');
        expect(component.find(Button).length).toBe(5);
    })

    it('should render 3 buttons for exercise list page', () => {
        makeMenu('exercise_list')
        const component = mount(menu);
        const wrapper = component.find(Button).at(0);
        wrapper.simulate('click');
        expect(component.find(Button).length).toBe(5);
    })
}) 