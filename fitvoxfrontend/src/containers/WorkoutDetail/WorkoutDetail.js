import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';
import { withRouter } from 'react-router';
import {Button} from "@mui/material";
import './WorkoutDetail.css'
import WorkoutEntry from "../WorkoutEntry/WorkoutEntry";

class WorkoutDetail extends Component {

    componentDidMount() {
        this.props.onGetWorkout(this.props.match.params.date);
    }

    onAddWorkout = ()=>{
        this.props.history.push('/workout/'+ this.props.match.params.date + '/add');
    }

    compareEntry = (a, b) =>{
        return a.id-b.id
    }

    render() {

        let workoutEntries = []
        if(this.props.workoutEntries!=null){
            this.props.workoutEntries.sort(this.compareEntry)

            for(let entry of this.props.workoutEntries){
                workoutEntries.push(<WorkoutEntry id={entry['id']} />)
            }
        }

        return (
            <div className="WorkoutDetail" align="center">
                <div>
                    <h1>Workout Detail</h1>
                    <Button onClick={()=>this.onAddWorkout()}>Add Exercise to workout</Button>
                    <hr/>
                    {workoutEntries}
                </div>

            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) =>{
    return {
        onGetWorkout: (data)=>dispatch(actionCreators.getWorkout(data))
    }
}

const mapStateToProps = (state)=>{
    return{
        workoutEntries: state.workout.workoutEntries
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(WorkoutDetail));