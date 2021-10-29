import React from 'react';
import { shallow, mount } from 'enzyme';
import Calendar from './Calendar';

describe("<Calendar >", () => {
    it ("should render calendar without error", () => {
        const component = shallow(<Calendar />);
        const wrapper = component.find("Table");
        expect(wrapper.length).toBe(1);
    });

    it ("should make set values properly", () => {
        const component = shallow(
            <Calendar year={2021} month ={10}/>
        )
        const wrapper = component.find(".date");
        expect(wrapper.length).toBe(30);
    });
})