import React from 'react';
import {mount} from 'enzyme';
import ExerciseList from './ExerciseList';
import { Provider } from 'react-redux';
import {createStore} from 'redux';
import thunk from 'redux-thunk';
import { applyMiddleware } from 'redux';
import { history } from '../../store/store';
import { Route, Switch, Router } from 'react-router-dom';
import * as actionCreators from '../../store/actions/exerciselistActions/exerciselistActions'
import { IconButton } from "@mui/material"

let stubInitialState = {
    exercise: {
        exerciseList: [
            {
                "muscleType": "Neck",
                "exerciseType": "Neck Raise",
                "name": "Neck Raise",
                "hardness": "1;2;3;",
                "isFavorite": true,
                "tags": {
                    "tags": [
                        "#Neck_Raise",
                    ]
                }
            },
            {
                "muscleType": "Neck",
                "exerciseType": "Neck Raise",
                "name": "Neck Raise Side",
                "hardness": "1;2;3;",
                "isFavorite": true,
                "tags": {
                    "tags": [
                        "#Neck_Raise",
                        "#Side"
                    ]
                }
            },
            {
                "muscleType": "Trapezius",
                "exerciseType": "Y-Raise",
                "name": "Y-Raise: Dumbbell",
                "hardness": "2;3;",
                "isFavorite": false,
                "tags": {
                    "tags": [
                        "#Dumbbell",
                    ]
                }
            },
        ],
        muscleTypes: ["Neck", "Trapezius"],
        exerciseTypes: [
            {
                "muscleType": "Neck",
                "exerciseType": "Neck Raise"
            },
            {
                "muscleType": "Trapezius",
                "exerciseType": "Y-Raise"
            },
        ]
    },
    setting: {
        hardness: "2"
    }
}

let nullExerciseListState = {
    exercise: {
        exerciseList: null,
        muscleTypes: ["Neck", "Trapezius"],
        exerciseTypes: [
            {
                "muscleType": "Neck",
                "exerciseType": "Neck Raise"
            },
            {
                "muscleType": "Trapezius",
                "exerciseType": "Y-Raise"
            },
        ]
    },
    setting: {
        hardness: "2"
    }
}

let nullExerciseTypesState = {
    exercise: {
        exerciseList: null,
        muscleTypes: ["Neck", "Trapezius"],
        exerciseTypes: null
    },
    setting: {
        hardness: "2"
    }
}

let nullMuscleTypesState = {
    exercise: {
        exerciseList: null,
        muscleTypes: null,
        exerciseTypes: null
    },
    setting: {
        hardness: "2"
    }
}

const mockStore = createStore((state, action) => state,
                            stubInitialState,
                            applyMiddleware(thunk));
jest.mock('../../components/MuscleTypeIcon/MuscleTypeIcon', () => (props) => {
    return (
        <div className = "MuscleTypeIcon" onClick = {()=>props.onClick()}>
            <span id = "muscleType">{props.muscleType}</span>
        </div>
    )
})

jest.mock('../../components/ExerciseTypeIcon/ExerciseTypeIcon', () => (props) => {
    return (
        <div className = "ExerciseTypeIcon" onClick = {() => props.onClick()}>
            <span id = "exerciseType">{props.exerciseType}</span>
        </div>
    )
})

jest.mock('../../components/ExerciseEntry/ExerciseEntry', () => (props) => {
    return (
        <div className = "ExerciseEntry" onClick = {() => props.onClick()}>
            <span id = "exerciseName">{props.name}</span>
            <span id = "check_favorite_button" onClick = {() => {props.onCheck()}}/>
        </div>
    )
})

