import React from 'react';
import {mount} from 'enzyme';
import { Provider } from 'react-redux';
import {createStore} from 'redux';
import thunk from 'redux-thunk';
import { applyMiddleware } from 'redux';
import { Route, Router } from 'react-router-dom';
//import { history } from '../../store/store';
import ExerciseDetail from './ExerciseDetail';
import { createMemoryHistory } from 'history';
import * as actionCreators from '../../store/actions/exerciselistActions/exerciselistActions'

import {TextField, IconButton} from "@mui/material"
import { stubInitialState } from '../../test-utils/mocks';

const mockStore = createStore((state, action) => state,
                            stubInitialState,
                            applyMiddleware(thunk));

jest.mock('react-chartjs-2', () => ({
    Line: () => null,
}));

const history = createMemoryHistory({ initialEntries: ['/exercise_list/0']})

describe("Test <ExerciseDetail/>", () => {
    let exercise_detail;

    beforeEach(() => {
        exercise_detail = (
            <Provider store = {mockStore}>
                <Router history = {history}>
                    <Route path = "/exercise_list/:exercise_id" exact component = {ExerciseDetail}/>
                </Router>
            </Provider>
        )
    });

    it("should render without error", () => {
        const component = mount(exercise_detail);
        expect(component.find("#ExerciseDetail").length).toBe(3);
        const instance = component.find(ExerciseDetail.WrappedComponent).instance()
        expect(instance.state.exercise_id).toBe(0)
        expect(instance.state.exercisename).toBe("Neck Raise")
        expect(instance.state.tags).toEqual(["#Neck_Raise"])
        expect(instance.state.favorite).toBe(true)
        expect(instance.state.one_rm).toEqual({
            labels: [20211125, 20211126], data: ["130.00", "120.00"]
        })
        expect(instance.state.volume).toEqual({
            labels: [20211125, 20211126], data: ["240.00", "300.00"]
        })
    });

    it ('should handle delete tag button', () => {
        const spyChangeTags = jest.spyOn(actionCreators, "changeTags").mockImplementation(() => {
            return (dispatch) => {}})
        const component = mount(exercise_detail);
        const instance = component.find(ExerciseDetail.WrappedComponent).instance()
        const delete_tag_button = component.find("#delete_tag").at(0)
        delete_tag_button.simulate('click')
        expect(instance.state.tags).toEqual([])
        expect(spyChangeTags).toBeCalledTimes(1)
    })

    it('should not add tag for not proper input', () => {
        const component = mount(exercise_detail);
        const instance = component.find(ExerciseDetail.WrappedComponent).instance()
        const tag_field = component.find("#tag_input").at(0);
        const add_tag_button = component.find("#add_tag_button").at(0)
        tag_field.simulate('click')
        expect(instance.state.tag).toBe("#")
        add_tag_button.simulate('click')
        expect(instance.state.tags.length).toBe(1)
        expect(instance.state.tag).toBe("")
    })

    it('should add tag for proper input', () => {
        const spyChangeTags = jest.spyOn(actionCreators, "changeTags").mockImplementation(() => {
            return (dispatch) => {}})
        const component = mount(exercise_detail);
        const instance = component.find(ExerciseDetail.WrappedComponent).instance()
        const add_tag_button = component.find("#add_tag_button").at(0)
        component.find(TextField).find('input').at(0).simulate('change', {target: {value: "#ASDF"}});
        add_tag_button.simulate('click')
        expect(instance.state.tags.length).toBe(2)
        expect(instance.state.tag).toBe("")
        expect(spyChangeTags).toBeCalledTimes(1)
    })

    it('should handle onBookmarkHandler properly', () => {
        const spyCheckFavorite = jest.spyOn(actionCreators, "checkFavorite").mockImplementation(() =>{
            return (dispatch) => {}})
        const component = mount(exercise_detail);
        const instance = component.find(ExerciseDetail.WrappedComponent).instance()
        const favorite_button = component.find("#favorite").at(0)
        favorite_button.simulate("click")
        expect(instance.state.favorite).toBe(false)
        expect(spyCheckFavorite).toBeCalledTimes(1)
    })

    it('should change chart type properly', () => {
        const component = mount(exercise_detail);
        const instance = component.find(ExerciseDetail.WrappedComponent).instance()
        const volume_button = component.find('#volume').at(0)
        volume_button.simulate('click')
        expect(instance.state.chart_type).toBe("volume")
        component.find('#volume').at(0).simulate('click')
        expect(instance.state.chart_type).toBe("volume")
        const one_rm_button = component.find("#one_rm").at(0);
        one_rm_button.simulate('click')
        expect(instance.state.chart_type).toBe('one_rm')
        component.find('#one_rm').at(0).simulate('click')
        expect(instance.state.chart_type).toBe("one_rm")
    })

    it ('should handle go back button properly', () => {
        const spyGoback = jest.spyOn(history, 'goBack').mockImplementation(() => {})
        const component = mount(exercise_detail)
        const wrapper = component.find(IconButton).at(1)
        wrapper.simulate('click')
        expect(spyGoback).toHaveBeenCalledTimes(1)
        
    })
});