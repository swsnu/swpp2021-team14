import React from 'react';
import {mount} from 'enzyme';
import Logout from './Logout';
import { Provider } from 'react-redux';
import * as actionCreators from '../../store/actions/loginActions/loginActions';
import {createStore} from 'redux';
import thunk from 'redux-thunk';
import { applyMiddleware } from 'redux';
import { Button } from '@mui/material';

const stubInitialState = {
    login:{},
};

const mockStore = createStore((state, action)=>state, stubInitialState, applyMiddleware(thunk));

describe("Test <Logout/>", () => {
    let logout;
    beforeEach(()=> {
        logout = (
            <Provider store = {mockStore}>
                <Logout/>
            </Provider>
        )
    })

    it("should render without errors", () => {
        const wrapper = mount(logout);
        expect(wrapper.find('.LogOut').length).toBe(1);
    })
    it('should logout when the button clicked', ()=>{
        const spygetLogout = jest.spyOn(actionCreators, 'getLogout').mockImplementation(() => {
            return (dispatch) => {};});
        const wrapper = mount(logout);
        const button = wrapper.find(Button);
        button.simulate('click');

        expect(spygetLogout).toBeCalledTimes(1);
    })
})