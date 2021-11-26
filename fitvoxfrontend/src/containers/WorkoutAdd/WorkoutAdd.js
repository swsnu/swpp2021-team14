import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';
import { withRouter } from 'react-router';
import {Button, Box} from "@mui/material";
import './WorkoutAdd.css';
import Menu from "../Menu/Menu";
import ExerciseEntry from "../../components/ExerciseEntry/ExerciseEntry";
import MuscleTypeIcon from "../../components/MuscleTypeIcon/MuscleTypeIcon";
import ExerciseTypeIcon from "../../components/ExerciseTypeIcon/ExerciseTypeIcon";

class WorkoutAdd extends Component {
    state = {
        muscleType_selected: false,
        exerciseType_selected: false,
        muscleType: null,
        exerciseType: null,
        tags: [],
        tag: "#",
        query: [],
        show_favorite: false
    }

    onMuscleTypeClick(muscleType) {
        this.setState({muscleType_selected: true})
        this.setState({muscleType: muscleType})
        this.setState({query: [...this.state.query, muscleType]})
    }

    onExerciseTypeClick(exerciseType) {
        this.setState({exerciseType_selected: true})
        this.setState({exerciseType: exerciseType})
        this.setState({query: [...this.state.query, exerciseType]})
    }

    onExerciseEntryClick = (id) => {
        this.props.onAddWorkout(this.props.match.params.date, id);
        this.props.history.push('/workout/'+ this.props.match.params.date);
    }

    onGoBackMuscleType = () => {
        this.setState({muscleType_selected: false})
        this.setState({muscleType: null})
        this.setState({exerciseType_selected: false})
        this.setState({exerciseType: null})
        this.setState({query: []})
        this.setState({tags: []})
    }

    onGoBackExerciseType = () => {
        this.setState({exerciseType_selected: false})
        this.setState({exerciseType: null})
        this.setState({query: [this.state.query[0]]})
        this.setState({tags: []})
    }

    onSearchTagHandler = () => {
        let input_tag = this.state.tag;
        this.setState({query: [...this.state.query, input_tag], tag: "#", tags: [...this.state.tags, input_tag]})
    }

    onDeleteTag = (tag) => {
        const idx = this.state.tags.indexOf(tag);
        if (this.state.tags.length == 1) this.setState({tags: []})
        else {
            const newTags = this.state.tags.splice(idx, 1)
            this.setState({tags: newTags})
        }
    }

    onShowFavorite = () => {
        this.setState({show_favorite: !this.state.show_favorite})
    }

    onFavoriteCheck = (id) => {
        console.log("Favorite Checked!");
        this.props.onFavoriteCheck({id: id, target: "favorite"});
    }

    onCancel = () =>{
        this.props.history.push('/workout/'+ this.props.match.params.date)
    }

    addTag = () => {
        let add_tag_button = (<Button id="search-with-tag"
                                      style={{width: '5%', height: 100}}
                                      onClick={() => this.onSearchTagHandler()}>
            Add Tag
        </Button>)
        return (
            <div>
                <h1>Type Tag to search</h1>
                <div>
                        <textarea
                            id="tag-bar"
                            value={this.state.tag}
                            style={{width: '30%', height: 100}}
                            onChange={(event) => this.setState({tag: event.target.value})}
                        />
                    {add_tag_button}
                </div>
            </div>
        )
    }

    header = () => {
        return (
            <div align="center">
                <h1 align="center">Add Exercise to Workout</h1>
                <Button
                    onClick={() => this.onShowFavorite()}>{this.state.show_favorite ? "Show Exercise Lists" : "Show Favorite"}</Button>
                <Button onClick={()=>this.onCancel()}>Cancel</Button>
                <hr/>
            </div>
        )

    }

