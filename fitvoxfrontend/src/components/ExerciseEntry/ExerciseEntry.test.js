import React from 'react';
import { shallow } from 'enzyme';
import ExerciseEntry from './ExerciseEntry';
import {IconButton} from '@mui/material'


describe("Test <Exercise Entry/>", () => {
    it ('should render correctly', () => {
        const wrapper = shallow(
            <ExerciseEntry name = "name"/>
        );
        const name = wrapper.find('.ExerciseEntry')
        expect(name.text()).toBe("name");
    });

    it('should handle onClick properly', () => {
        const mockClick = jest.fn();
        const wrapper = shallow(<ExerciseEntry name ="name" onClick = {mockClick}/>);
        const name = wrapper.find('#button')
        name.simulate('click');
        expect(mockClick).toHaveBeenCalledTimes(1)
    })

    it('should handle onCheck properly with isFavorite = true', () => {
        const mockClick = jest.fn();
        const wrapper = shallow(<ExerciseEntry isFavorite ={true} onCheck = {mockClick}/>);
        const button = wrapper.find(IconButton).at(0)
        button.simulate('click');
        expect(mockClick).toHaveBeenCalledTimes(1)
    })

    it('should handle onCheck properly with isFavorite = false', () => {
        const mockClick = jest.fn();
        const wrapper = shallow(<ExerciseEntry isFavorite ={false} onCheck = {mockClick}/>);
        const button = wrapper.find(IconButton).at(0)
        button.simulate('click');
        expect(mockClick).toHaveBeenCalledTimes(1)
    })
}) 