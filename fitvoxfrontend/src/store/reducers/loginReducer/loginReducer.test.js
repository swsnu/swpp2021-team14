import React from 'react';
import reducer from './loginReducer';
import * as actionTypes from '../../actions/actionTypes';

describe("Test Login Reducer", () => {
    it ('should return default state', () => {
        const newState = reducer(undefined, {});
        expect(newState).toEqual({authenticated: false, createAccount: true})
    })

    it('should login', () => {
        const newState = reducer(undefined, {
            type: actionTypes.LOGIN,
            authenticated: true,
            currentUser: 'test_user',
        });
    
        expect(newState).toEqual({
            authenticated: true,
            createAccount: true,
            currentUser: 'test_user',
        });
    });

    it('should logout', () => {
        const newState = reducer(undefined, {
            type: actionTypes.LOGOUT,
            authenticated: false,
            currentUser: 'test_user',
        });
    
        expect(newState).toEqual({
            authenticated: false,
            createAccount: true,
            currentUser: 'test_user',
        });
    });

    it('should create account', () => {
        const newState = reducer(undefined, {
            type: actionTypes.CREATEACCOUNT,
            authenticated: false,
            currentUser: "test_user"
        });
        expect(newState).toEqual({
            authenticated: false,
            createAccount: true
        });
    })

    it('should create account', () => {
        const newState = reducer(undefined, {
            type: actionTypes.FAILCREATEACCOUNT,
            authenticated: false,
            currentUser: "test_user"
        });
        expect(newState).toEqual({
            authenticated: false,
            createAccount: false
        });
    })
})