import React from 'react';
import ExerciseDetail from './ExerciseDetail';
import { shallow } from 'enzyme';

describe("Test <ExerciseDetail/>", () => {
    it ("should render withour error", () => {
        const wrapper = shallow(<ExerciseDetail/>);
        expect(wrapper.find('.ExerciseDetail').length).toBe(1);
    });
});