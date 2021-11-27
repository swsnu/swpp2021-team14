import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

import './Main.css'
import * as actionCreators from "../../store/actions/index";
import Menu from "../Menu/Menu";

import { Paper, Box, Button} from "@mui/material";
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

    handleTimeStats = () => {
        this.props.history.push("/time_stats");
    }

    render() {
        return (
            <Box p = {6} className = "Main" display = "flex" justifyContent="center" gap ={2}>
                <Box p = {1}>
                    <Box>
                        <Menu page = 'main'></Menu>
                    </Box>
                    
                </Box>
                <Paper p ={6} display = "flex" flexDirection = "column" justifyContent='center' alignItems='center' gap = {4} sx = {{width: '60%'}}>              
                    <Box sx = {{minHeight: 500}} component = "form" display = "flex" flexDirection="column" justifyContent='center' alignItems='center'>
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