    render() {
        if (this.state.show_favorite) {
            let exerciseEntries = ""
            if (this.props.exerciseList != null) {
                exerciseEntries = []
                for (let exercise of this.props.exerciseList) {
                    if (exercise['hardness'].indexOf(this.props.hardness) !== -1
                        && exercise['isFavorite']) {
                        const name = exercise['name']
                        exerciseEntries.push(<ExerciseEntry name={name}
                                                            onClick={() => this.onExerciseEntryClick(exercise['id'])}
                                                            onCheck={() => this.onFavoriteCheck(exercise['id'])}
                                                            isFavorite={exercise['isFavorite']}/>)
                    }
                }
            }
            return (
                <div align="center" className="ExerciseList">
                    {this.header()}
                    <div> {exerciseEntries}</div>
                </div>
            )
        } else if (!this.state.muscleType_selected) {
            let muscleTypeIcons = "";
            if (this.props.muscleTypes != null) {
                muscleTypeIcons = this.props.muscleTypes.map(muscleType => {
                    return (
                        <MuscleTypeIcon muscleType={muscleType} onClick={() => this.onMuscleTypeClick(muscleType)}/>)
                })
            }
            return (
                <Box p = {6} display = "flex" justifyContent="center" gap = {1}>
                    <Box p = {1}>
                        <Menu page = "addWorkout"></Menu>
                    </Box>
                    <Box sx = {{width: "60%"}}>
                        <div align="center" className="ExerciseList">
                            {this.header()}
                            <h1>Select Muscle Type</h1>
                            <div>{muscleTypeIcons}</div>
                        </div>
                    </Box>
                </Box>
            );
        } else if (!this.state.exerciseType_selected) {
            let exerciseTypeIcons = ""
            if (this.props.exerciseTypes != null) {
                exerciseTypeIcons = []
                for (let exerciseType of this.props.exerciseTypes) {
                    if (exerciseType['muscleType'] === this.state.muscleType) {
                        const selected_type = exerciseType['exerciseType']
                        exerciseTypeIcons.push(<ExerciseTypeIcon exerciseType={selected_type}
                                                                 onClick={() => this.onExerciseTypeClick(selected_type)}/>)
                    }
                }
            }

            return (
                <Box p = {6} display = "flex" justifyContent="center" gap = {1}>
                    <Box p = {1}>
                        <Menu page = "addWorkout"></Menu>
                    </Box>
                    <Box sx = {{width: "60%"}}>
                        <div className="ExerciseList">
                            {this.header()}
                            <h1 align="center">Select Exercise Type</h1>
                            <div aligh="center">
                                <p align="center" className="SelectedType">
                                    Selected Muscle Type: {this.state.muscleType} <Button id="go-back-muscleType"
                                                                                        onClick={() => this.onGoBackMuscleType()}>Select
                                    Muscle Type again</Button>
                                </p>
                                <hr/>
                            </div>
                            <div>{exerciseTypeIcons}</div>
                        </div>
                    </Box>
                </Box>
            )
        } else {
            let exerciseEntries = ""
            if (this.props.exerciseList != null) {
                exerciseEntries = []
                for (let exercise of this.props.exerciseList) {
                    if (exercise['muscleType'] === this.state.muscleType &&
                        exercise['exerciseType'] === this.state.exerciseType
                        && exercise['hardness'].indexOf(this.props.hardness) !== -1) {
                        if (this.state.tags.length === 0) {
                            const name = exercise['name']
                            exerciseEntries.push(<ExerciseEntry name={name}
                                                                onClick={() => this.onExerciseEntryClick(exercise['id'])}
                                                                isFavorite={exercise['isFavorite']}
                                                                onCheck={() => this.onFavoriteCheck(exercise['id'])}/>)
                        } else {
                            let flag = true;
                            let small_flag;
                            for (let i = 0; i < this.state.tags.length; i++) {
                                let tag = this.state.tags[i];
                                small_flag = false;
                                for (let exerciseTag of exercise["tags"]["tags"]) {
                                    if (exerciseTag.toUpperCase() === tag.toUpperCase()) {
                                        small_flag = true;
                                    }
                                }
                                if (!small_flag) flag = false;
                            }
                            if (flag) {
                                const name = exercise['name']
                                exerciseEntries.push(<ExerciseEntry name={name}
                                                                    onClick={() => this.onExerciseEntryClick(exercise['id'])}
                                                                    onCheck={() => this.onFavoriteCheck(exercise['id'])}
                                                                    isFavorite={exercise['isFavorite']}/>)
                            }
                        }
                    }
                }
            }

            let tag_entries = []
            for (let tag of this.state.tags) {
                tag_entries.push(<div>
                    {tag}
                    <Button id='delete-tag' onClick={() => this.onDeleteTag(tag)}>Delete</Button>
                </div>)
            }

            return (
                <Box p = {6} display = "flex" justifyContent="center" gap = {1}>
                    <Box p = {1}>
                        <Menu page = "addWorkout"></Menu>
                    </Box>
                    <Box sx = {{width: "60%"}}>
                        <div className="ExerciseList">
                            {this.header()}
                            <div align="center">
                                <p className="SelectedType" align="center">
                                    Selected Muscle Type: {this.state.muscleType} <Button id="go-back-muscleType"
                                                                                        onClick={() => this.onGoBackMuscleType()}>Select
                                    Muscle Type again</Button>
                                </p>
                                <p className="SelectedType " align="center">
                                    Selected Exercise Type: {this.state.exerciseType} <Button id="go-back-exerciseType"
                                                                                            onClick={() => this.onGoBackExerciseType()}>Select
                                    Exercise Type again</Button>
                                </p>
                                <hr/>
                            </div>
                            <div align="center">
                                <h2>Selected Tags</h2>
                                {tag_entries.length == 0 ? "None" : tag_entries}
                                <Button>Show Selected Statistics</Button>
                            </div>
                            <div align="center">
                                {this.addTag()}
                                <hr/>
                            </div>
                            <div>
                                {exerciseEntries}
                            </div>
                        </div>
                    </Box>
                </Box>
            )
        }
    }
}

const mapStateToProps = (state) => {
    return {
        muscleTypes: state.exercise.muscleTypes,
        exerciseTypes: state.exercise.exerciseTypes,
        exerciseList: state.exercise.exerciseList,
        hardness: state.setting.hardness
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onFavoriteCheck: (data) => dispatch(actionCreators.checkFavorite(data)),
        onAddWorkout: (date, id) => dispatch(actionCreators.addWorkout(date, id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(WorkoutAdd));