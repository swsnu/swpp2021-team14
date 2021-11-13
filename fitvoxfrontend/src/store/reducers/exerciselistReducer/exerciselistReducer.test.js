import React from 'react';
import reducer from './exerciselistReducer';
import * as actionTypes from '../../actions/actionTypes';

describe("Test Exercise List Reducer", () => {
    it ('should return default state', () => {
        const newState = reducer(undefined, {});
        expect(newState).toEqual({exerciseList: null, muscleTypes: null, exerciseTypes: null})
    });

    it('should get exercise list', () => {
        let exercise_list = [
            {
                'muscleType': 'Neck',
                'exerciseType': 'Neck Raise',
                'exerciseName': 'Neck Raise',
            },
            {
                'muscleType': 'Neck',
                'exerciseType': 'Neck Raise',
                'exerciseName': 'Neck Raise Side'
            },
            {
                'muscleType': 'Trapezius',
                'exerciseType': 'Y-Raise',
                'exerciseName': 'Y-Raise: Dumbbell'
            }
        ];
        const newState = reducer(undefined, {
            type: actionTypes.GET_EXERCISE_LIST,
            exerciseList: exercise_list,
        });
        expect(newState).toEqual(
            {
                exerciseList: exercise_list,
                muscleTypes: [
                    'Neck',
                    'Trapezius',
                ],
                exerciseTypes: [
                    {
                        "muscleType": "Neck",
                        "exerciseType": "Neck Raise"
                    },
                    {
                        "muscleType": "Trapezius",
                        "exerciseType": "Y-Raise"
                    }
                ]
            }
        )
    })
})