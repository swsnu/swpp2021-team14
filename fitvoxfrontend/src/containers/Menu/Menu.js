import React, { Component } from "react";
import {withRouter} from "react-router";
import { connect } from 'react-redux';
import Logout from "../Logout/Logout";

class Menu extends Component {    
    state = {
        onToggle: false,
        page: this.props.page
    }

    redirectMainHandler = () => {
        this.props.history.push("/main");
    }

    redirectPersonalSettingHandler = () => {
        this.props.history.push("/setting")
    }

    redirectUserInformationHandler = () => {
        this.props.history.push("/user-info")
    }

    redirectExerciseListHandler = () => {
        this.props.history.push('/exercise_list')
    }

    menuButtonHandler = () => {
        this.setState({onToggle: (this.state.onToggle ? false : true)})
    }

    buttons = (page) => {
        let main_button = (<button id="main-page" onClick = {() => this.redirectMainHandler()}>Main Page</button>)
        let setting_button = (<button id="personal-setting" onClick = {() => this.redirectPersonalSettingHandler()}>Personal Setting</button>)
        let info_button = (<button id="user-info" onClick = {() => this.redirectUserInformationHandler()}>User Information</button>)
        let exerciseList_button = (<button id="exercise-list" onClick = {() => this.redirectExerciseListHandler()}>Exercises List</button>)
        switch(page){
            case "main":
                return (
                    <div>
                        <Logout/>
                        {setting_button}
                        {info_button}
                        {exerciseList_button}
                    </div>
                )
            case "setting":
                return (
                    <div>
                        <Logout/>
                        {main_button}
                        {info_button}
                        {exerciseList_button}
                    </div>
                )
            case "info":
                return (
                    <div>
                        <Logout/>
                        {main_button}
                        {setting_button}
                        {exerciseList_button}
                    </div>
                )
            case "exercise_list":
                return (
                    <div>
                        <Logout/>
                        {main_button}
                        {setting_button}
                        {info_button}
                    </div>
                )
            default:
                return (
                    <div>
                        <Logout/>
                        {main_button}
                        {setting_button}
                        {info_button}
                        {exerciseList_button}
                    </div>
                )
        }    
    }

    render() {
        let comp = null;
        if (this.state.onToggle === true) {
            comp = this.buttons(this.state.page);
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
export default withRouter(Menu)