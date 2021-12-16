import React from 'react';
import {mount} from 'enzyme';
import PersonalSetting from './PersonalSetting';
import { Provider } from 'react-redux';
import * as actionCreators from '../../store/actions/settingActions/settingActions';
import {createStore} from 'redux';
import thunk from 'redux-thunk';
import { applyMiddleware } from 'redux';
import { history } from '../../store/store';
import { Route, Switch, Router } from 'react-router-dom';
import Select from 'react-select';
import { IconButton } from '@mui/material'


let stubInitialState = {
    setting: {
        hardness: 1,
        minute: 3,
        second: 0,
    }
};

const mockStore = createStore((state, action) => state,
                            stubInitialState,
                            applyMiddleware(thunk));

describe("Test <PersonalSetting/>", () => {
    let psetting;
    beforeEach(() => {psetting = (
        <Provider store = {mockStore}>
            <Router history = {history}>
                <Switch>
                    <Route path = "/" exact
                        component = {PersonalSetting}/>
                </Switch>
            </Router>
        </Provider>)
    })

    it("should render withuot error", () => {
        const component = mount(psetting)
        expect(component.find(".PersonalSetting").length).toBe(1);
    })

    it("should get hardness setting", () => {
        const component = mount(psetting);
        const hard_set = component.find(Select).at(0);
        hard_set.simulate("keyDown", {keyCode: 40, key: "ArrowDown"})
        hard_set.simulate("keyDown", {keyCode: 40, key: "ArrowDown"})
        hard_set.simulate("keyDown", {keyCode: 13, key: "Enter"})
        const instance = component.find(PersonalSetting.WrappedComponent).instance()
        expect(instance.state.hardness).toBe("2");
    })

    it('should set minute and second properly', () => {
        const component = mount(psetting);
        const min_input = component.find("#min-input")
        const sec_input = component.find("#second-input")
        min_input.simulate('change', {target: {value: 2}})
        sec_input.simulate('change', {target: {value: 30}})
        const instance = component.find(PersonalSetting.WrappedComponent).instance()
        expect(instance.state.minute).toBe(2);
        expect(instance.state.second).toBe(30);
    })

    it('should change setting properly', () => {
        const spyAlert = jest.spyOn(window, 'alert').mockImplementation(() => {})
        const spyChange = jest.spyOn(actionCreators, 'changeSetting').mockImplementation(() => {
            return (dispatch) => {}})
        const component = mount(psetting);
        const min_input = component.find("#min-input")
        const sec_input = component.find("#second-input")
        const change_button = component.find("#change-setting").at(0)
        min_input.simulate('change', {target: {value: -2}})
        change_button.simulate('click')
        expect(spyAlert).toBeCalledWith("Minute shouldn't be negative")

        min_input.simulate('change', {target: {value: 2}})
        sec_input.simulate('change', {target: {value: -1}})
        change_button.simulate('click')
        expect(spyAlert).toBeCalledWith("Second should be between 0 and 59")

        sec_input.simulate('change', {target: {value: 70}})
        change_button.simulate('click')
        expect(spyAlert).toBeCalledWith("Second should be between 0 and 59")

        sec_input.simulate('change', {target: {value: 30}})
        change_button.simulate('click')
        expect(spyChange).toBeCalledWith({
            hardness: 1,
            breaktime: 150
        })
    })

    it ('should handle go back button properly', () => {
        const spyGoback = jest.spyOn(history, 'goBack').mockImplementation(() => {})
        const component = mount(psetting)
        const wrapper = component.find(IconButton).at(1)
        wrapper.simulate('click')
        expect(spyGoback).toHaveBeenCalledTimes(1)
        
    })
}) 