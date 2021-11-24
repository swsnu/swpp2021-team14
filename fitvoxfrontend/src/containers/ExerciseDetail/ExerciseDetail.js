import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux'

import { Paper, Box, Typography, Button, Divider, Stack, TextField, IconButton} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarTwoToneIcon from '@mui/icons-material/StarTwoTone';
import Menu from '../Menu/Menu';

class ExerciseDetail extends Component {
    state = {
        exercisename: "",
        tags: [],
        tag: "",
        favorite: false
    }
    
    componentDidMount() {
        let exercisename = this.props.match.params.exercisename;
        this.setState({exercisename: exercisename})
        let exercise = this.props.exerciseList.filter((exercise) => {
            return exercise['name'] === exercisename
        })[0] //assert that there is no duplicated names for exercise
        for (let tag of exercise['tags']['tags']){
            this.setState({tags: [...this.state.tags, tag]})
        }
        this.setState({tags: exercise['tags']['tags']})
        this.setState({favorite: exercise['isFavorite']})
    }

    // change this part for delete tag
    onDeleteTagHandler = (tag) => {
        console.log(tag);
        let newTags = this.state.tags.filter((_tag) => {
            return _tag !== tag 
        })
        this.setState({tags: newTags})
        // TODO: adjust changed tags to Django backend server using axios
    }

    // change this part for add new tags
    onAddTagHandler = () => {
        console.log(this.state.tag)
        if (this.state.tag ===  "" || this.state.tag === '#') {
            this.setState({tag: ""})
        }
        else {
            let newTag = this.state.tag;
            this.setState({tag: "", tags:[...this.state.tags, newTag]})
        }
        // TODO: adjust tag in state to django backend server using axios
    }

    // change this part for bookmarking exercise
    onBookmarkHandler = () => {
        // TODO: adjust isFavorite value to Django backend server using axios
        this.setState({favorite: !this.state.favorite})
    }


    render() {
        console.log(this.state)
        let tagIcons = [];
        for (let tag of this.state.tags) {
            tagIcons.push(
                <Box display = 'flex' flexDirection = 'row' alignItems='center'>
                    <Typography color = 'blue'>{tag}</Typography>
                    <IconButton aria-label="delete" size ='small' onClick = {()=> this.onDeleteTagHandler(tag)}>
                        <DeleteIcon fontSize = 'inherit' />
                    </IconButton>
                </Box>
            )
        }
        let star = (
            <IconButton aria-label = "isFavorite" onClick = {() => this.onBookmarkHandler()}>
                <StarBorderIcon style = {{fill: 'black', fontSize: 45}}/>
            </IconButton>
        )
        if (this.state.favorite) {
            star = (
                <IconButton aria-label = "isFavorite" onClick = {() => this.onBookmarkHandler()}>
                    <StarTwoToneIcon style = {{fill: 'gold', fontSize: 45}}/>
                </IconButton>
            )
        } 
        return (
            <Box p = {6} display = "flex" justifyContent="center" gap = {1}>
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
                                    variant="outlined"
                                    label="New Tag"
                                    value={this.state.tag}
                                    onClick = {() => this.setState({tag: "#"})}
                                    onChange={(event) => this.setState({ tag: event.target.value })}
                                />
                                <IconButton aria-label="add" onClick = {() => {this.onAddTagHandler()}}>
                                    <AddIcon/>
                                </IconButton>
                            </Box>
                        </Box>
                        <Divider orientation = "vertical" variant = "middle" flexItem/>
                    </Box>
                </Paper>
            </Box>
            
        );
    }
}

const mapStateToProps = (state) => {
    return {
        muscleTypes: state.exercise.muscleTypes,
        exerciseTypes: state.exercise.exerciseTypes,
        exerciseList: state.exercise.exerciseList,
        hardness: state.setting.hardness
    };
}

const mapDispatchToProps = dispatch => {
    return {};
}

export default connect(mapStateToProps, null)(withRouter(ExerciseDetail));