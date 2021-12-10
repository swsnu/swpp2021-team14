import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actionCreators from './store/actions/loginActions/loginActions';

import './App.css';

import Login from './containers/Login/Login';
import Main from './containers/Main/Main';
import CreateAccount from './containers/CreateAccount/CreateAccount';
import ResetPassword from './containers/ResetPassword/ResetPassword';
import ResetPasswordConfirm from './containers/ResetPassword/ResetPasswordConfirm';
import PersonalSetting from './containers/PersonalSetting/PersonalSetting';
import ExerciseList from './containers/ExerciseList/ExerciseList';
import ExerciseDetail from './containers/ExerciseDetail/ExerciseDetail';
import AddExercise from './containers/AddExercise/AddExercise';
import SelectedStatistics from './containers/SelectedStatistics/SelectedStatistics';
import TimeframeStatistics from './containers/TimeframeStatistics/TimeframeStatistics';
import WorkoutDetail from "./containers/WorkoutDetail/WorkoutDetail";
import WorkoutAdd from "./containers/WorkoutAdd/WorkoutAdd";
import UserInfo from './containers/UserInfo/UserInfo';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

class App extends Component {
  componentDidMount() {
    //To maintain logIn, logOut conditions for reloading the window
    this.props.onMaintainLogin();
  }

  render() {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <BrowserRouter>
            <div className="App">
                {this.props.authenticated ? (
                    <>
                      <Switch>
                      <Route path="/main" exact={true} component={Main} />
                      <Route path="/setting" exact component={PersonalSetting} />
                      <Route path="/user-info" exact component={UserInfo}/>
                      <Route path="/exercise_list" exact component={ExerciseList} />
                      <Route path="/add" exact component={AddExercise} />
                      <Route path="/exercise_list/:exercise_id" exact component={ExerciseDetail} />
                      <Route path="/time_stats" exact component={TimeframeStatistics} />
                      <Route path="/workout/:date" exact component={WorkoutDetail}/>
                      <Route path="/workout/:date/add" exact component={WorkoutAdd}/>
                      <Route path="/exercise_list/stats/:query" exact component = {SelectedStatistics} />
                      
                      <Redirect exact from="/login" to="/main" />
                      <Redirect exact from="/" to="/main" />
                      </Switch>
                    </>
                ) : (
                    <>
                    <Switch>
                      <Route path="/login" exact render={() => <Login />} />
                      <Route path="/create_account" exact component={CreateAccount} />
                      <Route exact path='/reset-password' component={ResetPassword} />
                      <Route exact path='/password/reset/confirm/:uid/:token' component={ResetPasswordConfirm} />
                      <Redirect exact from="/" to="/login" />
                      <Route render={() => <Redirect to={{ pathname: '/login' }} />} />
                      </Switch>
                    </>
                )}
            </div>
          </BrowserRouter>
        </LocalizationProvider>
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