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
        this.props.onGetSettings()
        this.props.onGetExerciseList()
      
        let date_list = [20211205, 20211206, 20211207, 20211208]
        this.props.onGetWorkoutSummary(date_list)
      
        this.onGetWorkout(this.state.value)
        this.onCountSets()
    }

    handleTimeStats = () => {
        this.props.history.push("/time_stats");
    }

    onGetWorkout = (date) => {
        this.props.onGetWorkoutEntry(moment(date).format("YYYYMMDD"))
        
    }
    onGetSummary = () => {
        this.onCountSets()
        this.setState({prev_date: this.state.value})
    }

    onCountSets = () => {
        console.log(this.props.workoutEntries)
        let numSets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        for (let entry of this.props.workoutEntries) {
            let target_exercise = this.props.exerciseList.filter(exercise => exercise["id"] === entry["exercise_id"])[0]
            let idx = this.state.body_parts.indexOf(target_exercise["muscleType"])
            numSets[idx] = numSets[idx] + entry["sets"].length
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
        workoutEntries: state.workout.workoutEntries,
        exerciseList: state.exercise.exerciseList
    };

}

const mapDispatchToProps = dispatch => {
    return {
        onGetSettings: () => dispatch(actionCreators.getSetting()),
        onGetExerciseList: () => dispatch(actionCreators.getExerciseList()),
        onGetWorkoutSummary: (data) => dispatch(actionCreators.getWorkoutSummary(data)),
        onGetWorkoutEntry: (date) => dispatch(actionCreators.getWorkout(date))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Main))