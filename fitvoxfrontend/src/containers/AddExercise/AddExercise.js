import React, {Component} from 'react';
import Select from "react-select";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {Checkbox} from "semantic-ui-react";
import * as actionCreators from "../../store/actions/index"
import './AddExercise.css'
import Button from '@mui/material/Button';
import {Box, IconButton} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


import Menu from '../Menu/Menu';

class AddExercise extends Component {

    state = {
        exercise_name: "",
        add_exercise_type: "",
        add_new_exercise: false,
        tags: [],
        tag: "#",
        isFavorite: false,
        muscleType: "",
        exerciseType: ""
    }

    muscleTypeOptions = []

    makeMuscleTypeOptions = () => {
        for (let i = 0; i < this.props.muscleTypes.length; i++) {
            this.muscleTypeOptions.push({value: i, label: this.props.muscleTypes[i]})
        }
    }

    exerciseTypeOptions = []

    makeExerciseTypeOptions = () => {
        if (this.state.muscleType === "") {
            this.exerciseTypeOptions = [];
            return
        }
        this.exerciseTypeOptions.push({value: this.exerciseTypeOptions.length, label: "Add New Exercise Type"})

        for (let i = 0; i < this.props.exerciseTypes.length; i++) {
            if (this.props.exerciseTypes[i]['muscleType'] === this.state.muscleType) {
                this.exerciseTypeOptions.push({
                    value: this.exerciseTypeOptions.length,
                    label: this.props.exerciseTypes[i]['exerciseType']
                })
            }
        }
    }

    onSelectExerciseType = (value) => {
        if (value['value'] === 0) {
            this.setState({add_new_exercise: true, exerciseType: ""})
        } else {
            this.setState({add_new_exercise: false, exerciseType: value['label']})
        }
    }

    addNewExercise = () => {
        return (
            <div>
                <label>Enter new Exercise Type</label>
                <input id="tag-input" type="text"
                       value={this.state.exerciseType}
                       onChange={(event) => {
                           this.setState({exerciseType: event.target.value})
                       }}/>
            </div>)
    }

    onAddTag = () => {
        let input_tag = this.state.tag;
        if (input_tag[0] !== "#") {
            alert("Tags should start with #")
        }
        else {
            this.setState({tags: [...this.state.tags, input_tag], tag: "#"})
        }
        
    }

    onDeleteTag = (tag) => {
        const idx = this.state.tags.indexOf(tag);
        if (idx > -1) {
            if (this.state.tags.length == 1) this.setState({tags: []})
            else {
                const newTags = this.state.tags
                newTags.splice(idx, 1)
                this.setState({tags: newTags})
            }
        }
    }

    onConfirm = () => {
        if (this.state.exercise_name === "") {
            alert("Fill in the Exercise Name")
            return
        } else if (this.state.muscleType === "") {
            alert("Select the Muscle Type")
            return
        } else if (this.state.exerciseType === "") {
            alert("Select the Exercise Type")
            return
        }

        const data = {
            muscleType: this.state.muscleType,
            exerciseType: this.state.exerciseType,
            name: this.state.exercise_name,
            hardness: this.props.hardness,
            tags: {tags: this.state.tags},
            isFavorite: this.state.isFavorite,
        }

        this.props.onAddExercise(data);
        alert("Exercise " + data.name + " added to the exercise list!: " + data.muscleType + ", " + data.exerciseType);
        this.props.onGetExerciseList();
        this.props.history.push('/exercise_list')
    }

    render() {
        this.makeExerciseTypeOptions();
        this.makeMuscleTypeOptions();

        let tag_entries = []
        for (let tag of this.state.tags) {
            tag_entries.push(<div>
                {tag}
                <Button id='delete-tag' onClick={() => this.onDeleteTag(tag)}>Delete</Button>
            </div>)
        }

        return (
            <Box p = {6} id = "time_stats" display = "flex" justifyContent="center" gap = {1}>
                <Box p = {1} display = "flex" flexDirection = "column" jutifyContent = "center" gap = {2}>
                    <Menu page = "addExercise"></Menu>
                    <IconButton id = "back_button" onClick={() => this.props.history.goBack()}>
                        <ArrowBackIcon></ArrowBackIcon>
                    </IconButton>
                </Box>
                <Box sx={{width: "60%"}} >
                    <div align="center" className="AddExercise">
                        <br/>
                        <br/>
                        <h1>Add Customized Exercise</h1>
                        <hr/>
                        <div>
                            <label> Exercise Name </label>
                            <input id="exercise-name-input" type="text"
                                value={this.state.exercise_name}
                                onChange={(event) => {
                                    this.setState({exercise_name: event.target.value})
                                }}/>
                        </div>
                        <br/>
                        <div className="SettingSelect">
                            <label>Muscle Type</label>
                            <Select options={this.muscleTypeOptions} onChange={(value) => {
                                this.setState({muscleType: value['label']})
                            }}/>
                        </div>
                        <br/>
                        <div className="SettingSelect" >
                            <label>Exercise Type</label>
                            <Select options={this.exerciseTypeOptions} onChange={(value) => this.onSelectExerciseType(value)}/>
                            {this.state.add_new_exercise ? this.addNewExercise() : ""}
                        </div>
                        <br/>
                        <div>
                            <label>Tags</label>
                            <br/>
                            {tag_entries.length == 0 ? "" : tag_entries}
                            <input id="tag-input" type="text"
                                value={this.state.tag}
                                onChange={(event) => {
                                    this.setState({tag: event.target.value})
                                }}/>
                            <Button onClick={() => this.onAddTag()}>Add tag</Button>
                        </div>
                        <br/>
                        <div>
                            <label>Favorite</label>
                            <Checkbox toggle onClick={(evt, data) => this.setState({isFavorite: data.checked})}/>
                        </div>
                        <br/>
                        <div>
                            <Button id="confirm-button" onClick={() => this.onConfirm()}>Confirm</Button>
                        </div>
                        <br/>
                        <br/>
                    </div>
                </Box>
            </Box>

        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onAddExercise: (data) => dispatch(actionCreators.addExercise(data)),
        onGetExerciseList: () => dispatch(actionCreators.getExerciseList())
    }
}

const mapStateToProps = (state) => {
    return {
        muscleTypes: state.exercise.muscleTypes,
        exerciseTypes: state.exercise.exerciseTypes,
        hardness: state.setting.hardness,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddExercise));