import React, {Component} from 'react';

import {NavLink} from 'react-router-dom';

import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import Calendar from '../../components/Calendar/Calendar';

import './Main.css'
import * as actionCreators from "../../store/actions/index";
import Menu from "../Menu/Menu";

import { Paper, Box, Typography, Button} from "@mui/material";


class Main extends Component {
    state = {
        year: 2021,
        month: 10,
    }

    componentDidMount() {
        // checks whether loginned or not
        // get workout entry data
        this.props.onGetSettings()
        this.props.onGetExerciseList()
    }

    handleClickPrev = () => {
        this.setState({
            year: this.state.month === 1 ? this.state.year - 1 : this.state.year,
            month: this.state.month === 1 ? 12 : this.state.month - 1,
        })
    }

    handleClickNext = () => {
        this.setState({
            year: this.state.month === 12 ? this.state.year + 1 : this.state.year,
            month: this.state.month === 12 ? 1 : this.state.month + 1
        })
    }

    render() {
        return (
            <Box className = "Main" display = "flex" justifyContent="center" alignItems="center" gap ={2}>
                <Button 
                    id="previous-month-button"
                    variant = "text" 
                    onClick={() => this.handleClickPrev()}>
                        &lt;
                </Button>
                <Paper p ={6} display = "flex" flex-direction = "column" gap = {4}>              
                    <Box component = "form" display = "flex" flex-direction="column">
                        <Box p ={1}>
                            <Typography variant = "h2">{this.state.year}.{this.state.month}</Typography>
                        </Box>
                        <Box p = {2}>
                            <Calendar
                                year={this.state.year}
                                month={this.state.month}
                            />
                        </Box>
                        
                    </Box>
                    <Button 
                        id="timeframe-statistics-button" 
                        variant="contained"
                        onClick={() => {}}>
                        Timeframe Statistics
                    </Button>
                    <Menu page = "main"></Menu>
                </Paper>
                <Button 
                    id="next-month-button" 
                    variant = "text"
                    onClick={() => this.handleClickNext()}>
                        &gt;
                </Button>
            </Box>
        );
    }
}

const mapStateToProps = state => {
    return {};

}

const mapDispatchToProps = dispatch => {
    return {
        onGetSettings: () => dispatch(actionCreators.getSetting()),
        onGetExerciseList: () => dispatch(actionCreators.getExerciseList())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Main))