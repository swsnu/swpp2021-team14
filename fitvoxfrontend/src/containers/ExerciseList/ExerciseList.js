import React, {Component} from 'react';
import Logout from "../Logout/Logout";
import * as actionCreators from "../../store/actions"
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import MuscleTypeIcon from "../../components/MuscleTypeIcon/MuscleTypeIcon";
import ExerciseTypeIcon from "../../components/ExerciseTypeIcon/ExerciseTypeIcon";
import ExerciseEntry from "../../components/ExerciseEntry/ExerciseEntry";

class ExerciseList extends Component {

    state = {
        muscleType_selected: false,
        exerciseType_selected: false,
        muscleType: null,
        exerciseType: null,
        tags: [],
        tag: "#",
        query: [],
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

    onExerciseEntryClick = (name) => {
        // Should Fix
        this.props.history.push('/exercise_list/'+name)
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
        if (idx > -1) {
            if (this.state.tags.length == 1) this.setState({tags: []})
            else {
                const newTags = this.state.tags.splice(idx, 1)
                this.setState({tags: newTags})
            }
        }
    }

    onAddExercise = () => {
        this.props.history.push('/exercise_list/add')
    }

    addExerciseButton = () => {
        return (<div>
            <h2>Add new Exercise?</h2>
            <button id='add-new-exercise' onClick={() => this.onAddExercise()}>Add new exercise</button>
        </div>)
    }

    addTag = () => {
        let add_tag_button = (<button id="search-with-tag"
                                      style={{width: '5%', height: 100}}
                                      onClick={() => this.onSearchTagHandler()}>
            Add Tag
        </button>)
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

    render() {
        if (!this.state.muscleType_selected) {
            let muscleTypeIcons = "";
            if (this.props.muscleTypes != null) {
                muscleTypeIcons = this.props.muscleTypes.map(muscleType => {
                    return (
                        <MuscleTypeIcon muscleType={muscleType} onClick={() => this.onMuscleTypeClick(muscleType)}/>)
                })
            }
            return (
                <div>
                    {this.addExerciseButton()}
                    <h1>Select Muscle Type</h1>
                    <div>{muscleTypeIcons}</div>
                </div>
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
                <div>
                    {this.addExerciseButton()}
                    <h1>Select Exercise Type</h1>
                    <div>
                        <h2>Selected Muscle Type: {this.state.muscleType}</h2>
                        <button onClick={() => this.onGoBackMuscleType()}>Select Muscle Type again</button>
                    </div>
                    <div>{exerciseTypeIcons}</div>
                </div>
            )
        } else {
            let exerciseEntries = ""
            if (this.props.exerciseList != null) {
                exerciseEntries = []
                for (let exercise of this.props.exerciseList) {
                    console.log('hardness')
                    if (exercise['muscleType'] === this.state.muscleType &&
                        exercise['exerciseType'] === this.state.exerciseType
                        && exercise['hardness'].indexOf(this.props.hardness)!==-1)

                    {
                        if (this.state.tags.length === 0) {
                            const name = exercise['name']
                            exerciseEntries.push(<ExerciseEntry name={name}
                                                                onClick={() => this.onExerciseEntryClick(name)}/>)
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
                                                                    onClick={() => this.onExerciseEntryClick(name)}/>)
                            }
                        }
                    }
                }
            }

            let tag_entries = []
            for (let tag of this.state.tags) {
                tag_entries.push(<div>
                    {tag}
                    <button id='delete-tag' onClick={() => this.onDeleteTag(tag)}>Delete</button>
                </div>)
            }

            return (
                <div>
                    {this.addExerciseButton()}
                    <div>
                        <h2>Selected Muscle Type: {this.state.muscleType}</h2>
                        <button onClick={() => this.onGoBackMuscleType()}>Select Muscle Type again</button>
                    </div>

                    <div>
                        <h2>Selected Exercise Type: {this.state.exerciseType}</h2>
                        <button onClick={() => this.onGoBackExerciseType()}>Select Exercise Type again</button>
                    </div>
                    <div>
                        <h2>Selected Tags</h2>
                        {tag_entries.length == 0 ? "None" : tag_entries}
                    </div>
                    <div>
                        {this.addTag()}
                    </div>
                    <div>
                        {exerciseEntries}
                    </div>
                </div>
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

export default connect(mapStateToProps, null)(withRouter(ExerciseList));