import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import Menu from '../Menu/Menu';

import { Paper, Box, Typography, Button, Divider} from "@mui/material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { Line } from 'react-chartjs-2'



class SelectedStatistics extends Component {
    
    state = {
        header: "",
        query: [],
        num_exercise: -1,
        target_exercise: [],
        colors: [],
        labels: [],
        oneRM_datas: [],
        volume_datas: [],
        chartType: "one_rm"
    }


    checkTags = (tagList, target_tag) => {
        let flag = true;
        let small_flag;
        for (let tag of tagList){
            small_flag = false;
            for (let exerciseTag of target_tag) {
                if (exerciseTag.toUpperCase() === tag.toUpperCase()) {
                    small_flag = true;
                }
            }
            if (!small_flag) flag = false;
        }
        return flag
    }

    filterFunction = (exercise, querySet) => {
        if (querySet.length > 2) {
            return ((exercise["muscleType"] === querySet[0]) && (exercise["exerciseType"] === querySet[1]) 
                    && this.checkTags(exercise["tags"]["tags"], querySet.slice(2)))
        }
        else {
            return (exercise["muscleType"] === querySet[0]) && (exercise["exerciseType"] === querySet[1])
        }
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

    sortFunction = (a, b) => {
        return a.date-b.date
    }

    setChartData = (data_set) => {
        let labels = [];
        let datas = [];
        for(let data in data_set){
            labels.push(data_set[data].date)
            datas.push(data_set[data].value.toFixed(2))
        }
        return {labels: labels, data: datas}
    }

    onChangeChartTypeHandler = (type) => {
        this.setState({chartType: type})
    }

    componentDidMount() {
        let querySet = this.props.match.params.query.split("=");
        this.setState({query: querySet})
        let temp = ""
        for (let query of querySet){
            temp = temp + query + " & "
        }
        this.setState({header: temp.slice(0, -3)})

        // part for get numbers of exercise
        let filtered = this.props.exerciseList.filter((exercise) => this.filterFunction(exercise, querySet)); 
        console.log(filtered)
        this.setState({num_exercise: filtered.length, target_exercise: filtered})

        //part for setting random colors
        this.setState({colors: this.setColors(filtered.length)})

        // part for setting chart datas
        let labels = [];
        let oneRM_dicts = [];
        let oneRM_datas = [];
        let volume_dicts = [];
        let volume_datas = [];
        for (let exercise of filtered) {
            let oneRM_data = exercise['oneRms']
            let volume_data = exercise['volumes']
            oneRM_data.sort(this.sortFunction)
            volume_data.sort(this.sortFunction)
            oneRM_data = this.setChartData(oneRM_data)
            volume_data = this.setChartData(volume_data)
            for (let label of oneRM_data["labels"]) {
                if (labels.includes(label) === false) labels.push(label)
            }
            oneRM_dicts.push(oneRM_data)
            volume_dicts.push(volume_data)
        }
        labels.sort((a, b) => a - b)
        for (let i = 0; i < filtered.length; i++) {
            let oneRM_data = [];
            let volume_data = [];
            let oneRM_dict = oneRM_dicts[i]
            let volume_dict = volume_dicts[i]
            for (let date of labels) {
                if (oneRM_dict["labels"].includes(date)){
                    let idx = oneRM_dict["labels"].indexOf(date)
                    oneRM_data.push(oneRM_dict["data"][idx])
                    volume_data.push(volume_dict["data"][idx])
                }
                else {
                    oneRM_data.push(NaN)
                    volume_data.push(NaN)
                }
            }
            oneRM_datas.push(oneRM_data)
            volume_datas.push(volume_data)
        }

        this.setState({labels: labels, oneRM_datas: oneRM_datas, volume_datas: volume_datas})
    }

    render() {
        console.log(this.state)
        let colorList = null;
        let datasets = null;
        let labels = null;
        if (this.state.num_exercise !== -1) {
            labels = this.state.labels;
            datasets = [];
            colorList = [];
            for (let i = 0; i < this.state.num_exercise; i++) {
                let data = {
                    label: this.state.target_exercise[i]["name"] + (this.state.chartType === "volume" ? " (Volume)" : " (1RM)"),
                    data: this.state.chartType === "volume" ? this.state.volume_datas[i] : this.state.oneRM_datas[i],
                    borderColor: this.state.colors[i],
                    tension: 0.3
                }
                datasets.push(data)
                let colorItem = (
                    <ListItem>
                        <ListItemText primary = {this.state.target_exercise[i]["name"]}/>
                    </ListItem>
                )
                let colorDivider = (
                    <Divider style={{ background: this.state.colors[i], borderBottomWidth: 5 }} variant = "middle"  flexItem/>
                )
                colorList.push(colorItem)
                colorList.push(colorDivider)
            }
        }

        return (
            
            <Box p = {6} display = "flex" justifyContent="center" gap = {1}>
                <Box p = {1}>
                    <Menu page = "exerciseDetail"></Menu>
                </Box>
                <Paper p ={6} display = 'flex' flexDirection = "column" justifyContent='center' alignItems = "center" sx={{width: "60%"}}>
                    <Box p = {1} display = "flex" justifyContent = 'center' alignItems = 'center'>
                        <Box sx ={{width: "90%"}}><Typography variant = "h4">{this.state.header}</Typography></Box>
                    </Box>
                    <Divider variant = "middle"/>
                    <Box display = "flex">
                        <Box display = 'flex' flexDirection = "column" justifyContent = "flex-start" alignItems = "center" sx = {{width:"20%"}}>
                            <List>
                                {colorList}
                            </List>
                        </Box>
                        <Divider orientation = "vertical" variant = "middle" flexItem/>
                        <Box sx = {{width: "80%", minHeight: 300}} display ="flex" flexDirection = "column" justifyContent = "center" alignItems = "center" gap ={1}>
                            <Box sx = {{width: "90%", height: "90%"}}>
                                <Line
                                    data = {{
                                        labels: labels,
                                        datasets: datasets
                                    }}
                                    width = {'60%'}
                                    options={{ maintainAspectRatio: false, spanGaps: true}}
                                />  
                            </Box>
                            <Box display = "flex" flexDirection = "row" justifyContent = "center" alignItems = "center" gap = {6}>
                                <Box sx = {{width: "50%"}} display = "flex" justifyContent = "center" alignItems = "center">
                                    {
                                        this.state.chartType === "volume" ? 
                                        (<Button variant = "contained" onClick = {() => this.onChangeChartTypeHandler("volume")}>Volume</Button>) : 
                                        (<Button variant = "outlined" onClick = {() => this.onChangeChartTypeHandler("volume")}>Volume</Button>)
                                    }    
                                </Box>
                                <Box sx = {{width: "50%"}}>
                                    {
                                        this.state.chartType === "one_rm" ? 
                                        (<Button variant = "contained" onClick = {() => this.onChangeChartTypeHandler("one_rm")}>One RM</Button>) : 
                                        (<Button variant = "outlined" onClick = {() => this.onChangeChartTypeHandler("one_rm")}>One RM</Button>)
                                    }
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        exerciseList: state.exercise.exerciseList,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {};
}

export default connect(mapStateToProps, null)(withRouter(SelectedStatistics))