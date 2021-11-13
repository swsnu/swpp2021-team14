import React from 'react';
import { shallow } from 'enzyme';
import ExerciseTypeIcon from './ExerciseTypeIcon';


describe("Test <Exercise Type Icon/>", () => {
    it ('should render correctly', () => {
        const wrapper = shallow(
            <ExerciseTypeIcon exerciseType = "Neck Raise"/>
        );
        const name = wrapper.find('.ExerciseTypeIcon')
        expect(name.text()).toBe("Neck Raise");
    });

    it('should handle onClick properly', () => {
        const mockClick = jest.fn();
        const wrapper = shallow(<ExerciseTypeIcon exerciseType ="Neck Raise" onClick = {mockClick}/>);
        const name = wrapper.find('.ExerciseTypeIcon')
        name.simulate('click');
        expect(mockClick).toHaveBeenCalledTimes(1)
    })
})