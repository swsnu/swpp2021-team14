import React from "react";
import {mount} from 'enzyme';
import WorkoutEntry from "./WorkoutEntry";
import {Provider} from 'react-redux';
import * as actionCreators from '../../store/actions/workoutActions/workoutActions'
import {getMockStore} from "../../test-utils/mocks";
import {ConnectedRouter} from "connected-react-router";
import {createBrowserHistory} from "history";
import * as actionTypes from "../../store/actions/actionTypes"

const stubInitialState = {
    exercise: {
        exerciseList: [
            {id: 0, name: "Bench Press"}
        ]
    },
    workout: {
        workoutList: null,
        workoutEntries: [
            {
                id: 0,
                exercise_id: 0,
                sets: [{id: 0, repetition: 10, weight: 12, breaktime: 90}]
            }
        ]
    },
    setting: {
        minute: 1,
        second: 30
    }
};

const store = getMockStore(stubInitialState);
jest.mock('../SetEntry/SetEntry', () => (props) => <div>Set Entry</div>);

describe("Test <Workout Entry/>", () => {
    let history, workoutEntry;
    beforeEach(() => {
        history = createBrowserHistory();
        workoutEntry = (
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <WorkoutEntry id={0}/>
                </ConnectedRouter>
            </Provider>
        )
    });

    afterEach(() => jest.clearAllMocks());

    it('should render without error', () => {
        const wrapper = mount(workoutEntry);
        expect(wrapper.find("h3").length).toBe(1);
    });

    it('should delete workout entry correctly', () => {
        const spyOnDeleteWorkout = jest.spyOn(actionCreators, 'deleteWorkout').mockImplementation(id=>{
            return {type: actionTypes.GET_WORKOUT_ENTRIES, workoutEntries: []}
        })

        const wrapper = mount(workoutEntry);
        const deleteButton = wrapper.find('#delete-workout-entry-button').at(0);
        deleteButton.simulate('click');
        expect(spyOnDeleteWorkout).toBeCalledWith(0);
    })

    it('should add new set properly', ()=>{
        const wrapper = mount(workoutEntry);
        const button = wrapper.find('#add-set-button').at(0);
        button.simulate('click');

        const spyOnConfirmAddSet = jest.spyOn(actionCreators, 'addSet').mockImplementation((data)=>{
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

        const confirmButton = wrapper.find("#confirm-add-set-button").at(0);
        confirmButton.simulate('click')

        expect(spyOnConfirmAddSet).toBeCalledWith({workout_entry_id:0, weight: 60, repetition: 15, breaktime: 90})

    })

    it('alert message should given when adding set with wrong value', ()=>{
        const wrapper = mount(workoutEntry);
        const button = wrapper.find('#add-set-button').at(0);
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

        const confirmButton = wrapper.find("#confirm-add-set-button").at(0);
        confirmButton.simulate('click')

        expect(spyAlert).toBeCalledWith("Wrong Input! Weight, Repetition, Second shouldn't be negative. Second should be between 0 and 59");
    })

    it('should comeback from edit mode properly', ()=>{
        const wrapper = mount(workoutEntry)
        const button = wrapper.find('#add-set-button').at(0);
        button.simulate('click');
        button.simulate('click')
        expect(wrapper.find("input").length).toBe(1)
    })
})
