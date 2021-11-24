import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actionCreators from './store/actions/loginActions/loginActions';

import './App.css';

import Login from './containers/Login/Login';
import Main from './containers/Main/Main';
import CreateAccount from './containers/CreateAccount/CreateAccount';
import PersonalSetting from './containers/PersonalSetting/PersonalSetting';
import ExerciseList from './containers/ExerciseList/ExerciseList';
import ExerciseDetail from './containers/ExerciseDetail/ExerciseDetail';
import AddExercise from './containers/AddExercise/AddExercise';
import WorkoutDetail from "./containers/WorkoutDetail/WorkoutDetail";

class App extends Component {
  componentDidMount() {
    //To maintain logIn, logOut conditions for reloading the window
    this.props.onMaintainLogin();
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            {this.props.authenticated ? (
              <>
                <Route path="/main" exact component={Main} />
                <Route path="/setting" exact component={PersonalSetting} />
                <Route path="/exercise_list" exact component={ExerciseList} />
                <Route path="/add" exact component={AddExercise} />
                <Route path="/exercise_list/:exercisename" exact component={ExerciseDetail} />
                <Route path="/:date" exact component={WorkoutDetail}/>
                <Redirect exact from="/login" to="/main" />
                <Redirect exact from="/" to="/main" />
              </>
            ) : (
              <>
                <Route path="/login" exact render={() => <Login />} />
                <Route path="/create_account" exact component={CreateAccount} />
                <Redirect exact from="/" to="/login" />
                <Route render={() => <Redirect to={{ pathname: '/login' }} />} />
              </>
            )}
          </Switch>
        </div>
      </BrowserRouter>
    );
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