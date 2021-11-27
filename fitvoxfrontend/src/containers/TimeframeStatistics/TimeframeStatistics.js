import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';

import Menu from '../Menu/Menu';

import { Paper, Box, Typography, Button, Divider, IconButton} from "@mui/material";

import TextField from '@mui/material/TextField';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import Chip from '@mui/material/Chip';


class TimeframeStatistics extends Component {

    state = {
        from_value: new Date(),
        to_value: new Date(),
    }

    componentDidMount() {
        let date = this.state.from_value;
        date.setDate(date.getDate() - 7)
        this.setState({from_value: date})
    }

    render() { 

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
                    <Box display = "flex" justifyContent = "center" alignItems = "center"><Button>ASDF</Button></Box>
                </Paper>
            </Box>
        )
    }
}

export default connect(null, null)(withRouter(TimeframeStatistics))