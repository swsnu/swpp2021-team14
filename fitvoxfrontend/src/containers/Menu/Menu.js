import React, { Component } from "react";
import {withRouter} from "react-router";
import { connect } from 'react-redux';
import Logout from "../Logout/Logout";
import {Button} from "@mui/material";
import { Box } from "@mui/system";

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
        let main_button = (<Button 
                                id="main-page" 
                                variant = "contained"
                                onClick = {() => this.redirectMainHandler()}>
                                    Main Page
                            </Button>)
        let setting_button = (<Button 
                                id="personal-setting" 
                                variant = "contained"
                                onClick = {() => this.redirectPersonalSettingHandler()}>
                                    Personal Setting
                            </Button>)
        let info_button = (<Button 
                                id="user-info" 
                                variant = "contained"
                                onClick = {() => this.redirectUserInformationHandler()}>
                                    User Information
                            </Button>)
        let exerciseList_button = (<Button 
                                        id="exercise-list" 
                                        variant = "contained"
                                        onClick = {() => this.redirectExerciseListHandler()}>
                                            Exercises List
                                    </Button>)
        switch(page){
            case "main":
                return (
                    <Box display = "flex" justifyContent = "center" alignItems = "center" flexDirection ="column" gap = {1}>
                        <Logout/>
                        <Box display = "flex" justifyContent = "center" alignItems="center" gap = {1}>
                            {setting_button}
                            {info_button}
                            {exerciseList_button}
                        </Box>
                    </Box>
                )
            case "setting":
                return (
                    <Box display = "flex" justifyContent = "center" alignItems = "center" flexDirection ="column" gap = {1}>
                        <Logout/>
                        <Box display = "flex" justifyContent = "center" alignItems="center" gap = {1}>
                            {main_button}
                            {info_button}
                            {exerciseList_button}
                        </Box>
                    </Box>
                )
            case "info":
                return (
                    <Box display = "flex" justifyContent = "center" alignItems = "center" flexDirection ="column" gap = {1}>
                        <Logout/>
                        <Box display = "flex" justifyContent = "center" alignItems="center" gap = {1}>
                            {main_button}
                            {setting_button}
                            {exerciseList_button}
                        </Box>
                    </Box>
                )
            case "exercise_list":
                return (
                    <Box display = "flex" justifyContent = "center" alignItems = "center" flexDirection ="column" gap = {1}>
                        <Logout/>
                        <Box display = "flex" justifyContent = "center" alignItems="center" gap = {1}>
                            {main_button}
                            {setting_button}
                            {info_button}
                        </Box>
                    </Box>
                )
            default:
                return (
                    <Box display = "flex" justifyContent = "center" alignItems = "center" flexDirection ="column" gap = {1}>
                        <Logout/>
                        <Box display = "flex" justifyContent = "center" alignItems="center" gap = {1}>
                            {main_button}
                            {setting_button}
                            {info_button}
                            {exerciseList_button}
                        </Box>
                    </Box>
                )
        }    
    }

    render() {
        let comp = null;
        if (this.state.onToggle === true) {
            comp = this.buttons(this.state.page);
        }
        return (
            <Box display="flex" justifyContent = "center" alignItems="center" flexDirection = "column" gap = {3}>
                <link href='https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css' rel='stylesheet'></link>
                <Button id = 'menu_button' 
                        variant = "outlined"
                        onClick={() => this.menuButtonHandler()}>
                            <i class='bx bx-menu'></i>
                </Button>
                {comp}
            </Box>
        )
    }
}
export default withRouter(Menu)