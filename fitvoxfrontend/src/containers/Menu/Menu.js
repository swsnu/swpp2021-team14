import React, { Component } from "react";
import {withRouter} from "react-router";
import { connect } from 'react-redux';
import Logout from "../Logout/Logout";
import {Button, IconButton} from "@mui/material";
import { Box } from "@mui/system";

import {Drawer} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';

class Menu extends Component {    
    state = {
        onToggle: true,
        left: false,
        page: this.props.page
    }

    toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown'&& (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        this.setState({left: open})
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
            <Box className = "Menu" display="flex" justifyContent = "center" alignItems="center" flexDirection = "column" gap = {3}>
                <IconButton aria-label = "menu-open" onClick = {this.toggleDrawer(true)}>
                    <MenuIcon/>
                </IconButton>
                <Drawer
                    anchor = 'left'
                    open = {this.state.left}
                    onClose = {this.toggleDrawer(false)}
                >
                    <Box display = 'flex' justifyContent="center" alignItems='center'>
                        <Box display = 'flex'  p = {2} sx = {{width: "15%"}}>
                            <AccountCircleIcon style = {{fontSize: 45}}/>
                        </Box>
                        <Box display = 'flex'  p = {2} sx = {{width: "70%"}}>
                            <Logout />
                        </Box>
                        <Box display = "flex" justifyContent = "flex-end" alignItems = "center" sx = {{width: "15%"}}>
                            <IconButton onClick = {this.toggleDrawer(false)}>
                                <ChevronRightIcon style = {{fontSize: 45}}/>
                            </IconButton>
                        </Box>
                    </Box>
                    <Divider />
                    <List>
                        <ListItem button key = {"Main Page"}>
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary = {"Main Page"}/>
                        </ListItem>
                    </List>
                    <Divider variant ="middle" flexItem/>
                
                </Drawer>
            </Box>
        )
    }
}
export default withRouter(Menu)