import React from "react";
import reducer from './workoutReducer'
import * as actionTypes from '../../actions/actionTypes'

const initState = {workoutList: null, workoutEntries: []}

describe('Test workout Reducer', ()=>{
    it('should return default state', ()=>{
        const newState = reducer(undefined, {});
        expect(newState).toEqual(initState)
    })

    it('should get workout entries', ()=>{
        const newState = reducer(undefined, {type: actionTypes.GET_WORKOUT_ENTRIES, workoutEntries: [1, 2, 3]});
        expect(newState).toEqual({...initState, workoutEntries: [1, 2, 3]})
    })

});
