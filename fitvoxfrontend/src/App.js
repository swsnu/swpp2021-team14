import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actionCreators from './store/actions/loginActions/loginActions';

import Login from './containers/Login/Login';
class App extends Component {

  componentDidMount() {
    //To maintain logIn, logOut conditions for reloading the window
    this.props.onMaintainLogin();
  }

  render() {

    if (this.props.authenticated) {

      return (
          <BrowserRouter>
            <div className="App">
              <Switch>
              </Switch>
            </div>
          </BrowserRouter>
      );
    }
    else {
      //Redirect unauthorized users to login page
      return (
          <BrowserRouter>
            <div className="App">
              <Switch>
                <Route
                    path="/login"
                    exact
                    render={() => <Login />}
                />
                <Redirect exact from="/" to="/login" />
                <Route
                    render={() => (
                        <Redirect to={{ pathname: '/login' }} />
                    )}
                />
              </Switch>
            </div>
          </BrowserRouter>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.login.authenticated,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onMaintainLogin: () => dispatch(actionCreators.maintainLogin()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
