import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actionCreators from '../../store/actions/index';
import {withRouter} from 'react-router';
import {Button} from "@mui/material";
import './WorkoutEntry.css'
import SetEntry from "../SetEntry/SetEntry";


class WorkoutEntry extends Component {

    state = {
        addSet: false,
        weight: "",
        repetition: "",
        minute: this.props.minute,
        second: this.props.second,
        isVoicePartner: this.props.isVoicePartner
    }

    onConfirmAddSet = (id) => {
        if (this.state.minute < 0 || this.state.second >= 60 || this.state.second < 0 || this.state.repetition < 0 || this.state.weight < 0) {
            alert("Wrong Input! Weight, Repetition, Second shouldn't be negative. Second should be between 0 and 59");
            return;
        }
        const data = {
            workout_entry_id: id,
            weight: this.state.weight,
            repetition: this.state.repetition,
            breaktime: this.state.minute * 60 + this.state.second
        }
        this.props.onConfirmAddSet(data);
        this.onAddSet();
    }

    onAddSet = () => {
        if (this.state.addSet) {
            this.setState({
                addSet: false,
                weight: "",
                repetition: "",
                minute: this.props.minute,
                second: this.props.second,
                isVoicePartner: this.state.isVoicePartner
            })
        } else {
            this.setState({addSet: true})
        }
    }

    addSetInputs = (id) => {
        return (
            <div>
                <p><label>Weight</label>
                    <input id="weight-input" type="number" value={this.state.weight}
                           onChange={(event) => this.setState({weight: event.target.value})}/>
                </p>
                <p><label>Repetition</label>
                    <input id="rep-input" type="number" value={this.state.repetition}
                           onChange={(event) => this.setState({repetition: event.target.value})}/></p>
                <div>
                    <p><label>Break Time</label></p>
                    <p><label>Minute</label>
                        <input id="min-input" type="number" value={this.state.minute}
                               onChange={(event) => this.setState({minute: event.target.value})}/></p>
                    <p><label>Second</label>
                        <input id="sec-input" type="number" value={this.state.second}
                               onChange={(event) => this.setState({second: event.target.value})}/></p>
                </div>

                <Button id="confirm-add-set-button" onClick={() => this.onConfirmAddSet(id)}>Add</Button>

            </div>
        )
    }

    onDeleteEntry = (id) => {
        this.props.onDeleteWorkout(id);
    }

    onCheckVoicePartner = (id)=>{
        const changed = !this.state.isVoicePartner;
        this.setState({isVoicePartner: changed});
        this.props.onCheckVoicePartner(id);
    }

    render() {
        let entry = null;
        let sets = [];

        entry = this.props.workoutEntries.find(element => element.id === this.props.id);
        sets = entry.sets;
        sets.sort((a, b) => a.id - b.id);

        let setEntries = [];
        let set_number = 0;
        for (let set of sets) {
            set_number++;
            setEntries.push(<SetEntry id={set.id} weight={set.weight} repetition={set.repetition}
                                      breaktime={set.breaktime} set_number={set_number}/>)
        }

        let exercise = null;
        exercise = this.props.exerciseList.find(element => element.id === entry.exercise_id)

        return (
                <div className="WorkoutEntry" style={{border: '1px solid orange'}}>
                <h3>{exercise.name}</h3>
                <Button id="delete-workout-entry-button" onClick={() => this.onDeleteEntry(entry.id)}>Delete</Button>
                    <label>Include in Voice Partner</label><input type="checkbox" checked={this.state.isVoicePartner} onChange={()=>this.onCheckVoicePartner(entry.id)}/>
                <Button id="add-set-button"
                    onClick={() => this.onAddSet()}>{this.state.addSet ? "Cancel" : "Add Set"}</Button>
                {this.state.addSet ? this.addSetInputs(entry.id) : ""}
                <hr/>
                {setEntries}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        workoutEntries: state.workout.workoutEntries,
        exerciseList: state.exercise.exerciseList,
        minute: state.setting.minute,
        second: state.setting.second
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onConfirmAddSet: (data) => dispatch(actionCreators.addSet(data)),
        onDeleteWorkout: (id) => dispatch(actionCreators.deleteWorkout(id)),
        onCheckVoicePartner: (id) => dispatch(actionCreators.checkVoicePartner(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(WorkoutEntry));