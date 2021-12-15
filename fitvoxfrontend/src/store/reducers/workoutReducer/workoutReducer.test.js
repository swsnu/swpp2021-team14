import React from "react";
import reducer from './workoutReducer'
import * as actionTypes from '../../actions/actionTypes'

const initState = {workoutList: [], workoutEntries: [], voicePartner:[], wav: null}

describe('Test workout Reducer', ()=>{
    it('should return default state', ()=>{
        const newState = reducer(undefined, {});
        expect(newState).toEqual(initState)
    });

    it('should get workout entries', ()=>{
        const newState = reducer(undefined, {type: actionTypes.GET_WORKOUT_ENTRIES, workoutEntries: [1, 2, 3]});
        expect(newState).toEqual({...initState, workoutEntries: [1, 2, 3]})
    });

    it('should start voice partner', ()=>{
        const newState = reducer(undefined, {type: actionTypes.START_VOICE_PARTNER, data: [1, 2, 3]});
        expect(newState).toEqual({...initState, voicePartner: [1, 2, 3]});
    });

    it('should end voice partner', ()=>{
        const newState = reducer(undefined, {type: actionTypes.END_VOICE_PARTNER});
        expect(newState).toEqual({...initState, voicePartner: []});
    });

    it('should get workout summary', ()=>{
        const newState = reducer(undefined, {type: actionTypes.GET_WORKOUT_SUMMARY, data: [1, 2, 3]});
        expect(newState).toEqual({...initState, workoutList: [1, 2, 3]})
    })


});