describe("Test <ExerciseList/>", () => {
    let exercise_list;
    beforeEach(()=>{
        exercise_list = (
            <Provider store = {mockStore}>
                <Router history = {history}>
                    <Switch>
                        <Route path = "/" exact 
                            component = {ExerciseList}/>
                    </Switch>
                </Router>
            </Provider>
        )
    })

    const new_mock = (state) => {
        const new_mockStore = createStore((state, action) => state,
                                        state,
                                        applyMiddleware(thunk));
        exercise_list = (
            <Provider store = {new_mockStore}>
                <Router history = {history}>
                    <Switch>
                        <Route path = "/" exact 
                            component = {ExerciseList}/>
                    </Switch>
                </Router>
            </Provider>
        )
    }

    it("should render without error", () => {
        const component = mount(exercise_list);
        expect(component.find(".ExerciseList").length).toBe(1)
    })

    it("should redirect to add_exercise page", ()=>{
        const spyPush = jest.spyOn(history, 'push').mockImplementation(() => {})
        const component = mount(exercise_list);
        const add_exercise_button = component.find("#add-new-exercise").at(0)
        add_exercise_button.simulate('click')
        expect(spyPush).toBeCalledWith("/add")
    })

    it("should render correct number of muscleTypeIcons", () => {
        const component = mount(exercise_list);
        expect(component.find('.MuscleTypeIcon').length).toBe(2);
        const neck = component.find('.MuscleTypeIcon').at(0);
        neck.simulate('click');
        const instance = component.find(ExerciseList.WrappedComponent).instance()
        expect(instance.state.muscleType_selected).toBe(true)
        expect(instance.state.muscleType).toBe("Neck")
        expect(instance.state.query).toEqual(["Neck"])
        const back_muscleType = component.find("#go-back-muscleType").at(0)
        back_muscleType.simulate('click')
        expect(instance.state.muscleType_selected).toBe(false)
        expect(instance.state.muscleType).toBe(null)
        expect(instance.state.query).toEqual([])
    })

    it('should render correct number of exerciseTypeIcons and handle buttons', () => {
        const component = mount(exercise_list);
        const instance = component.find(ExerciseList.WrappedComponent).instance()
        component.find('.MuscleTypeIcon').at(0).simulate('click');
        const spyGoback = jest.spyOn(history, 'goBack').mockImplementation(() => {})
        component.find(IconButton).at(1).simulate('click')
        expect(spyGoback).toHaveBeenCalledTimes(1)
        expect(component.find('.ExerciseTypeIcon').length).toBe(1);
        const neck_raise = component.find('.ExerciseTypeIcon').at(0);
        neck_raise.simulate('click');
        expect(instance.state.exerciseType_selected).toBe(true)
        expect(instance.state.exerciseType).toBe("Neck Raise")
        expect(instance.state.query).toEqual(["Neck", "Neck Raise"])

        const back_muscleType = component.find("#go-back-muscleType").at(0)
        const back_exerciseType = component.find("#go-back-exerciseType").at(0)
        back_exerciseType.simulate('click')
        expect(instance.state.exerciseType_selected).toBe(false)
        expect(instance.state.exerciseType).toBe(null)
        expect(instance.state.query).toEqual(["Neck"])

        back_muscleType.simulate('click')
        expect(instance.state.muscleType_selected).toBe(false)
        expect(instance.state.muscleType).toBe(null)
        expect(instance.state.query).toEqual([])
    })

    it("should render correct number of ExerciseEntry and handle buttons", () => {
        const spyPush = jest.spyOn(history, 'push').mockImplementation(() => {})
        const component = mount(exercise_list);
        const instance = component.find(ExerciseList.WrappedComponent).instance()
        component.find('.MuscleTypeIcon').at(0).simulate('click');
        component.find('.ExerciseTypeIcon').at(0).simulate('click');
        expect(component.find("#search-with-tag").length).toBe(5)
        expect(component.find("#tag-bar").length).toBe(1)
        expect(component.find(".ExerciseEntry").length).toBe(2);
        component.find(".ExerciseEntry").at(0).simulate('click')
        expect(spyPush).toHaveBeenCalledTimes(1)
        const spyGoback = jest.spyOn(history, 'goBack').mockImplementation(() => {})
        component.find(IconButton).at(1).simulate('click')
        expect(spyGoback).toHaveBeenCalledTimes(1)
        const tag_bar = component.find("#tag-bar").at(0)
        const add_tag = component.find("#search-with-tag").at(0)
        tag_bar.simulate("change", {target: {value: "#Side"}})
        expect(instance.state.tag).toBe("#Side")
        add_tag.simulate("click")
        expect(instance.state.tag).toBe("#")
        expect(instance.state.tags).toEqual(["#Side"])
        expect(instance.state.query).toEqual(['Neck', 'Neck Raise', "#Side"])
        expect(component.find(".ExerciseEntry").length).toBe(1);
        component.find(".ExerciseEntry").at(0).simulate('click')
        expect(spyPush).toHaveBeenCalledTimes(2)
    })

    it("should handle tags", () => {
        const component = mount(exercise_list);
        const instance = component.find(ExerciseList.WrappedComponent).instance()
        component.find('.MuscleTypeIcon').at(0).simulate('click');
        component.find('.ExerciseTypeIcon').at(0).simulate('click');
        const tag_bar = component.find("#tag-bar").at(0)
        const add_tag = component.find("#search-with-tag").at(0)
        tag_bar.simulate("change", {target: {value: "#Side"}})
        add_tag.simulate("click")
        tag_bar.simulate("change", {target: {value: "#ASDF"}})
        add_tag.simulate("click")
        expect(component.find(".ExerciseEntry").length).toBe(0);

        expect(component.find("#delete-tag").length).toBe(10)
        component.find("#delete-tag").at(5).simulate('click')
        expect(component.find("#delete-tag").length).toBe(5)
        expect(instance.state.tags.length).toBe(1)
        component.find("#delete-tag").at(0).simulate('click')
        expect(component.find("#delete-tag").length).toBe(0)
        expect(instance.state.tags.length).toBe(0)

        tag_bar.simulate("change", {target: {value: "#Side"}})
        add_tag.simulate("click")
        const delete_button = component.find("#delete-tag").at(0)
        instance.setState({tags: ["#ASDF"]})
        delete_button.simulate('click')
        expect(component.find("#delete-tag").length).toBe(0)
        expect(instance.state.tags.length).toBe(0)
    })

    it ('should handle selectedStatistics button', () => {
        const spyPush = jest.spyOn(history, 'push').mockImplementation(() => {})
        const component = mount(exercise_list);
        component.find('.MuscleTypeIcon').at(0).simulate('click');
        component.find('.ExerciseTypeIcon').at(0).simulate('click');
        const tag_bar = component.find("#tag-bar").at(0)
        const add_tag = component.find("#search-with-tag").at(0)
        tag_bar.simulate("change", {target: {value: "#Side"}})
        add_tag.simulate("click")
        component.find("#selected_stats").at(0).simulate('click')
        expect(spyPush).toBeCalledWith('/exercise_list/stats/Neck=Neck Raise=Side')

    })

    it ('should handle check favorite button before tag searching', () => {
        const spyCheckFavorite = jest.spyOn(actionCreators, 'checkFavorite').mockImplementation(() => {
            return (dispatch) => {}})
        const component = mount(exercise_list);
        component.find('.MuscleTypeIcon').at(0).simulate('click');
        component.find('.ExerciseTypeIcon').at(0).simulate('click');
        component.find("#check_favorite_button").at(0).simulate('click');
        expect(spyCheckFavorite).toBeCalledTimes(1)
    })

    it ('should handle check favorite button after show favorite button', () => {
        const spyCheckFavorite = jest.spyOn(actionCreators, 'checkFavorite').mockImplementation(() => {
            return (dispatch) => {}})
        const component = mount(exercise_list);
        const wrapper = component.find("#show_favorite").at(0);
        wrapper.simulate('click')
        component.find("#check_favorite_button").at(0).simulate('click');
        expect(spyCheckFavorite).toBeCalledTimes(1)
    })

    it ('should handle check favorite button after tag searching', () => {
        const spyCheckFavorite = jest.spyOn(actionCreators, 'checkFavorite').mockImplementation(() => {
            return (dispatch) => {}})
        const component = mount(exercise_list);
        component.find('.MuscleTypeIcon').at(0).simulate('click');
        component.find('.ExerciseTypeIcon').at(0).simulate('click');
        const tag_bar = component.find("#tag-bar").at(0)
        const add_tag = component.find("#search-with-tag").at(0)
        tag_bar.simulate("change", {target: {value: "#Side"}})
        add_tag.simulate("click")
        component.find("#check_favorite_button").at(0).simulate('click');
        expect(spyCheckFavorite).toBeCalledTimes(1)
    })

    it ('should handle show favorite buttons', () => {
        const spyPush = jest.spyOn(history, 'push').mockImplementation(() => {})
        const component = mount(exercise_list);
        const instance = component.find(ExerciseList.WrappedComponent).instance()
        const wrapper = component.find("#show_favorite").at(0);
        wrapper.simulate('click')
        const spyGoback = jest.spyOn(history, 'goBack').mockImplementation(() => {})
        component.find(IconButton).at(1).simulate('click')
        expect(spyGoback).toHaveBeenCalledTimes(1)
        expect(instance.state.show_favorite).toBe(true);
        expect(component.find('.ExerciseEntry').length).toBe(2)
        component.find('.ExerciseEntry').at(0).simulate('click')
        expect(spyPush).toBeCalledTimes(1)
    })

    it ("should handle null exerciseList", () => {
        new_mock(nullExerciseListState)
        const component = mount(exercise_list)
        component.find('.MuscleTypeIcon').at(0).simulate('click');
        component.find('.ExerciseTypeIcon').at(0).simulate('click');
        expect(component.find(".ExerciseEntry").length).toBe(0);
        component.find("#show_favorite").at(0).simulate('click')
        expect(component.find(".ExerciseEntry").length).toBe(0);
    })

    it ("should handle null exerciseTypes", () => {
        new_mock(nullExerciseTypesState)
        const component = mount(exercise_list)
        component.find('.MuscleTypeIcon').at(0).simulate('click');
        expect(component.find(".ExerciseTypeIcon").length).toBe(0);
    })

    it ("should handle null muscleTypes", () => {
        new_mock(nullMuscleTypesState)
        const component = mount(exercise_list)
        expect(component.find('.MuscleTypeIcon').length).toBe(0);
    })

    it ('should handle go back button properly', () => {
        const spyGoback = jest.spyOn(history, 'goBack').mockImplementation(() => {})
        const component = mount(exercise_list)
        const wrapper = component.find(IconButton).at(1)
        wrapper.simulate('click')
        expect(spyGoback).toHaveBeenCalledTimes(1)
        
    })
}) 