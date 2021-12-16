import React from "react";
import {mount} from 'enzyme';
import SetEntry from "./SetEntry";
import {Provider} from 'react-redux';
import * as actionCreators from '../../store/actions/workoutActions/workoutActions'
import {getMockStore} from "../../test-utils/mocks";
import {ConnectedRouter} from "connected-react-router";
import {createBrowserHistory} from "history";
import * as actionTypes from "../../store/actions/actionTypes"

const stubInitialState = {};

const store = getMockStore(stubInitialState);

describe("Test <SetEntry />", ()=>{
    let history, setEntry;
    beforeEach(()=>{
        history = createBrowserHistory();
        setEntry = (
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <SetEntry id={0} weight={0} repetition={0} breaktime={0} set_number={0}/>
                </ConnectedRouter>
            </Provider>
        )
    });



    afterEach(()=>jest.clearAllMocks());

    it('should render without error', ()=>{
        const wrapper = mount(setEntry);
        expect(wrapper.find('.SetEntry').length).toBe(1);
        expect(wrapper.find("h4").length).toBe(3)
    });

    it('editmode should work properly', ()=>{
        const wrapper = mount(setEntry);
        const button = wrapper.find('#Edit-mode-button').at(0);
        button.simulate('click');

        const spyOnConfirmEdit = jest.spyOn(actionCreators, 'editSet').mockImplementation((data)=>{
            return {type: actionTypes.GET_WORKOUT_ENTRIES, workoutEntries: []};
        });

        const weightInput = wrapper.find('#weight-input');
        weightInput.simulate('change', {target:{value:60}});
        const repInput = wrapper.find('#rep-input');
        repInput.simulate('change', {target:{value:15}});
        const minInput = wrapper.find('#min-input');
        minInput.simulate('change', {target:{value:1}});
        const secInput = wrapper.find('#sec-input');
        secInput.simulate('change', {target:{value:30}})

        const confirmButton = wrapper.find("#confirm-edit-button").at(0);
        confirmButton.simulate('click')

        expect(spyOnConfirmEdit).toBeCalledWith({id:0, weight: 60, repetition: 15, breaktime: 90})

    })

    it('alert message should given when editted with wrong value', ()=>{
        const wrapper = mount(setEntry);
        const button = wrapper.find('#Edit-mode-button').at(0);
        button.simulate('click');

        const spyAlert = jest.spyOn(window, 'alert').mockImplementation(()=>{return 0})

        const weightInput = wrapper.find('#weight-input');
        weightInput.simulate('change', {target:{value:-1}});
        const repInput = wrapper.find('#rep-input');
        repInput.simulate('change', {target:{value:-1}});
        const minInput = wrapper.find('#min-input');
        minInput.simulate('change', {target:{value:-1}});
        const secInput = wrapper.find('#sec-input');
        secInput.simulate('change', {target:{value:-1}})

        const confirmButton = wrapper.find("#confirm-edit-button").at(0);
        confirmButton.simulate('click')

        expect(spyAlert).toBeCalledWith("Wrong Input! Weight, Repetition, Second shouldn't be negative. Second should be between 0 and 59");
    })

    it('should comeback from edit mode properly', ()=>{
        const wrapper = mount(setEntry);
        const button = wrapper.find('#Edit-mode-button').at(0);
        button.simulate('click');
        button.simulate('click')
        expect(wrapper.find("h4").length).toBe(3)
    })

    it('should delete set properly', ()=>{
        const spyOnDeleteSet = jest.spyOn(actionCreators, 'deleteSet').mockImplementation((id)=>{
            return {type: actionTypes.GET_WORKOUT_ENTRIES, workoutEntries: []};
        });
        const wrapper = mount(setEntry);
        const deleteButton = wrapper.find('#Delete-set-button').at(0);
        deleteButton.simulate('click');
        expect(spyOnDeleteSet).toBeCalledWith(0);
    })

})