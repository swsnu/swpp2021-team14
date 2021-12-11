import React from 'react';
import {mount} from 'enzyme';
import Menu from "./Menu";
import { Provider } from 'react-redux';
import { IconButton, ListItem, Drawer } from '@mui/material';
import { history } from '../../store/store';
import { Router } from 'react-router-dom';
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
        const wrapper = component.find(IconButton).at(0);
        const instance = component.find(Menu.WrappedComponent).instance();
        wrapper.simulate('click');
        expect(instance.state.left).toBe(true);
        expect(component.find(ListItem).length).toBe(4);
        const main_button = component.find(ListItem).at(0)
        const setting_button = component.find(ListItem).at(1)
        const info_button = component.find(ListItem).at(2)
        const exercise_list_button = component.find(ListItem).at(3);
        main_button.simulate('click')
        expect(spyPush).toBeCalledWith('/main')
        setting_button.simulate('click')
        expect(spyPush).toBeCalledWith('/setting')
        info_button.simulate('click')
        expect(spyPush).toBeCalledWith('/user-info')
        exercise_list_button.simulate('click')
        expect(spyPush).toBeCalledWith('/exercise_list')
        component.find(IconButton).at(1).simulate('click');
        expect(instance.state.left).toBe(false);
    })

    it('should render 3 buttons for main page', () => {
        makeMenu('main')
        const component = mount(menu);
        const wrapper = component.find(IconButton).at(0);
        wrapper.simulate('click');
        expect(component.find(ListItem).length).toBe(3);
    })

    it('should render 3 buttons for setting page', () => {
        makeMenu('setting')
        const component = mount(menu);
        const wrapper = component.find(IconButton).at(0);
        wrapper.simulate('click');
        expect(component.find(ListItem).length).toBe(3);
    })

    it('should render 3 buttons for user information page', () => {
        makeMenu('info')
        const component = mount(menu);
        const wrapper = component.find(IconButton).at(0);
        wrapper.simulate('click');
        expect(component.find(ListItem).length).toBe(3);
    })

    it('should render 3 buttons for exercise list page', () => {
        makeMenu('exercise_list')
        const component = mount(menu);
        const wrapper = component.find(IconButton).at(0);
        wrapper.simulate('click');
        expect(component.find(ListItem).length).toBe(3);
    })

    it('should handle key inputs properly', () => {
        makeMenu("");
        const component = mount(menu);
        const wrapper = component.find(IconButton).at(0);
        const instance = component.find(Menu.WrappedComponent).instance();
        wrapper.simulate('click');
        const drawer = component.find(Drawer);
        //console.log(drawer.debug())
        drawer.simulate('close', {keyCode: 16, key: "Shift"});
        expect(instance.state.left).toBe(true);
        drawer.simulate("close", {keyCode: 16, key: "Shift"})
        drawer.simulate("close", {keyCode: 9, key: "Tab"})
        
    })
})