import React from 'react';
import {mount} from 'enzyme';
import AddExercise from './AddExercise';
import { Provider } from 'react-redux';
import * as actionCreators from '../../store/actions/loginActions/loginActions';
import {createStore} from 'redux';
import thunk from 'redux-thunk';
import { applyMiddleware } from 'redux';
import { history } from '../../store/store';
import { Route, Switch, Router } from 'react-router-dom';
import Select from 'react-select';
import {Checkbox} from "semantic-ui-react";

const stubInitialState = {
    exercise: {
        muscleTypes: [
            "Neck", "Trapezius"
        ],
        exerciseTypes: [
            {
                "muscleType": "Neck",
                "exerciseType":"Neck Raise"
            },
            {
                "muscleType": "Trapezius",
                "exerciseType": "Y-Raise"
            }
        ]
    },
    setting: {
        hardness: "3",
        minute: 3,
        second: 0
    }
}

const mockStore = createStore((state, action) => state,
                            stubInitialState,
                            applyMiddleware(thunk));

describe("Test <AddExercise/>", () => {
    let addExericse;
    beforeEach(() => {
        addExericse = (
            <Provider store = {mockStore}>
                <Router history = {history}>
                    <Switch>
                        <Route path = '/' exact
                            component = {AddExercise}/>
                    </Switch>
                </Router>
            </Provider>
        )
    });

    it('should render Add exercise page properly', () => {
        const component = mount(addExericse);
        const wrapper = component.find(".AddExercise")
        expect(wrapper.length).toBe(1);
        const instance = component.find(AddExercise.WrappedComponent).instance();
        expect(instance.muscleTypeOptions.length).toBe(2)
    })

    it('should get exercise name', () => {
        const component = mount(addExericse);
        const wrapper = component.find(".AddExercise")
        const name_input = wrapper.find('#exercise-name-input').at(0);
        name_input.simulate('change', {target: {value: "sample"}});
        const instance = component.find(AddExercise.WrappedComponent).instance();
        expect(instance.state.exercise_name).toBe("sample");
    })

    it('should get muscle type from react-select', () => {
        const component = mount(addExericse);
        const wrapper = component.find(Select).at(0);
        wrapper.simulate('keyDown', {keyCode: 40, key: 'ArrowDown'});
        wrapper.simulate('keyDown', {keyCode: 13, key: 'Enter'});
        const instance = component.find(AddExercise.WrappedComponent).instance();
        expect(instance.state.muscleType).toBe("Neck");
        expect(instance.exerciseTypeOptions.length).toBe(2);

        const exercise_type = component.find(Select).at(1);
        exercise_type.simulate('keyDown', {keyCode: 40, key: 'ArrowDown'});
        exercise_type.simulate('keyDown', {keyCode: 13, key: 'Enter'});
        expect(instance.state.add_new_exercise).toBe(true);
        expect(component.find("#tag-input").length).toBe(2);
        const new_exercise_type = component.find("#tag-input").at(0)
        new_exercise_type.simulate('change', {target: {value: "new_type"}});
        expect(instance.state.exerciseType).toBe("new_type")

        exercise_type.simulate('keyDown', {keyCode: 40, key: 'ArrowDown'});
        exercise_type.simulate('keyDown', {keyCode: 40, key: 'ArrowDown'});
        exercise_type.simulate('keyDown', {keyCode: 13, key: 'Enter'});
        expect(instance.state.add_new_exercise).toBe(false);
        expect(component.find("#tag-input").length).toBe(1);
        expect(instance.state.exerciseType).toBe("Neck Raise")
    })

    it("should add tags properly", () => {
        const component = mount(addExericse);
        const muscle_type = component.find(Select).at(0);
        const exercise_type = component.find(Select).at(1);
        const instance = component.find(AddExercise.WrappedComponent).instance();

        muscle_type.simulate('keyDown', {keyCode: 40, key: 'ArrowDown'});
        muscle_type.simulate('keyDown', {keyCode: 13, key: 'Enter'});
        exercise_type.simulate('keyDown', {keyCode: 40, key: 'ArrowDown'});
        exercise_type.simulate('keyDown', {keyCode: 40, key: 'ArrowDown'});
        exercise_type.simulate('keyDown', {keyCode: 13, key: 'Enter'});

        const tag_input = component.find("#tag-input").at(0);
        tag_input.simulate('change', {target: {value : "#tag1"}});
        component.find('button').at(0).simulate('click');
        tag_input.simulate('change', {target: {value : "#tag2"}});
        expect(instance.state.tag).toBe('#tag2');
        component.find('button').at(1).simulate('click');
        expect(instance.state.tag).toBe("#");
        expect(instance.state.tags.length).toBe(2);
        component.find('#delete-tag').at(1).simulate('click');
        expect(instance.state.tags.length).toBe(1);
        // if idx <= -1
        instance.setState({tags: []})
        component.find('#delete-tag').at(0).simulate('click');
        expect(instance.state.tags.length).toBe(0);
        // if state.tags.length === 0
        tag_input.simulate('change', {target: {value : "#tag1"}});
        component.find('button').at(0).simulate('click');
        component.find('#delete-tag').at(0).simulate('click');
        expect(instance.state.tags.length).toBe(0);
    })

    it("should get is_favorite properly", () => {
        const component = mount(addExericse);
        const check_box = component.find(Checkbox).at(0);
        const instance = component.find(AddExercise.WrappedComponent).instance()
        check_box.simulate('click');
        expect(instance.state.isFavorite).toBe(true)
    })

    it("should handle confirm button properly", () => {
        const spyAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
        const spyPush = jest.spyOn(history, 'push');
        const component = mount(addExericse);
        const muscle_type = component.find(Select).at(0);
        const exercise_type = component.find(Select).at(1);
        const confirm_button = component.find("#confirm-button").at(0);
        confirm_button.simulate('click')
        expect(spyAlert).toBeCalledWith("Fill in the Exercise Name")

        const name_input = component.find('#exercise-name-input').at(0);
        name_input.simulate('change', {target: {value: "sample"}});
        confirm_button.simulate('click')
        expect(spyAlert).toBeCalledWith("Select the Muscle Type");

        muscle_type.simulate('keyDown', {keyCode: 40, key: 'ArrowDown'});
        muscle_type.simulate('keyDown', {keyCode: 13, key: 'Enter'});
        confirm_button.simulate('click');
        expect(spyAlert).toBeCalledWith("Select the Exercise Type");

        exercise_type.simulate('keyDown', {keyCode: 40, key: 'ArrowDown'});
        exercise_type.simulate('keyDown', {keyCode: 40, key: 'ArrowDown'});
        exercise_type.simulate('keyDown', {keyCode: 13, key: 'Enter'});
        confirm_button.simulate('click');
        expect(spyPush).toBeCalledWith("/exercise_list")
    })
}) 