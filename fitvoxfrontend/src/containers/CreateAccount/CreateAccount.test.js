import React from 'react';
import {mount} from 'enzyme';
import CreatAccount from './CreateAccount';
import { Provider } from 'react-redux';
import * as actionCreators from '../../store/actions/loginActions/loginActions';
import {createStore} from 'redux';
import thunk from 'redux-thunk';
import { applyMiddleware } from 'redux';
import { history } from '../../store/store';
import { Route, Switch, Router } from 'react-router-dom';
import { TextField, Button } from '@mui/material';
import CreateAccount from './CreateAccount';


const stubInitialState = {
    create: {},
};

const validUserEvent = {
    target: { value: 'testuser' },
};

const validPwdEvent = {
    target: { value: 'password' },
};

const validEmailEvent = {
    target: { value: 'swpptest@testmail.com' },
};


const validHardEvent = {
    target: { value: 'swpptest@testmail.com' },
};

const mockStore = createStore((state, action) => state, stubInitialState, applyMiddleware(thunk));

describe('Test <CreateAccount/>', () => {
    let create;
    beforeEach(() => {
        create = (
            <Provider store = {mockStore}>
                <Router history = {history}>
                    <Switch>
                        <Route path = "/" exact
                            component = {CreateAccount} />
                    </Switch>
                </Router>
            </Provider>
        )
    });

    it('should render Signup page properly',  () => {
        const component = mount(create);
        const wrapper = component.find('CreateAccount');
        expect(wrapper.length).toBe(1);
    })

    it('should properly get inputs',  () => {
        const component = mount(create);
        const wrapper = component.find('CreateAccount');
        const inputs = wrapper.find(TextField);
        const username = inputs.at(0).find('input').at(0);
        const email = inputs.at(1).find('input').at(0);
        const password = inputs.at(2).find('input').at(0);
        const passwordchk = inputs.at(3).find('input').at(0);
        const hardness = inputs.at(4).find('input').at(0);

        username.simulate('change', validUserEvent);
        expect(wrapper.state().username).toBe('test')

        email.simulate('change', validEmailEvent);
        expect(wrapper.state().email).toBe("swpptest@testmail.com")

        password.simulate('change', validPwdEvent);
        expect(wrapper.state().password).toBe("password")

        passwordchk.simulate('change', validPwdEvent);
        expect(wrapper.state().passwordchk).toBe("password")

        hardness.simulate('change', validHardEvent);
        expect(wrapper.state().hardness).toBe("3")
    })

    it('should handle create button properly', () => {
        const spyCreate = jest.spyOn(actionCreators, 'createAccount_').mockImplementation(()=>{
            return (dispatch) => {}});
        const wrapper = mount(create);
        wrapper.find('form').simulate('submit', {preventDefault() {}})
        const create_button = wrapper.find(Button).at(0);
        create_button.simulate('click')
        expect(spyCreate).toBeCalledTimes(1);
    })


}) 