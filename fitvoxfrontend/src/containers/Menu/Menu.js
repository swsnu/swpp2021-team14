import React, { Component } from "react";
import {withRouter} from "react-router";
import { connect } from 'react-redux';

class Menu extends Component {    
    state = {
        onToggle: true,
    }

    redirectPersonalSettingHandler = () => {
        this.props.history.push("/personal-setting")
    }

    redirectUserInformationHandler = () => {
        this.props.history.push("/user-info")
    }

    redirectExerciseListHandler = () => {
        this.props.history.push('/exercise-list')
    }

    menuButtonHandler = () => {
        this.setState({onToggle: (this.state.onToggle ? false : true)})
    }

    render() {
        let comp = null;
        if (this.state.onToggle === true) {
            comp = (<div>
                    <button id="personal-setting" onClick = {() => this.redirectPersonalSettingHandler()}>Personal Setting</button>
                    <button id="user-info" onClick = {() => this.redirectUserInformationHandler()}>User Information</button>
                    <button id="exercise-list" onClick = {() => this.redirectExerciseListHandler()}>Exercises List</button>
                </div>);
        }
        return (
            <div>
                <link href='https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css' rel='stylesheet'></link>
                <button id = 'menu_button' onClick={() => this.menuButtonHandler()}><i class='bx bx-menu'></i></button>
                {comp}
            </div>
        )
    }
}
export default connect(null, null)(withRouter(Menu))