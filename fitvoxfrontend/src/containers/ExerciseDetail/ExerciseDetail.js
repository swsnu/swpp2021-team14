import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import * as actionCreators from "../../store/actions"

import { Paper, Box, Typography, Button, Divider, TextField, IconButton} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarTwoToneIcon from '@mui/icons-material/StarTwoTone';
import Menu from '../Menu/Menu';

import { Line } from 'react-chartjs-2'

class ExerciseDetail extends Component {
    state = {
        exercise_id: -1,
        exercisename: "",
        exercise: null,
        tags: [],
        tag: "",
        favorite: false,
        one_rm: {
            labels: [],
            data: []
        },
        volume: {
            labels: ['sun', 'mon', 'tue', 'wed', 'thur', 'fri', 'sat'],
            data: [71, 68, 63, 78, 60, 46, 61],
        },
        chart_type: "one_rm",
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

    componentDidMount() {
        let exid = parseInt(this.props.match.params.exercise_id);
        this.setState({exercise_id: exid})
        // console.log(this.props.exerciseList)
        let exercise = this.props.exerciseList.filter((exercise) => {
            return exercise['id'] === exid
        })[0] 
        // console.log(exercise)
        this.setState({exercise: exercise})
        this.setState({exercisename: exercise['name']})
        this.setState({tags: exercise['tags']['tags']})
        this.setState({favorite: exercise['isFavorite']})
        let oneRM_data = exercise['oneRms']
        let volume_data = exercise['volumes']
        oneRM_data.sort(this.sortFunction)
        volume_data.sort(this.sortFunction)
        this.setState({one_rm: this.setChartData(oneRM_data)})
        this.setState({volume: this.setChartData(volume_data)})
        //assert that in this page, the value of 1RM and Volume don't change
    }

    // change this part for delete tag
    onDeleteTagHandler = (tag) => {
        let newTags = this.state.tags.filter((_tag) => {
            return _tag !== tag 
        })
        this.setState({tags: newTags})
        let data = {
            id: this.state.exercise_id,
            target: "tags",
            tags: {tags: newTags},
        }
        this.props.onChangeTags(data)
    }

    // change this part for add new tags
    onAddTagHandler = () => {
        if (this.state.tag ===  "" || this.state.tag === '#') {
            this.setState({tag: ""})
        }
        else {
            let newTag = this.state.tag;
            let newTags = [...this.state.tags, newTag]
            this.setState({tag: "", tags: newTags})
            let data = {
                id: this.state.exercise_id,
                target: "tags",
                tags: {tags: newTags},
            }
            this.props.onChangeTags(data)
        }
    }

    // change this part for bookmarking exercise
    onBookmarkHandler = () => {
        // TODO: adjust isFavorite value to Django backend server using axios
        this.setState({favorite: !this.state.favorite})
        this.props.onFavoriteCheck({id: this.state.exercise_id, target: "favorite"});
    }

    onChangeChartTypeHandler = (type) => {
        this.setState({chart_type: type})
    }

    render() {
        //console.log(this.state)
        let tagIcons = [];
        for (let tag of this.state.tags) {
            tagIcons.push(
                <Box display = 'flex' flexDirection = 'row' alignItems='center'>
                    <Typography color = 'blue'>{tag}</Typography>
                    <IconButton id = "delete_tag" aria-label="delete" size ='small' onClick = {()=> this.onDeleteTagHandler(tag)}>
                        <DeleteIcon fontSize = 'inherit' />
                    </IconButton>
                </Box>
            )
        }
        let star = (
            <IconButton id = "favorite" aria-label = "isFavorite" onClick = {() => this.onBookmarkHandler()}>
                <StarBorderIcon style = {{fill: 'black', fontSize: 45}}/>
            </IconButton>
        )
        if (this.state.favorite) {
            star = (
                <IconButton id = "favorite" aria-label = "isFavorite" onClick = {() => this.onBookmarkHandler()}>
                    <StarTwoToneIcon style = {{fill: 'gold', fontSize: 45}}/>
                </IconButton>
            )
        } 

        
        return (
            <Box p = {6} id = "ExerciseDetail" display = "flex" justifyContent="center" gap = {1}>
                <Box p = {1}>
                    <Menu page = "exerciseDetail"></Menu>
                </Box>
                <Paper p ={6} display = 'flex' flexDirection = "column" justifyContent='center' alignItems = "center" sx={{width: "60%"}}>
                    <Box p = {1} display = "flex" justifyContent = 'center' alignItems = 'center'>
                        <Box sx ={{width: "90%"}}><Typography variant = "h2">{this.state.exercisename}</Typography></Box>
                        <Box display = 'flex' sx = {{width: "10%"}}  justifyContent = 'center' alignItems='right'>
                            {star}
                        </Box>
                    </Box>
                    <Divider variant = "middle"/>
                    <Box display = 'flex' >
                        <Box display = 'flex' flexDirection = "column" justifyContent = "center" alignItems = "center" sx = {{width:"30%"}}>
                            <Box ><img src = {'../ExerciseTypeImage/Bench_Press.png'}/></Box>
                            <Divider variant = "middle" p = {1} flexItem />
                            <Box display = 'flex' flexDirection = 'column' sx = {{width:"80%"}}>
                                {tagIcons}
                            </Box>
                            <Box p={2}></Box>
                            <Box p={1} display = 'flex' flexDirection = 'row' justifyContent = 'center' alignItems='center'>
                                <TextField
                                    id = "tag_input"
                                    variant="outlined"
                                    label="New Tag"
                                    value={this.state.tag}
                                    onClick = {() => this.setState({tag: "#"})}
                                    onChange={(event) => this.setState({ tag: event.target.value })}
                                />
                                <IconButton id = "add_tag_button" aria-label="add" onClick = {() => {this.onAddTagHandler()}}>
                                    <AddIcon/>
                                </IconButton>
                            </Box>
                        </Box>
                        <Divider orientation = "vertical" variant = "middle" flexItem/>
                        <Box sx = {{width: "70%"}} display ="flex" flexDirection = "column" justifyContent = "center" alignItems = "center" gap ={1}>
                            <Box sx = {{width: "90%", height: "90%"}}>
                                <Line
                                    data={{
                                        labels: this.state.chart_type === "volume" ? this.state.volume.labels : this.state.one_rm.labels,
                                        datasets: [{
                                        label: this.state.exercisename + (this.state.chart_type === "volume" ? " (Volume)" : " (1RM)"),
                                        data: this.state.chart_type === "volume" ? this.state.volume.data : this.state.one_rm.data,
                                        fill: false,
                                        borderColor: 'rgb(75, 192, 192)',
                                        tension: 0.3
                                        }]
                                    }}
                                    width = {'60%'}
                                    options={{ maintainAspectRatio: false }}
                                />
                            </Box>
                            <Box display = "flex" flexDirection = "row" justifyContent = "center" alignItems = "center" gap = {6}>
                                <Box sx = {{width: "50%"}} display = "flex" justifyContent = "center" alignItems = "center">
                                    {
                                        this.state.chart_type === "volume" ? 
                                        (<Button id = "volume" variant = "contained" onClick = {() => this.onChangeChartTypeHandler("volume")}>Volume</Button>) : 
                                        (<Button id = "volume" variant = "outlined" onClick = {() => this.onChangeChartTypeHandler("volume")}>Volume</Button>)
                                    }    
                                </Box>
                                <Box sx = {{width: "50%"}}>
                                    {
                                        this.state.chart_type === "one_rm" ? 
                                        (<Button id = "one_rm" variant = "contained" onClick = {() => this.onChangeChartTypeHandler("one_rm")}>One RM</Button>) : 
                                        (<Button id = "one_rm" variant = "outlined" onClick = {() => this.onChangeChartTypeHandler("one_rm")}>One RM</Button>)
                                    }
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Box>
            
        );
    }
}

const mapStateToProps = (state) => {
    return {
        exerciseList: state.exercise.exerciseList,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onChangeTags: (data) => dispatch(actionCreators.changeTags(data)),
        onFavoriteCheck: (data) => dispatch(actionCreators.checkFavorite(data))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ExerciseDetail));