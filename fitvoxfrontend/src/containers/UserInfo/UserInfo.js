import React, {Component} from "react";
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import * as actionCreators from '../../store/actions/index';
import {Box, Paper, Typography, Divider, Button, Stack, OutlinedInput, InputAdornment} from '@mui/material';
import { Line } from 'react-chartjs-2'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';


import Menu from '../Menu/Menu'

class UserInfo extends Component {
    state = {
        mode: "Summary",
        colors_bodyStats: [],
        labels_bodyStats: [],
        bodyFat_datas: [],
        bodyWeight_datas: [],
        SMM_datas: [],

        colors_Big3: [],
        labels_Big3: [],
        oneRM_datas: [], //S -> D -> B
        volume_datas: [], //S -> D -> B
        chartType: "volume",
        Big3_Summary: [],
    }
    
    sortFunction = (a, b) => {
        return a.date - b.date
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

    setChartData = (data_set) => {
        let labels = [];
        let datas = [];
        for(let data in data_set){
            labels.push(data_set[data].date)
            datas.push(data_set[data].value.toFixed(2))
        }
        return {labels: labels, data: datas}
    }

    componentDidMount() {
        // Gets Information about Body Statistics
        this.props.onGetBodyInfo();
        let dataset = this.props.bodyInfo;
        dataset.sort(this.sortFunction)
        console.log(dataset)
        let dates = [];
        let Fat_datas = [];
        let Weight_datas = [];
        let SMM_datas = [];

        for (let data of dataset){
            dates.push(data.date)
            Fat_datas.push(data.bodyFat)
            Weight_datas.push(data.bodyWeight)
            SMM_datas.push(data.skeletalMuscle)
        }
        this.setState({labels_bodyStats: dates})
        this.setState({bodyFat_datas: Fat_datas})
        this.setState({bodyWeight_datas: Weight_datas})
        this.setState({SMM_datas: SMM_datas})
        this.setState({colors_bodyStats: this.setColors(3)})

        // Gets Information about Big 3
        // Filter 3 Exercises
        let target_exercise = [];
        let filter = [
            "Squat: Barbell", 
            "Dead Lift: Barbell, Back", 
            "Bench Press: Barbell"
        ]
        for (let exercise_name of filter) {
            let target = this.props.exerciseList.filter((exercise) => {
                return exercise["name"] === exercise_name
            })[0]
            target_exercise.push(target)
        }

        let labels = [];
        let oneRM_dicts = [];
        let oneRM_datas = [];
        let volume_dicts = [];
        let volume_datas = [];
        for (let exercise of target_exercise){
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
        for (let i = 0; i< 3; i ++) {
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
        console.log(labels)
        console.log(oneRM_datas)
        console.log(volume_datas)
        let S_RM = 0;
        let S_V = 0;
        let D_RM = 0;
        let D_V = 0;
        let B_RM = 0;
        let B_V = 0;
        let Big3_1RM = [];
        let Big3_Volume = [];
        console.log(NaN == NaN)
        for (let i = 0; i < labels.length; i++) {
            S_RM = isNaN(oneRM_datas[0][i]) ? S_RM : Math.max(S_RM, (oneRM_datas[0][i]))
            D_RM = isNaN(oneRM_datas[1][i]) ? D_RM : Math.max(D_RM, (oneRM_datas[1][i]))
            B_RM = isNaN(oneRM_datas[2][i]) ? B_RM : Math.max(B_RM, (oneRM_datas[2][i]))
            Big3_1RM.push((S_RM + D_RM + B_RM).toFixed(2))

            S_V = isNaN(volume_datas[0][i]) ? S_V : Math.max(S_V, (volume_datas[0][i]))
            D_V = isNaN(volume_datas[1][i]) ? D_V : Math.max(D_V, (volume_datas[1][i]))
            B_V = isNaN(volume_datas[2][i]) ? B_V : Math.max(B_V, (volume_datas[2][i]))
            Big3_Volume.push((S_V + D_V + B_V).toFixed(2))
        }
        oneRM_datas.push(Big3_1RM)
        volume_datas.push(Big3_Volume)
        this.setState({colors_Big3: this.setColors(4)})
        this.setState({labels_Big3: labels, oneRM_datas: oneRM_datas, volume_datas: volume_datas})
        this.setState({Big3_Summary:[(S_RM + D_RM + B_RM).toFixed(2), S_RM, D_RM, B_RM]})
    }

    onClickSummaryButton = () => {
        this.setState({mode: "Summary"})
    }

    onClickBodyStatsButton = () => {
        this.setState({mode: "Body Stats"})
    }

    onClickBig3Button = () => {
        this.setState({mode: "Big 3"})
    }

    onChangeChartTypeHandler = (type) => {
        this.setState({chartType: type})
    }

    render() {
        let content = null;
        let labels = null;
        let datasets = null;
        if (this.state.mode === "Summary") {
            content = (
                <Box p = {1} display = "flex" justifyContent = "center" alignItems = "center" gap = {1}>
                    <Box sx = {{width: "50%"}}>
                        <Stack sx = {{minHeight:300}}
                            direction="column"
                            justifyContent="space-around"
                            alignItems="center"
                            spacing={2}
                        >
                            <Box sx = {{width: "100%"}} display = "flex" justifyContent = "center">
                                <Box sx = {{width: "50%"}} display = "flex" justifyContent = "flex-start" alignItems = "center">
                                    <Typography marginLeft = {1} variant = "h6">Body Weight</Typography>
                                </Box>
                                <Box sx = {{width: "50%"}} display = "flex" justifyContent = "flex-start" alignItems = "center">
                                    <OutlinedInput
                                        sx = {{width: "100%"}}
                                        value = {this.state.bodyWeight_datas[this.state.labels_bodyStats.length - 1]}
                                        endAdornment = {<InputAdornment position = "end">kg</InputAdornment>}
                                    />                                  
                                </Box>
                            </Box>
                            <Box sx = {{width: "100%"}} display = "flex" justifyContent = "center">
                                <Box sx = {{width: "50%"}} display = "flex" justifyContent = "flex-start" alignItems = "center">
                                    <Typography marginLeft = {1} variant = "h6">Body Fat Ratio</Typography>
                                </Box>
                                <Box sx = {{width: "50%"}} display = "flex" justifyContent = "flex-start" alignItems = "center">
                                    <OutlinedInput
                                        sx = {{width: "100%"}}
                                        value = {this.state.bodyFat_datas[this.state.labels_bodyStats.length - 1]}
                                        endAdornment = {<InputAdornment position = "end">%</InputAdornment>}
                                    />                                  
                                </Box>
                            </Box>
                            <Box sx = {{width: "100%"}} display = "flex" justifyContent = "center">
                                <Box sx = {{width: "50%"}} display = "flex" justifyContent = "flex-start" alignItems = "center">
                                    <Typography marginLeft = {1} variant = "h6">Skeletal Muscle Mass</Typography>
                                </Box>
                                <Box sx = {{width: "50%"}} display = "flex" justifyContent = "flex-start" alignItems = "center">
                                    <OutlinedInput
                                        sx = {{width: "100%"}}
                                        value = {this.state.SMM_datas[this.state.labels_bodyStats.length - 1]}
                                        endAdornment = {<InputAdornment position = "end">kg</InputAdornment>}
                                    />                                  
                                </Box>
                            </Box>
                        </Stack>
                    </Box>
                    <Divider orientation = "vertical" variant ="middle" flexItem/>
                    <Box sx = {{width: "50%"}}>
                        <Stack sx = {{minHeight:300}}
                            direction="column"
                            justifyContent="space-around"
                            alignItems="center"
                            spacing={2}
                        >
                            <Box sx = {{width: "100%"}} display = "flex" justifyContent = "center">
                                <Box sx = {{width: "50%"}} display = "flex" justifyContent = "flex-start" alignItems = "center">
                                    <Typography marginLeft = {1} variant = "h6">Big 3 (1RM)</Typography>
                                </Box>
                                <Box sx = {{width: "50%"}} display = "flex" justifyContent = "flex-start" alignItems = "center">
                                    <OutlinedInput
                                        sx = {{width: "100%"}}
                                        value = {this.state.Big3_Summary[0]}
                                        endAdornment = {<InputAdornment position = "end">kg</InputAdornment>}
                                    />                                  
                                </Box>
                            </Box>
                            <Box sx = {{width: "100%"}} display = "flex" justifyContent = "center">
                                <Box sx = {{width: "50%"}} display = "flex" justifyContent = "flex-start" alignItems = "center">
                                    <Typography marginLeft = {1} variant = "h6">Squat (1RM)</Typography>
                                </Box>
                                <Box sx = {{width: "50%"}} display = "flex" justifyContent = "flex-start" alignItems = "center">
                                    <OutlinedInput
                                        sx = {{width: "100%"}}
                                        value = {this.state.Big3_Summary[1]}
                                        endAdornment = {<InputAdornment position = "end">kg</InputAdornment>}
                                    />                                  
                                </Box>
                            </Box>
                            <Box sx = {{width: "100%"}} display = "flex" justifyContent = "center">
                                <Box sx = {{width: "50%"}} display = "flex" justifyContent = "flex-start" alignItems = "center">
                                    <Typography marginLeft = {1} variant = "h6">Dead Lift (1RM)</Typography>
                                </Box>
                                <Box sx = {{width: "50%"}} display = "flex" justifyContent = "flex-start" alignItems = "center">
                                    <OutlinedInput
                                        sx = {{width: "100%"}}
                                        value = {this.state.Big3_Summary[2]}
                                        endAdornment = {<InputAdornment position = "end">kg</InputAdornment>}
                                    />                                  
                                </Box>
                            </Box>
                            <Box sx = {{width: "100%"}} display = "flex" justifyContent = "center">
                                <Box sx = {{width: "50%"}} display = "flex" justifyContent = "flex-start" alignItems = "center">
                                    <Typography marginLeft = {1} variant = "h6">Bench Press (1RM)</Typography>
                                </Box>
                                <Box sx = {{width: "50%"}} display = "flex" justifyContent = "flex-start" alignItems = "center">
                                    <OutlinedInput
                                        sx = {{width: "100%"}}
                                        value = {this.state.Big3_Summary[3]}
                                        endAdornment = {<InputAdornment position = "end">kg</InputAdornment>}
                                    />                                  
                                </Box>
                            </Box>
                        </Stack>
                    </Box>
                </Box>
            )
        }
        else {
            if (this.state.mode === "Body Stats") {
                labels = this.state.labels_bodyStats;
                datasets = [
                    {
                        label: "Body Weight (kg)",
                        data: this.state.bodyWeight_datas,
                        borderColor: this.state.colors_bodyStats[0],
                        tension: 0.3
                    },
                    {
                        label: "Body Fat Ratio (%)",
                        data: this.state.bodyFat_datas,
                        borderColor: this.state.colors_bodyStats[1],
                        tension: 0.3
                    },
                    {
                        label: "Skeletal Muscle Mass (kg)",
                        data: this.state.SMM_datas,
                        borderColor: this.state.colors_bodyStats[2],
                        tension: 0.3
                    },
                ];
                content = (
                    <Box p = {1} display = "flex" flexDirection = "column" justifyContent = "center" alignItems = "center" >
                        <Line
                            data = {{
                                labels: labels,
                                datasets: [datasets[0]]
                            }}
                            options={{ maintainAspectRatio: true, spanGaps: true}}
                        />
                        <Line
                            data = {{
                                labels: labels,
                                datasets: [datasets[1]]
                            }}
                            options={{ maintainAspectRatio: true, spanGaps: true}}
                        />
                        <Line
                            data = {{
                                labels: labels,
                                datasets: [datasets[2]]
                            }}
                            options={{ maintainAspectRatio: true, spanGaps: true}}
                        />
                    </Box>
                )
            }
            else {
                let colorList = [];
                let datasets = [];
                let labels = this.state.labels_Big3;
                let names = [
                    "Squat: Barbell", 
                    "Dead Lift: Barbell, Back", 
                    "Bench Press: Barbell",
                    "Big 3: SDB"
                ]
                for (let i = 0; i < 4; i++) {
                    let data = {
                        label: names[i] + (this.state.chartType === "volume" ? " (Volume)" : " (1RM)"),
                        data: this.state.chartType === "volume" ? this.state.volume_datas[i] : this.state.oneRM_datas[i],
                        borderColor: this.state.colors_Big3[i],
                        tension: 0.3
                    }
                    datasets.push(data)
                    let colorItem = (
                        <ListItem>
                            <ListItemText primary = {names[i]}/>
                        </ListItem>
                    )
                    let colorDivider = (
                        <Divider style={{ background: this.state.colors_Big3[i], borderBottomWidth: 5 }} variant = "middle"  flexItem/>
                    )
                    colorList.push(colorItem)
                    colorList.push(colorDivider)
                }
                content = (
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
                                        (<Button id = "volume" variant = "contained" onClick = {() => this.onChangeChartTypeHandler("volume")}>Volume</Button>) : 
                                        (<Button id = "volume" variant = "outlined" onClick = {() => this.onChangeChartTypeHandler("volume")}>Volume</Button>)
                                    }    
                                </Box>
                                <Box sx = {{width: "50%"}}>
                                    {
                                        this.state.chartType === "one_rm" ? 
                                        (<Button id = "one_rm" variant = "contained" onClick = {() => this.onChangeChartTypeHandler("one_rm")}>One RM</Button>) : 
                                        (<Button id = "one_rm" variant = "outlined" onClick = {() => this.onChangeChartTypeHandler("one_rm")}>One RM</Button>)
                                    }
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                );
            } 
        }

        return (
            <Box p = {6} className = "Main" display = "flex" justifyContent="center" gap ={2}>
                <Box p = {1}>
                    <Box>
                        <Menu page = 'info'></Menu>
                    </Box>
                    
                </Box>
                <Paper elevation = {15} p ={6} display = "flex" flexDirection = "column" justifyContent='center' alignItems='center' gap = {4} sx = {{width: '60%'}}> 
                    <Box p = {1} display = "flex" alignItems = 'center'>
                        <Typography p = {1} variant = "h3">User Information</Typography>
                    </Box>
                    <Divider variant = "middle"/>
                    <Box p = {1} display = "flex" justifyContent = 'center' alignItems = 'center'>
                        <Box sx = {{width:"33%"}} display = "flex" justifyContent = "center">
                            <Button onClick = {() => this.onClickSummaryButton()}
                                variant = {this.state.mode === "Summary" ? "contained" : "outlined"}>
                                    Summary
                            </Button>
                        </Box>
                        <Box sx = {{width:"33%"}} display = "flex" justifyContent = "center">
                            <Button onClick = {() => this.onClickBodyStatsButton()}
                                variant = {this.state.mode === "Body Stats" ? "contained" : "outlined"}>
                                    Body Statistics
                            </Button>
                        </Box>
                        <Box sx = {{width:"33%"}} display = "flex" justifyContent = "center">
                            <Button onClick = {() => this.onClickBig3Button()}
                                variant = {this.state.mode === "Big 3" ? "contained" : "outlined"}>
                                    Big 3
                            </Button>
                        </Box>
                    </Box>
                    {content}
                </Paper>
            </Box>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        bodyInfo: state.statistics.bodyInfo,
        exerciseList: state.exercise.exerciseList
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onGetBodyInfo: ()=> dispatch(actionCreators.getBodyInfo()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserInfo))