import React, {Component} from 'react';
import Select from 'react-select';
import {withRouter} from "react-router";
import {connect} from "react-redux";
import * as actionCreators from '../../store/actions/index';
import Menu from '../Menu/Menu';
import './PersonalSetting.css';
import Button from '@mui/material/Button';
import {Box, IconButton} from "@mui/material"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

class PersonalSetting extends Component {

    hardness_options = [
        {value: "1", label: 'Home Training'},
        {value: "2", label: 'Gym Beginner'},
        {value: "3", label: 'More than Intermediate'}
    ]

    state = {
        hardness: this.props.hardness,
        minute: this.props.minute,
        second: this.props.second
    }

    voice_bgm_options = [
        {value: 0, label: "Default BGM"}
    ]

    voice_setting_options = [
        {value: 0, label: "Default Voice"}
    ]

    onChangeSetting = () => {
        if(this.state.minute<0){
            alert("Minute shouldn't be negative")
            return
        }

        if (this.state.second < 0 || this.state.second >= 60) {
            alert("Second should be between 0 and 59");
            return
        }

        const settingData = {
            hardness: this.state.hardness,
            breaktime: this.state.minute * 60 + this.state.second
        }
        this.props.onChangeSettings(settingData);
    }

    onChangeHardness = (value) => {
        this.setState({hardness: value.value})
    }


    componentDidMount() {
        this.props.onGetSettings()
    }

    render() {
        return (
            <Box p = {6} display = "flex" justifyContent="center" gap = {1}>
                <Box p = {1} display = "flex" flexDirection = "column" jutifyContent = "center" gap = {2}>
                    <Menu page = "setting"></Menu>
                    <IconButton id = "back_button" onClick={() => this.props.history.goBack()}>
                        <ArrowBackIcon></ArrowBackIcon>
                    </IconButton>
                </Box>
                <Box sx = {{width: "60%"}}>
                    <div className="PersonalSetting" id="personal-setting" align="center" >
                        <div className="Title">
                            <h1>Personal Setting</h1>
                            <hr></hr>
                        </div>
                        <div className="SettingSelect" id='hardness-setting'>
                            <h2>Hardness</h2>
                            <Select options={this.hardness_options}
                                    defaultValue={this.hardness_options[this.props.hardness - 1]}
                                    onChange={(value) => this.onChangeHardness(value)}/>
                        </div>
                        <br/>
                        <br/>
                        <div id='default-break-time'>
                            <h2>Default Break time</h2>
                            <label>Minute </label>
                            <input
                                id="min-input"
                                type="number"
                                value={this.state.minute}
                                onChange={(event) =>
                                    this.setState({minute: event.target.value})
                                }
                            />
                            <label> Second </label>
                            <input
                                id="second-input"
                                type="number"
                                value={this.state.second}
                                onChange={(event) =>
                                    this.setState({second: event.target.value})
                                }
                            />
                        </div>
                        <br/>
                        <br/>
                        <div>
                            <br/>
                            <Button id='change-setting' onClick={() => this.onChangeSetting()}>Change</Button>
                        </div>
                    </div>
                </Box>
            </Box>
        );
    }
}

const mapDisPatchToProps = (dispatch) => {
    return {
        onGetSettings: () => dispatch(actionCreators.getSetting()),
        onChangeSettings: (data) => dispatch(actionCreators.changeSetting(data))
    }
}

const mapStateToProps = (state) => {
    return {
        hardness: state.setting.hardness,
        minute: state.setting.minute,
        second: state.setting.second,
    }
}

export default connect(mapStateToProps, mapDisPatchToProps)(withRouter(PersonalSetting));