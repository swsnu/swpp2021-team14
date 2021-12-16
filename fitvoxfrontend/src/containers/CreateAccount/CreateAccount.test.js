import React from "react";
import {mount} from 'enzyme';
import CreateAccount from "./CreateAccount";
import {Provider} from 'react-redux';
import * as actionCreators from '../../store/actions/loginActions/loginActions'
import {getMockStore} from "../../test-utils/mocks";
import {ConnectedRouter} from "connected-react-router";
import {createBrowserHistory} from "history";
import * as actionTypes from "../../store/actions/actionTypes"
import {TextField} from "@mui/material";
import Select from "react-select";

const stubInitialState = {};
const store = getMockStore(stubInitialState);

describe('Test <CreateAccount/>', ()=>{
    let history, createAccount;

    beforeEach(()=>{
        history = createBrowserHistory();
        createAccount = (
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <CreateAccount/>
                </ConnectedRouter>
            </Provider>
        )
    });

    it('should render without error', ()=>{
        const wrapper = mount(createAccount);
        expect(wrapper.find(CreateAccount).length).toBe(1);
    });

    it('should check if the password matches', ()=>{
        const wrapper = mount(createAccount);
        const spyAlert = jest.spyOn(window, 'alert').mockImplementation(()=> {return 0;})
        wrapper.find('#username-input').find('input').at(0).simulate('change', {target: {value: "test"}});
        wrapper.find('#email-input').find('input').at(0).simulate('change', {target: {value: "test@naver.com"}});
        wrapper.find('#password-input').find('input').at(0).simulate('change', {target: {value: "password"}});
        wrapper.find('#password-check-input').find('input').at(0).simulate('change', {target: {value: "wrong"}});
        const hard_set = wrapper.find(Select).at(0);
        hard_set.simulate("keyDown", {keyCode: 40, key: "ArrowDown"})
        hard_set.simulate("keyDown", {keyCode: 13, key: "Enter"})
        wrapper.find('form').simulate('submit', {preventDefault() {}})

        expect(spyAlert).toBeCalledWith("Passwords doesn't match! Please check again");
    });

    it('should check invalid password', () => {
        const wrapper = mount(createAccount);
        const spyAlert = jest.spyOn(window, 'alert').mockImplementation(()=> {return 0;})
        wrapper.find('#username-input').find('input').at(0).simulate('change', {target: {value: "test"}});
        wrapper.find('#email-input').find('input').at(0).simulate('change', {target: {value: "test@naver.com"}});
        wrapper.find('#password-input').find('input').at(0).simulate('change', {target: {value: "123"}});
        wrapper.find('#password-check-input').find('input').at(0).simulate('change', {target: {value: "123"}});
        const hard_set = wrapper.find(Select).at(0);
        hard_set.simulate("keyDown", {keyCode: 40, key: "ArrowDown"})
        hard_set.simulate("keyDown", {keyCode: 13, key: "Enter"})
        wrapper.find('form').simulate('submit', {preventDefault() {}})

        expect(spyAlert).toBeCalledWith("Password is too short!");
    });

    it('should create account', () => {
        const wrapper = mount(createAccount);
        const spyOnCreateAccount = jest.spyOn(actionCreators, 'createAccount').mockImplementation(data=>{
            return {type: actionTypes.CREATEACCOUNT}
        })
        const spyHistory = jest.spyOn(history, 'push').mockImplementation((url)=>{return 0;});
        wrapper.find('#username-input').find('input').at(0).simulate('change', {target: {value: "test"}});
        wrapper.find('#email-input').find('input').at(0).simulate('change', {target: {value: "test@naver.com"}});
        wrapper.find('#password-input').find('input').at(0).simulate('change', {target: {value: "password"}});
        wrapper.find('#password-check-input').find('input').at(0).simulate('change', {target: {value: "password"}});
        const hard_set = wrapper.find(Select).at(0);
        hard_set.simulate("keyDown", {keyCode: 40, key: "ArrowDown"});
        hard_set.simulate("keyDown", {keyCode: 13, key: "Enter"});
        wrapper.find('form').simulate('submit', {preventDefault() {}});

        const data = {
            username: "test",
            email: "test@naver.com",
            password: "password",
            hardness: "1"
        }

        expect(spyOnCreateAccount).toBeCalledWith(data);
        expect(spyHistory).toBeCalledWith('/login')
    });
})