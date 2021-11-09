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
        tags: null
    }

    onMuscleTypeClick(muscleType) {
        this.setState({muscleType_selected: true})
        this.setState({muscleType: muscleType})
    }

    onExerciseTypeClick(exerciseType) {
        this.setState({exerciseType_selected: true})
        this.setState({exerciseType: exerciseType})
    }

    onExerciseEntryClick = (name)=>{
        // Should Fix
        this.props.history.push('/main')
    }

    onGoBackMuscleType = () => {
        this.setState({muscleType_selected: false})
        this.setState({muscleType: null})
        this.setState({exerciseType_selected: false})
        this.setState({exerciseType: null})
    }

    onGoBackExerciseType = () => {
        this.setState({exerciseType_selected: false})
        this.setState({exerciseType: null})
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
                    <h1>Select Exercise Type</h1>
                    <h2>Selected Muscle Type: {this.state.muscleType}</h2>
                    <div>
                        <button onClick={() => this.onGoBackMuscleType()}>Select Muscle Type again</button>
                    </div>
                    <div>{exerciseTypeIcons}</div>
                </div>
            )
        } else {
            let exerciseEntries = ""
            if (this.props.exerciseList!= null) {
                exerciseEntries = []
                for (let exercise of this.props.exerciseList) {
                    if (exercise['muscleType'] === this.state.muscleType &&
                    exercise['exerciseType']===this.state.exerciseType)
                    //  && exercise['hardness'].indexOf(this.state.hardness)!==-1
                    {
                        const name = exercise['name']
                        exerciseEntries.push(<ExerciseEntry name={name}
                                                                 onClick={() => this.onExerciseEntryClick(name)}/>)
                    }
                }
            }

            return (
                <div>
                    <h2>Selected Muscle Type: {this.state.muscleType}</h2>
                    <h2>Selected Exercise Type: {this.state.exerciseType}</h2>
                    <div>
                        <button onClick={() => this.onGoBackMuscleType()}>Select Muscle Type again</button>
                        <button onClick={()=>this.onGoBackExerciseType()}>Select Exercise Type again</button>
                    </div>
                    <div>
                        <h2>Add tags</h2>
                        <input type="text"/>
                        <button>Add</button>
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