import React from 'react';
import reducer from './settingReducer';
import * as actionTypes from '../../actions/actionTypes';

describe("Test Setting Reducer", () => {
    it ('should return default state', () => {
        const newState = reducer(undefined, {});
        expect(newState).toEqual({hardness: null, minute: 1, second: 0})
    })
    
    it ("should Get Settings", () => {
        const newState = reducer(undefined, {
            type: actionTypes.GET_SETTING,
            hardness: '3',
            breaktime: 180
        })
        expect(newState).toEqual({
            hardness: '3',
            minute: 3,
            second: 0
        })
    })

    it("should change settings", () => {
        const newState = reducer(undefined, {
            type: actionTypes.CHANGE_SETTING,
            hardness: '3',
            breaktime: 180
        })

        expect(newState).toEqual({
            hardness: '3',
            minute: 3,
            second: 0
        })
    })
})