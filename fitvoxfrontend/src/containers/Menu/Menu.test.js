import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { connectRouter, ConnectedRouter } from 'connected-react-router';
import { Route, Redirect, Switch } from 'react-router-dom';

import Main from './Main';
import { getMockStore } from '../../test-utils/mocks';
import { history } from '../../store/store';


const stubInitialState = {
    onToggle : false,
};

const mockStore = getMockStore(stubInitialState);

describe('<Main />', () => {
    let main
})