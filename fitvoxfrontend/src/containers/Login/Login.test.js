import React from 'react';
import {mount} from 'enzyme';
import Login from './Login';
import { Provider } from 'react-redux';
import * as actionCreators from '../../store/actions/loginActions/loginActions';
import {createStore} from 'redux';
import thunk from 'redux-thunk';
import { applyMiddleware } from 'redux';
import { history } from '../../store/store';
import { Route, Switch, Router } from 'react-router-dom';
import { TextField, Button } from '@mui/material';


const stubInitialState = {
    login: {},
};

const validEmailEvent = {
    target: { value: 'test' },
};

const wrongEmailEvent = {
    target: { value: 'wrongUsername' },
};

const validPwdEvent = {
    target: { value: 'password' },
};

const wrongPwdEvent = {
    target: { value: 'wrongPassword' },
};

const mockStore = createStore((state, action) => state, stubInitialState, applyMiddleware(thunk));

describe('Test <Login/>', () => {
    let login;
    beforeEach(() => {
        login = (
            <Provider store = {mockStore}>
                <Router history = {history}>
                    <Switch>
                        <Route path = "/" exact
                            component = {Login} />
                    </Switch>
                </Router>
            </Provider>
        )
    });

    it('should render login page properly',  () => {
        const component = mount(login);
        const wrapper = component.find('Login');
        expect(wrapper.length).toBe(1);
    })

    it('should properly get inputs',  () => {
        const component = mount(login);
        const wrapper = component.find('Login');
        const inputs = wrapper.find(TextField);
        const username = inputs.at(0).find('input').at(0);
        const password = inputs.at(1).find('input').at(0);

        username.simulate('change', validEmailEvent);
        expect(wrapper.state().username).toBe('test')

        password.simulate('change', validPwdEvent);
        expect(wrapper.state().password).toBe("password")
    })

    it('should handle login button properly', () => {
        const spyLogin = jest.spyOn(actionCreators, 'getLogin').mockImplementation(()=>{
            return (dispatch) => {}});
        const wrapper = mount(login);
        wrapper.find('form').simulate('submit', {preventDefault() {}})
        const login_button = wrapper.find(Button).at(0);
        login_button.simulate('click')
        expect(spyLogin).toBeCalledTimes(1);
    })

    it('should handle create account button', () => {
        const spyPush = jest.spyOn(history, 'push');
        const wrapper = mount(login);
        const create_account_button = wrapper.find(Button).at(1);
        create_account_button.simulate('click');

        expect(spyPush).toBeCalledWith('/create_account');
    })
}) 