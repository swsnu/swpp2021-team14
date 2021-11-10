import React, {Component} from 'react';
import Select from 'react-select';
import {withRouter} from "react-router";
import {connect} from "react-redux";
import * as actionCreators from '../../store/actions/index'
import Menu from '../Menu/Menu';

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
            <div>
                <div id='hardness-setting'>
                    <h2>Hardness</h2>
                    <Select options={this.hardness_options}
                            defaultValue={this.hardness_options[this.props.hardness - 1]}
                            onChange={(value) => this.onChangeHardness(value)}/>
                </div>
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
                <div id='voice-partner setting'>
                    <h2>Voice Partner</h2>
                    <h3>BGM</h3>
                    <Select options={this.voice_bgm_options}
                            defaultValue={this.voice_bgm_options[0]}
                    />
                    <h3>Voice setting</h3>
                    <Select options={this.voice_setting_options}
                            defaultValue={this.voice_setting_options[0]}
                    />
                </div>
                <div>
                    <br/>
                    <button id='change-setting' onClick={() => this.onChangeSetting()}>Change</button>
                </div>
                <Menu page = "setting"></Menu>
            </div>

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