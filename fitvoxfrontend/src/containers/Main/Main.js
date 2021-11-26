import React, {Component} from 'react';

import {NavLink} from 'react-router-dom';

import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import Calendar from '../../components/Calendar/Calendar';

import './Main.css'
import * as actionCreators from "../../store/actions/index";
import Menu from "../Menu/Menu";

import { Paper, Box, Typography, Button, IconButton} from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import isWeekend from 'date-fns/isWeekend';
import TextField from '@mui/material/TextField';
import StaticDatePicker from '@mui/lab/StaticDatePicker';



class Main extends Component {
    state = {
        year: 2021,
        month: 10,
        value: new Date()
    }

    Workout = () => {
        let year = this.state.value.getFullYear()
        let month = this.state.value.getMonth() + 1
        let date = this.state.value.getDate()
        
        if (month < 10) {
            month = "0"+month;
        }
        if (date < 10) {
            date = "0" + date;
        }
        let route = "/workout/" + year + month + date;
        this.props.history.push(route);
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

    handleTimeStats = () => {
        this.props.history.push("/time_stats");
    }

    render() {
        return (
            <Box className = "Main" display = "flex" justifyContent="center" alignItems="center" gap ={2}>
                <Box display = "flex" flexDirection='column' gap = {'35vh'} sx = {{height:'100%'}}>
                    <Box>
                        <Menu page = 'main'></Menu>
                    </Box>
                    
                    <Box>
                        <IconButton 
                            id="previous-month-button"
                            aria-label = "previous-month-button"
                            variant = "text" 
                            onClick={() => this.handleClickPrev()}>
                                <ChevronLeftIcon style = {{fontSize: 60}}/>
                        </IconButton>
                    </Box>
                    <Box></Box>
                </Box>
                <Paper p ={6} display = "flex" flexDirection = "column" justifyContent='center' alignItems='center' gap = {4} sx = {{width: '60%'}}>              
                    <Box component = "form" display = "flex" flexDirection="column" justifyContent='center' alignItems='center'>
                        <Box p ={1}>
                            <Typography variant = "h2">{this.state.year}.{this.state.month}</Typography>
                        </Box>
                        <Box p = {2}>
                            <StaticDatePicker
                                orientation="landscape"
                                openTo="day"
                                value={this.state.value}
                                onChange={(newValue) => {
                                this.setState({value: newValue});
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        <Button onClick = {() => this.Workout()}>
                                MOVE
                        </Button>
                        </Box>
                        
                    </Box>
                    <Box display = "flex" justifyContent = 'center' allignItems='center'>
                        <Button 
                            id="timeframe-statistics-button" 
                            variant="contained"
                            onClick={() => this.handleTimeStats()}>
                            Timeframe Statistics
                        </Button>
                    </Box>
                </Paper>
                <IconButton 
                    id="next-month-button" 
                    aria-label = "next-month-button"
                    variant = "text"
                    onClick={() => this.handleClickNext()}>
                        <ChevronRightIcon style = {{fontSize: 60}}></ChevronRightIcon>
                </IconButton>
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