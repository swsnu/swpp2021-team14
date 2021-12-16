import React from "react";
import reducer from './statisticsReducer'
import * as actionTypes from '../../actions/actionTypes'

const initState = {bodyInfo: [], benchPress: [], squat: [], deadLift: []}

describe('Test statistics Reducer', ()=>{
    it('should return default state', ()=>{
        const newState = reducer(undefined, {});
        expect(newState).toEqual(initState)
    })

    it('should get body info', ()=>{
        const newState = reducer(undefined, {type: actionTypes.GET_BODY_INFO, bodyInfo: [1, 2, 3]});
        expect(newState).toEqual({...initState, bodyInfo: [1, 2, 3]})
    })

});
