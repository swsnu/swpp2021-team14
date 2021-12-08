import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';

import Menu from '../Menu/Menu';

import { Paper, Box, Typography, Button, Divider, IconButton} from "@mui/material";

import TextField from '@mui/material/TextField';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import Chip from '@mui/material/Chip';
import moment from 'moment'

import { Doughnut, Pie } from "react-chartjs-2";


class TimeframeStatistics extends Component {

    state = {
        from_value: new Date(),
        to_value: new Date(),
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
        numSets: [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 2, 3]
    }

    getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
    }

    setColors = (num) => {
        let colors = [];
        for (let i = 0; i < num; i++){
            while (true){
                let r = this.getRandomInt(0, 256)
                let g = this.getRandomInt(0, 256)
                let b = this.getRandomInt(0, 256)
                let rgb = "rgb(" + r + ", " + g + ", " + b + ")"
                if (!colors.includes(rgb)){
                    colors.push(rgb)
                    break;
                }
            }
        }
        return colors;
    }

    componentDidMount() {
        let date = this.state.from_value;
        date.setDate(date.getDate() - 7)
        this.setState({from_value: date})
    }

    enumerateDaysBetweenDates = function(startDate, endDate) {
        var dates = [];
    
        var currDate = moment(startDate).startOf('day');
        var lastDate = moment(endDate).startOf('day');
        //console.log(currDate.toDate());
        dates.push(currDate.clone().format("YYYYMMDD"))
        while(currDate.add(1, 'days').diff(lastDate) <= 0) {
            //console.log(currDate.toDate());
            dates.push(currDate.clone().format("YYYYMMDD"));
        }
        return dates;
    };

    render() {
        if (moment(this.state.from_value).startOf('day').diff(moment(this.state.to_value)) > 0) {
            this.setState({to_value: this.state.from_value})
        } 
        //console.log(this.enumerateDaysBetweenDates(this.state.from_value, this.state.to_value))

        return(
            <Box p = {6} id = "time_stats" display = "flex" justifyContent="center" gap = {1}>
                <Box p = {1}>
                    <Menu page = "exerciseDetail"></Menu>
                </Box>
                <Paper p ={6} display = 'flex' justifyContent='center' alignItems = "center" gap = {1} sx={{width: "60%"}} >
                    <Box p = {2} display = 'flex' justifyContent='center' alignItems = "center" gap = {"7.5%"}>
                        <MobileDatePicker
                                label="From"
                                value={this.state.from_value}
                                onChange={(newValue) => this.setState({from_value: newValue})}
                                renderInput={(params) => <TextField {...params} />}
                        />
                        <Divider orientation = "vertical" textAlign="center" flexItem><Chip label = "~"/></Divider>
                        <MobileDatePicker
                                label="To"
                                value={this.state.to_value}
                                onChange={(newValue) => this.setState({to_value: newValue})}
                                renderInput={(params) => <TextField {...params} />}
                        />
                    </Box>
                    <Divider variant = "middle" flexItem />
                    <Box p = {1} display = "flex" justifyContent = "center" alignItems = "center">
                        <Box sx = {{width: "40%"}}><Button>TEST</Button></Box>
                        <Divider orientation = "vertical" variant = "middle" flexItem/>
                        <Box sx = {{width: "60%"}}>
                            <Doughnut
                                data = {{
                                    labels: this.state.body_parts,
                                    datasets: [{
                                        data: this.state.numSets,
                                        backgroundColor: this.setColors(13)
                                    }]
                                }}
                                options ={{
                                    plugins: {
                                        outlabels: {
                                            backgroundColor: "white", // Background color of Label
                                            borderColor: "none", // Border color of Label
                                            borderRadius: 0, // Border radius of Label
                                            borderWidth: 0, // Thickness of border
                                            color: "black", // Font color
                                            display: false,
                                            lineWidth: 1, // Thickness of line between chart arc and Label
                                            padding: 0,
                                            lineColor: "black",
                                            textAlign: "center",
                                            stretch: 45,
                                        },
                                        labels: false
                                    },
                                    legend: {
                                        display: true,
                                        position: "right",
                                        align: "center",
                                        fontFamily: "Allianz-Neo",
                                        textDirection: 'ltr',
                                        labels: {
                                            usePointStyle: true,
                                            fontColor: "#006192",
                                        }
                                    }
                                }}/>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        )
    }
}

const mapStateToProps = state => {
    return {
        workoutList: state.workout.workoutEntries,
    }
}

export default connect(mapStateToProps, null)(withRouter(TimeframeStatistics))