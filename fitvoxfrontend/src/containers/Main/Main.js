import React, { Component } from 'react';

import { NavLink } from 'react-router-dom';

import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Calendar from '../../components/Calendar/Calendar';

import './Main.css'
import Logout from "../Logout/Logout";
import * as actionCreators from "../../store/actions/index"

class Main extends Component {
    state = {
        year: 2021,
        month: 10,
    }

    componentDidMount() {
        // checks whether loginned or not
        // get workout entry data
        this.props.onGetSettings()
    }

    handleClickPrev = () => {
        this.setState({
            year: this.state.month === 1 ? this.state.year -1 : this.state.year,
            month: this.state.month === 1 ? 12 : this.state.month - 1,
        })
    }

    handleClickNext = () => {
        this.setState({
            year: this.state.month === 12 ? this.state.year + 1  : this.state.year,
            month: this.state.month === 12 ? 1 : this.state.month + 1
        })
    }

    render() {
        return (
            <div>
                <div className = "header">
                    <button id = "previous-month-button" onClick = {() => this.handleClickPrev()}>prev month</button>
                    {this.state.year}.{this.state.month}
                    <button id = "next-month-button" onClick = {() => this.handleClickNext()}>next month</button>
                </div>
                <Calendar
                    year = {this.state.year}
                    month = {this.state.month}
                    />
                <button className = "timeframe-statistics-button" onClick = {() => {}}>
                    Timeframe Statistics                    
                </button>
                <Logout/>
                <button id='personal-setting' onClick={()=>this.props.history.push('/setting')}>Settings</button>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {

    };

}

const mapDispatchToProps = dispatch => {
    return {
        onGetSettings: () => dispatch(actionCreators.getSetting())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Main))