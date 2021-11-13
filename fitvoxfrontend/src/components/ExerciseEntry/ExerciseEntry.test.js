import React from 'react';
import { shallow } from 'enzyme';
import ExerciseEntry from './ExerciseEntry';


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
        const name = wrapper.find('.ExerciseEntry')
        name.simulate('click');
        expect(mockClick).toHaveBeenCalledTimes(1)
    })
})