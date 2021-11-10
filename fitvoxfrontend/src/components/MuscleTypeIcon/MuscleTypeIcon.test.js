import React from 'react';
import { shallow } from 'enzyme';
import MuscleTypeIcon from './MuscleTypeIcon';


describe("Test <Muscle Type Icon/>", () => {
    it ('should render correctly', () => {
        const wrapper = shallow(
            <MuscleTypeIcon muscleType = "Neck"/>
        );
        const name = wrapper.find('.MuscleTypeIcon')
        expect(name.text()).toBe("Neck");
    });

    it('should handle onClick properly', () => {
        const mockClick = jest.fn();
        const wrapper = shallow(<MuscleTypeIcon onClick = {mockClick}/>);
        const name = wrapper.find('.MuscleTypeIcon')
        name.simulate('click');
        expect(mockClick).toHaveBeenCalledTimes(1)
    })
})
