import React from "react";
import { mount } from "enzyme";
import PersonalSetting from "./PersonalSetting";
import Provider  from "react";
import * as actionCreators from '../../store/actions/index';
import { getMockStore} from '../../test-utils/mocks';
import { ConnectedRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import * as actionTypes from '../../store/actions/actionTypes'
import {mockStore} from '../../store/store'


const stubInitialState = {
    hardness: '1',
    minute: 1,
    second: 0
};

const store = getMockStore(stubInitialState);


describe('Test <PersonalSetting/>', () => {
    let personalSetting, history;
    beforeEach(() => {
        history = createBrowserHistory();
        personalSetting = (
            <Provider store = {store}>
                <ConnectedRouter history = {history}>
                    <PersonalSetting />
                </ConnectedRouter>
            </Provider>
        )
    });

    afterEach(()=>jest.clearAllMocks());

    it ('should render without error', () => {
        const wrapper = mount(personalSetting);
        expect(wrapper.find('#hardness-setting').length).toBe(1);
        expect(wrapper.find('#default-break-time').length).toBe(1);
        expect(wrapper.find('#voice-partner-setting').length).toBe(1);
        const instance = wrapper.find(PersonalSetting.WrappedComponent).instance();
        expect(instance.state.hardness).toBe('1');
    })
})