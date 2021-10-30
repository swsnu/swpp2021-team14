import React from 'react';
import App from './App';
import { getMockStore } from './test-utils/mocks';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { mount } from 'enzyme';

const logInInitialState = {
  login: { authenticated: true, currentUser: 'Software Lover' },
};

const logoutInitialState = {
  login: { authenticated: false, currentUser: 'Software Lover' },
};

const logInStore = getMockStore(logInInitialState);
const notLogInStore = getMockStore(logoutInitialState);

jest.mock('./containers/Login/Login', () => (props) => <div className="LogIn">LogIn</div>);

jest.mock('./containers/Main/Main', () => (props) => (
    <div className="Main">Main Page</div>
));

jest.mock('./containers/CreateAccount/CreateAccount', () => (props) => <div className="CreateAccount">CreateAccount</div>);

describe('<App/>', () => {
  let app;
  let history = createBrowserHistory();
  beforeEach(() => {
    app = (
        <Provider store={logInStore}>
          <App history={history} />
        </Provider>
    );
  });

  it('should render login page when not logged in', () => {
    let notLoggedIn = (
        <Provider store={notLogInStore}>
          <App history={history} />
        </Provider>
    );

    const wrapper = mount(notLoggedIn);
    expect(wrapper.find('.LogIn').length).toBe(1);
  });

  it('should redirect to login page when access to other page, when not logged in', () => {
    let notLoggedIn = (
        <Provider store={notLogInStore}>
          <App history={history} />
        </Provider>
    );
    history.push('/main');
    const wrapper = mount(notLoggedIn);
    expect(wrapper.find('.LogIn').length).toBe(1);
    history.push('/notProper');
    const wrapper2 = mount(notLoggedIn);
    expect(wrapper2.find('.LogIn').length).toBe(1);
  });

  it("should route Main page if '/main' when logged in", () => {
    history.push('/main');
    const wrapper = mount(app);
    expect(wrapper.find('.Main').length).toBe(1);
  });

  it("should redirect '/login' to '/main' after logged in", ()=>{
    history.push('/login');
    const wrapper = mount(app);
    expect(wrapper.find('.Main').length).toBe(1);
  })

  it("should redirect '/' to '/main' after logged in", ()=>{
    history.push('/');
    const wrapper = mount(app);
    expect(wrapper.find('.Main').length).toBe(1);
  })

});
