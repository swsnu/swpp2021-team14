import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actionCreators from '../../store/actions/index';
import {withRouter} from 'react-router';
import {Button} from "@mui/material";
import './WorkoutEntry.css'


class WorkoutEntry extends Component {

    state = {
        addSet: false,
        weight: "",
        repetition: "",
        minute: this.props.minute,
        second: this.props.second
    }

    onConfirmAddSet = () => {
        if (this.state.minute < 0 || this.state.second >= 60 || this.state.second < 0 || this.state.repetition < 0 || this.state.weight < 0) {
            alert("Wrong Input! Weight, Repetition, Second shouldn't be negative. Second should be between 0 and 59");
            return;
        }

        this.props.onConfirmAddSet();
    }

    onAddSet = ()=>{
        if(this.state.addSet){
            this.setState({
                addSet: false,
                weight: "",
                repetition: "",
                minute: this.props.minute,
                second: this.props.second
            })
        }
        else{
            this.setState({addSet: true})
        }
    }

    addSetInputs = () => {
        return (
            <div>
                <p><label>Weight</label>
                    <input type="number" value={this.state.weight}
                           onChange={(event) => this.setState({weight: event.target.value})}/>
                </p>
                <p><label>Repetition</label>
                    <input type="number" value={this.state.repetition}
                           onChange={(event) => this.setState({repetition: event.target.value})}/></p>
                <div>
                    <p><label>Break Time</label></p>
                    <p><label>Minute</label>
                        <input type="number" value={this.state.minute}
                               onChange={(event) => this.setState({minute: event.target.value})}/></p>
                    <p><label>Second</label>
                        <input type="number" value={this.state.second}
                               onChange={(event) => this.setState({second: event.target.value})}/></p>
                </div>

                <Button onClick={() => this.onConfirmAddSet()}>Add</Button>

            </div>
        )
    }

    render() {
        let entry = null;
        let sets = [];

        if (this.props.workoutEntries != null) {
            entry = this.props.workoutEntries.find(element => element.id === this.props.id);
            sets = entry.sets;
        }

        let exercise = null;
        if (entry != null) {
            exercise = this.props.exerciseList.find(element => element.id === entry.exercise_id)
        }

        return (
            <div className="WorkoutEntry" style={{border: '1px solid orange'}}>
                <h3>{entry === null ? "" : exercise.name}</h3>
                <Button
                    onClick={() =>this.onAddSet()}>{this.state.addSet ? "Cancel" : "Add Set"}</Button>
                {this.state.addSet ? this.addSetInputs() : ""}
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

const mapDispatchToProps = (dispatch)=>{
    return{
        onConfirmAddSet: () => dispatch()
    }
}

export default connect(mapStateToProps, null)(withRouter(WorkoutEntry));