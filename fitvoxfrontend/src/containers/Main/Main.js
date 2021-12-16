import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

import './Main.css'
import * as actionCreators from "../../store/actions/index";
import Menu from "../Menu/Menu";

import { Paper, Box, Button, Divider, Typography, OutlinedInput, Stack, InputAdornment, IconButton} from "@mui/material";
import TextField from '@mui/material/TextField';
import StaticDatePicker from '@mui/lab/StaticDatePicker';
import TimelineIcon from '@mui/icons-material/Timeline';
import moment from 'moment';

import Guideline from '../Guideline/Guideline';



class Main extends Component {
    state = {
        year: 2021,
        month: 10,
        value: new Date(),
        prev_date: new Date(),
        body_parts: [
            "Neck",
            "Trapezius",
            "Shoulder",
            "Chest",
            "Back",
            "Triceps",
            "Biceps",
            "Forearm",
            "Abdomen",
            "Waist",
            "Hip",
            "Leg",
            "Calf"
        ],
        numSets: [],
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
        this.props.onGetExerciseList()
        this.props.onGetSettings()
        
        let startDate = new Date(this.state.value.getFullYear(), this.state.value.getMonth(), 1)
        let endDate = new Date(this.state.value.getFullYear(), this.state.value.getMonth() + 1, 1)
        let date_list = this.enumerateDaysBetweenDates(startDate, endDate)
        this.props.onGetWorkoutSummary(date_list)
        this.onCountSets()
    }

    handleTimeStats = () => {
        this.props.history.push("/time_stats");
    }

    onGetWorkout = (date) => {
        if (date.getMonth() !== this.state.prev_date.getMonth() || date.getFullYear() !== this.state.prev_date.getFullYear()) {
            let startDate = new Date(date.getFullYear(), date.getMonth(), 1)
            let endDate = new Date(date.getFullYear(), date.getMonth() + 1, 1)
            let dataSet =  this.enumerateDaysBetweenDates(startDate, endDate)
            this.props.onGetWorkoutSummary(dataSet)
            this.setState({prev_date: date})
        }
    }

    enumerateDaysBetweenDates = function(startDate, endDate) {
        var dates = [];
    
        var currDate = moment(startDate).startOf('day');
        var lastDate = moment(endDate).startOf('day');
        dates.push(currDate.clone().format("YYYYMMDD"))
        while(currDate.add(1, 'days').diff(lastDate) < 0) {
            dates.push(currDate.clone().format("YYYYMMDD"));
        }
        return dates;
    };

    onGetSummary = () => {

        this.onCountSets()
        this.setState({prev_date: this.state.value})
    }

    onCountSets = () => {
        let numSets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        for (let entry of this.props.workoutList) {
            if (entry["date"] === moment(this.state.value).format("YYYYMMDD")) {
                for (let idx in this.state.body_parts) {
                    let set = entry["info"][this.state.body_parts[idx]]
                    numSets[idx] = isNaN(set) ? numSets[idx] : numSets[idx] + set
                }
            }
            else {
                continue
            }
        }
        this.setState({numSets: numSets})
    }

    render() {        
        let stackEntries = [];
        if (this.state.numSets.length !== 0) {
            for (let idx in this.state.numSets){
                if (this.state.numSets[idx] !== 0) {
                    stackEntries.push(
                        (<Box sx = {{width: "100%"}} display = "flex" justifyContent = "center">
                            <Box sx = {{width: "50%"}} display = "flex" justifyContent = "flex-start" alignItems = "center">
                                <Typography marginLeft = {1} variant = "h6">{this.state.body_parts[idx]}</Typography>
                            </Box>
                            <Box sx = {{width: "50%"}} display = "flex" justifyContent = "flex-start" alignItems = "center">
                                <OutlinedInput
                                    sx = {{width: "100%"}}
                                    value = {this.state.numSets[idx]}
                                    endAdornment = {<InputAdornment position = "end">Sets</InputAdornment>}
                                />                                  
                            </Box>
                        </Box>)
                    )
                }
            }
        }

        return (
            <Box p = {6} className = "Main" display = "flex" justifyContent="center" gap ={2}>
                <Box p = {1} display = "flex" flexDirection = "column" jutifyContent = "center" gap = {2}>
                    <Box>
                        <Menu page = 'main'></Menu>
                    </Box>
                    <IconButton id = "timeframe-statistics-button" onClick={() => this.handleTimeStats()}>
                        <TimelineIcon></TimelineIcon>
                    </IconButton>
                    <Box><Guideline name = "Main"/></Box>
                </Box>
                <Paper elevation = {15} p ={6} display = "flex" flexDirection = "column" justifyContent='center' alignItems='center' gap = {4} sx = {{width: '60%'}}>              
                    <Box sx = {{minHeight: 500}} component = "form" display = "flex" flexDirection="row" justifyContent='center' alignItems='center'>
                        <Box p = {2} sx = {{width: "60%"}}>
                            <Box>
                                <StaticDatePicker
                                    orientation="landscape"
                                    openTo="day"
                                    value={this.state.value}
                                    onChange={(newValue) => {
                                        this.setState({value: newValue});
                                        this.onGetWorkout(newValue)
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                                <Button onClick = {() => this.Workout()}>
                                        MOVE
                                </Button>
                                <Button onClick = {() => this.onGetSummary()}>
                                    Get Summary
                                </Button>
                            </Box>
                        </Box>
                        <Divider orientation="vertical" variant = "middle" flexItem/>
                        <Box sx = {{width: "40%"}} display = "flex" flexDirection = "column" justifyContent ="center" alignItems = "center" p = {1} gap = {3}>
                            <Typography variant = "h5">{"Workout Summary of " + moment(this.state.prev_date).format("YYYY.MM.DD")}</Typography>
                            <Stack sx = {{minHeight:300}}
                                direction="column"
                                justifyContent="space-around"
                                alignItems="center"
                                spacing={2}
                            >
                                {stackEntries}
                            </Stack>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        );
    }
}

const mapStateToProps = state => {
    return {
        workoutList: state.workout.workoutList,
        exerciseList: state.exercise.exerciseList
    };

}

const mapDispatchToProps = dispatch => {
    return {
        onGetSettings: () => dispatch(actionCreators.getSetting()),
        onGetExerciseList: () => dispatch(actionCreators.getExerciseList()),
        onGetWorkoutSummary: (data) => dispatch(actionCreators.getWorkoutSummary(data)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Main))