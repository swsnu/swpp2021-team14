import React, { Component } from "react";
import {withRouter} from "react-router";
import { connect } from 'react-redux';
import * as actionCreators from "../../store/actions/index";
import Logout from "../Logout/Logout";
import {IconButton} from "@mui/material";
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
import ListIcon from '@mui/icons-material/List';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

class Menu extends Component {    
    state = {
        onToggle: true,
        left: false,
        page: this.props.page
    }

    toggleDrawer = (open) => (event) => {
        this.setState({left: open})
    
    }

    redirectMainHandler = () => {
        this.props.history.push("/main");
    }

    redirectPersonalSettingHandler = () => {
        this.props.history.push("/setting")
    }

    redirectUserInformationHandler = () => {
        this.props.onGetBodyInfo()
        this.props.history.push("/user-info")
    }

    redirectExerciseListHandler = () => {
        this.props.history.push('/exercise_list')
    }

    buttons = (page) => {
        let main_button = (
            <ListItem button key = {"Main Page"} 
                      onClick = {() => this.redirectMainHandler()} 
                      sx = {this.state.page === "main" ? {color: 'white', backgroundColor : "gray"} : {}}>
                <ListItemIcon>
                    <HomeIcon />
                </ListItemIcon>
                <ListItemText primary = {"Main Page"}/>
            </ListItem>
        )
        let setting_button = (
            <ListItem button key = {"Personal Setting"} 
                      onClick = {() => this.redirectPersonalSettingHandler()}
                      sx = {this.state.page === "setting" ? {color: 'white', backgroundColor : "gray"} : {}}>
                <ListItemIcon>
                    <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary = {"Personal Setting"}/>
            </ListItem>
        )
        let info_button = (
            <ListItem button key = {"User Information"} 
                      onClick = {() => this.redirectUserInformationHandler()}
                      sx = {this.state.page === "user-info" ? {color: 'white', backgroundColor : "gray"} : {}}>
                <ListItemIcon>
                    <InfoOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary = {"User Information"}/>
            </ListItem>
        )
        let exerciseList_button = (
            <ListItem button key = {"Exercise List"} 
                      onClick = {() => this.redirectExerciseListHandler()}
                      sx = {this.state.page === "exercise_list" ? {color: 'white', backgroundColor : "gray"} : {}}>
                <ListItemIcon>
                    <ListIcon />
                </ListItemIcon>
                <ListItemText primary = {"Exercise List"}/>
            </ListItem>
        )
        return (
            <List>
                {main_button}
                <Divider variant ="middle" flexItem/>
                {setting_button}
                <Divider variant ="middle" flexItem/>
                {info_button}
                <Divider variant ="middle" flexItem/>
                {exerciseList_button}
                <Divider variant ="middle" flexItem/>
            </List>
        )
    }

    render() {
        let comp = this.buttons(this.state.page);
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
                    {comp}
                </Drawer>
            </Box>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onGetBodyInfo : () => dispatch(actionCreators.getBodyInfo()),
    }
}

export default connect(null, mapDispatchToProps)(withRouter(Menu))